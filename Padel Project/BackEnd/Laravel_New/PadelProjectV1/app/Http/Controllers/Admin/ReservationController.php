<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Exception;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\Reservation;
use App\Models\Cancellation;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Http\Requests\StoreCancellationRequest;
use Carbon\Carbon;
use App\Models\Field;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationCompleted;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Retrieve the authenticated user's ID
            $userId = auth()->id();
            // Retrieve the logged-in user and check their role
            $user = auth()->user();

            // Check if the user has the admin role (role_id = 1)
            if ($user->role_id === 1) {
                // If the user is an admin, return all reservations
                $reservations = Reservation::with('fields')->get();
            } else {
                // Otherwise, return only the reservations of the logged-in user
                $reservations = Reservation::with('fields')->where('user_id', $userId)->get();
            }

            // If no reservations are found, return a message indicating this
            if ($reservations->isEmpty()) {
                return response()->json([
                    'message' => 'You do not have any reservations yet.',
                    'reservations' => []
                ]);
            } else {
                // Return the user's reservations
                return response()->json([
                    'reservations' => $reservations
                ], 200);
            }
        } catch (\Exception $exception) {
            // In case of an error, return an error message
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        try {
            $validatedData = $request->validated();

            // Initialize an array to store the created reservations
            $reservations = [];

            // Loop through each reservation in the 'reservations' array
            foreach ($validatedData['reservations'] as $reservationData) {
                // Store the 'fields' temporarily and remove it from the reservation data
                $fields = $reservationData['fields'];
                unset($reservationData['fields']); // Remove 'fields' from the reservation data

                $reservationData['user_id'] = auth()->id(); // Get the authenticated user's ID
                $reservationData['status'] = $validatedData['status'];
                $reservationData['privacy_policy'] = $validatedData['privacy_policy'];

                // Convert the start_date and end_date to the correct format for the database
                $reservationData['start_date'] = Carbon::createFromFormat('d/m/Y H:i', $reservationData['start_date'])->format('Y-m-d H:i:s');
                $reservationData['end_date'] = Carbon::createFromFormat('d/m/Y H:i', $reservationData['end_date'])->format('Y-m-d H:i:s');

                // Create the reservation in the database
                $reservation = Reservation::create($reservationData);

                // Initialize an array to store detailed field information
                $detailedFields = [];

                // If fields are provided, associate them with the reservation
                if (!empty($fields)) {
                    foreach ($fields as $fieldId) {
                        // Associate the field to the reservation in the 'field_reservation' table
                        $reservation->fields()->attach($fieldId, [
                            'start_date' => $reservationData['start_date'],
                            'end_date' => $reservationData['end_date']
                        ]);

                        // Retrieve detailed information about the field and the associated company
                        $field = Field::with('company')->find($fieldId);

                        // If the field is found, add its details to the list
                        if ($field) {
                            $detailedFields[] = [
                                'field' => $field,
                                'pivot' => [
                                    'start_date' => $reservationData['start_date'],
                                    'end_date' => $reservationData['end_date']
                                ]
                            ];
                        }
                    }
                }

                // Add the detailed field information to the reservation object
                $reservation->detailed_fields = $detailedFields;

                // Add the reservation to the array of created reservations
                $reservations[] = $reservation;
            }

            if (!empty($reservations)) {
                $userEmail = auth()->user()->email; // Get the email of the authenticated user

                // Send the email with the 'ReservationCompleted' Mailable, passing all the reservations and user
                Mail::to($userEmail)->send(new ReservationCompleted($reservations, auth()->user()));
            }

            // Return a success response with the created reservations
            return response()->json([
                'status' => 'success',
                'message' => 'Reservations created successfully.',
                'reservations' => $reservations
            ], 201);

        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Error creating reservations: ' . $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($reservationId)
    {
        //Search for the reservation
        $reservation = Reservation::with('fields')->find($reservationId);

        //If the reservation does not exist show message error else show reservation
        if (!$reservation) { return response()->json(
            [
                'message' => 'Reserva não foi encontrada!'
            ], 404); }
        else {
            return response()->json(
                [
                    'reservation' => $reservation
                ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, $reservationId)
    {
            // Locate the reservation
            $reservation = Reservation::find($reservationId);

            // Check if the reservation exists
            if (!$reservation) {
                return response()->json(['error' => 'Reservation not found!'], 404);
            }

            // Validate the request data
            $validatedData = $request->validated();

            // Remove the 'fields' key from the validated data
            $reservationData = Arr::except($validatedData, ['fields']);

            // Update the reservation data
            $reservation->update($reservationData);

            // Sync the 'fields' relationship
            if ($request->has('fields')) {
                $reservation->fields()->sync($request->input('fields'));
            }

            // Fetch the updated reservation with its relationships
            $updatedReservation = Reservation::where('id', $reservation->id)->with('fields')->first();
        if(!$updatedReservation){ return response()->json(
            [
                'message' => 'Reserva não foi encontrada!'
            ], 404); }
        else
        {
            $updatedReservation->update($request->validated());
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Reserva atualizada com sucesso!'
                ], 200);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StoreCancellationRequest $request, $reservationId)
    {
        try {
            // Locate the reservation by its ID
            $reservation = Reservation::find($reservationId);

            // Check if the reservation exists
            if (!$reservation) {
                return response()->json(['message' => 'Reservation not found!'], 404);
            }

            // The data has already been validated by the StoreCancellationRequest
            $data = $request->validated();

            $reservationDate = Carbon::createFromFormat('d/m/Y', $reservation->start_date);
            $todayDate = Carbon::now();
            $diff = $todayDate->diffInHours($reservationDate);
            $totalRefunded = $reservation->total;

            if($diff <= 24)
            {
                $totalRefunded = 0;
            }
            elseif ($diff < 48)
            {
                $totalRefunded *= 0.5;
            }

            // Create a cancellation record before deleting the reservation
            $cancellation = Cancellation::create([
                'reservation_id' => $reservation->id,
                'reason' => $data['reason'] ?? null,
                'total_refunded' => $totalRefunded,
                'status' => $data['status'],
                'cancellation_date' => $data['cancellation_date'] ?? now(),
            ]);

            // Check if a specific field (field_id) was provided
            if ($request->has('field_id')) {
                $fieldId = $request->input('field_id');
                $fieldName = $reservation->fields()->where('fields.id', $fieldId)->value('name');

                if ($reservation->fields()->where('fields.id', $fieldId)->exists()) {
                    // Detach the field from the reservation if it exists
                    $reservation->fields()->detach($fieldId);

                    return response()->json([
                        'message' => "Field (Name: $fieldName) successfully removed from the reservation!",
                        'cancellation' => $cancellation,
                    ], 200);
                } else {
                    // Return an error if the field is not associated with the reservation
                    return response()->json(['message' => "Field (Name: $fieldName) is not associated with this reservation"], 404);
                }
            }

            // Delete the entire reservation if no specific field was removed
            $reservation->delete();

            return response()->json([
                'message' => 'Reservation successfully deleted!',
                'cancellation' => $cancellation,
            ], 200);

        } catch (\Exception $exception) {
            // Return a server error if an exception is thrown
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function search($typeReservation = null)
    {

        try {
            //If something was sent in the route
            if ($typeReservation) {
                //Get all reservations that matches with the data sent
                $reservations = Reservation::where('address', 'LIKE', '%' . $typeReservation . '%')->get();
            }

            //Return the data
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'reservations' => $reservations
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar a reserva!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function indexDeleted()
    {
        try {
            // Fetches all reservations that have been deleted
            $deletedReservations = Reservation::onlyTrashed()->with('fields')->get();

            // Checks if there are any deleted reservations
            if ($deletedReservations->isEmpty()) {
                return response()->json(['message' => 'Não existem reservas eliminadas'], 404);
            }
            return response()->json([
                'message' => 'Reservas eliminadas com sucesso',
                'reservations_deleted' => $deletedReservations
            ], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }


    public function checkAvailability(Request $request)
{
    try {
        $validatedData = $request->validate([
            'start_date' => 'required|date_format:d/m/Y H:i:s',
            'end_date' => 'required|date_format:d/m/Y H:i:s',
            'field' => 'required|exists:fields,id',
        ]);

        // Convert the input dates to the format used in the database, removing seconds for consistency
        $startDate = Carbon::createFromFormat('d/m/Y H:i:s', $validatedData['start_date'])->setSecond(0)->format('Y-m-d H:i:s');
        $endDate = Carbon::createFromFormat('d/m/Y H:i:s', $validatedData['end_date'])->setSecond(0)->format('Y-m-d H:i:s');

        // Query the database for conflicting reservations for the provided field and dates
        $conflictingReservations = DB::table('field_reservation')
            ->where('field_id', $validatedData['field'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                      ->orWhereBetween('end_date', [$startDate, $endDate])
                      ->orWhere(function($query) use ($startDate, $endDate) {
                          $query->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                      });
            })
            ->exists();

        if ($conflictingReservations) {
            return response()->json([
                'available' => false,
                'message' => 'Já existe uma reserva para as datas selecionadas.',
            ], 409);
        }

        return response()->json([
            'available' => true,
            'message' => 'As datas estão disponíveis.',
        ], 200);
    } catch (\Exception $exception) {
        return response()->json([
            'error' => 'Erro ao verificar disponibilidade: ' . $exception->getMessage(),
        ], 500);
    }
}
}
