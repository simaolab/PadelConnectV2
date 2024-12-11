<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Requests\StoreCancellationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Mail\ReservationCompleted;
use App\Mail\CancellationNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\Reservation;
use App\Models\Field;
use App\Models\Cancellation;

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
            // Retrieve the authenticated user and check their role
            $user = auth()->user();

            // Initialize the variable to store the reservations
            $reservations = [];

            // Check if the user has the role of admin (role_id = 1)
            if ($user->role_id === 1) {
                // If the user is admin, return all reservations with associated user information
                $reservations = Reservation::with(['fields', 'user'])->get();
            } elseif ($user->role_id === 2) {
                // If the user is from role 2 (company), return reservations associated with the company's fields
                // Retrieve the company associated with the logged-in user
                $company = $user->company;

                // Retrieve the reservations related to the fields of the user's company
                $reservations = Reservation::with(['fields' => function($query) use ($company) {
                    // Check if the field belongs to the user's company
                    $query->where('company_id', $company->id);
                }])->whereHas('fields', function($query) use ($company) {
                    // Additional filter to ensure the reservation is for a field belonging to the company
                    $query->where('company_id', $company->id);
                })->get();
            } else {
                // Otherwise, return only the reservations of the logged-in user
                $reservations = Reservation::with('fields')->where('user_id', $userId)->get();
            }

            if ($reservations->isEmpty()) {
                return response()->json([
                    'message' => 'No reservations found.',
                    'reservations' => []
                ]);
            }

            // Prepare the response
            $response = [
                'reservations' => $reservations
            ];

            // Add the user information only if the user is an admin
            if ($user->role_id === 1) {
                $response['user'] = $user;
            }

            // Return the reservations (and admin info if applicable)
            return response()->json($response, 200);

        } catch (\Exception $exception) {
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
            // Validate the received data
            $validatedData = $request->validated();
            $reservations = [];

            foreach ($validatedData['reservations'] as $reservationData) {
                // Extract the field IDs and remove from the main input
                $fields = $reservationData['fields'];
                unset($reservationData['fields']);

                // Add mandatory additional information
                $reservationData['user_id'] = auth()->id();
                $reservationData['status'] = $validatedData['status'];
                $reservationData['privacy_policy'] = $validatedData['privacy_policy'];

                // Convert the dates to the correct format
                $reservationData['start_date'] = Carbon::createFromFormat('d/m/Y H:i', $reservationData['start_date'])->format('Y-m-d H:i:s');
                $reservationData['end_date'] = Carbon::createFromFormat('d/m/Y H:i', $reservationData['end_date'])->format('Y-m-d H:i:s');

                // Create the reservation
                $reservation = Reservation::create($reservationData);

                $detailedFields = []; // List to store field details

                if (!empty($fields)) {
                    foreach ($fields as $fieldId) {
                        // Associate the fields with the reservation in the pivot table
                        $reservation->fields()->attach($fieldId, [
                            'start_date' => $reservationData['start_date'],
                            'end_date' => $reservationData['end_date']
                        ]);

                        // Get the details of the field and company
                        $field = Field::with('company')->find($fieldId);

                        if ($field) {
                            $pivotData = $reservation->fields()
                                ->where('fields.id', $fieldId)
                                ->first()
                                ->pivot;

                            // Add the field details and pivot information
                            $detailedFields[] = [
                                'field' => $field,
                                'pivot' => [
                                    'start_date' => $pivotData->start_date,
                                    'end_date' => $pivotData->end_date
                                ]
                            ];
                        }
                    }
                }

                // Add the complete field details to the reservation object
                $reservation->detailed_fields = $detailedFields;

                // Store the reservation in the list
                $reservations[] = $reservation;
            }

            // If there are reservations, send an email to the authenticated user
            if (!empty($reservations)) {
                $user = auth()->user(); // Authenticated user
                $userEmail = $user->email;

                // Send the email with the Mailable
                Mail::to($userEmail)->send(new ReservationCompleted($reservations, $user));
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Reservations created successfully.',
                'user' => $user,
                'reservations' => $reservations
            ], 201);

        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Error creating the reservations: ' . $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($reservationId)
    {

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
                'message' => 'Reservation not found!'
            ], 404); }
        else
        {
            $updatedReservation->update($request->validated());
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Reservation updated successfully!'
                ], 200);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StoreCancellationRequest $request, $reservationId)
    {
        try {
            $reservation = Reservation::find($reservationId);

            if (!$reservation) {
                return response()->json(['message' => 'Reservation not found'], 404);
            }

            $data = $request->validated();

            // Calculate the remaining time for the reservation
            $reservationDate = Carbon::createFromFormat('d/m/Y H:i', $reservation->start_date);
            $todayDate = Carbon::now();
            $diff = $todayDate->diffInHours($reservationDate);
            $totalRefunded = $reservation->total;

            // Calculate the refund based on the remaining time
            if ($diff <= 24) {
                $totalRefunded = 0; // No refund if less than 24 hours left
            } elseif ($diff < 48) {
                $totalRefunded *= 0.5; // 50% refund if between 24 and 48 hours left
            }

            // Create a cancellation record before deleting the reservation
            $cancellation = Cancellation::create([
                'reservation_id' => $reservation->id,
                'reason' => $data['reason'] ?? null, // Here the reason is assigned from the request
                'total_refunded' => $totalRefunded,
                'status' => $data['status'] ?? 'Cancelled', // Status is optional, so assign 'Cancelled' if not provided
                'cancellation_date' => now(), // Automatic record of cancellation date
            ]);

            // Delete the reservation and associated records in the pivot table
            $reservation->delete();

           	$reservation->status = 'Cancelled';
        	$reservation->save();


          	\Mail::to($reservation->user->email)->send(new CancellationNotification($reservation, $reservation->user));

            return response()->json([
                'status' => 'success',
                'message' => 'Reservation ' . $reservationId . ' successfully deleted',
                'cancellation' => $cancellation,
            ], 200);

        } catch (\Exception $exception) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting the reservation: ' . $exception->getMessage()
            ], 500);
        }
    }


    public function search($typeReservation = null)
    {

        try {
            //If something was sent in the route
            if ($typeReservation) {
                //Get all reservations that match the data sent
                $reservations = Reservation::where('address', 'LIKE', '%' . $typeReservation . '%')->get();
            }

            return response()->json([
                'message' => 'Search results:',
                'reservations' => $reservations
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error searching for reservation!',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function checkAvailability(Request $request)
    {
        try {
            // Validate the received data
            $validatedData = $request->validate([
                'start_date' => 'required|date_format:d/m/Y H:i:s',
                'end_date' => 'required|date_format:d/m/Y H:i:s',
                'field' => 'required|exists:fields,id',
            ]);

            // Convert the dates to the appropriate format and remove seconds
            $startDate = Carbon::createFromFormat('d/m/Y H:i:s', $validatedData['start_date'])->setSecond(0);
            $endDate = Carbon::createFromFormat('d/m/Y H:i:s', $validatedData['end_date'])->setSecond(0);

            // Check if the reservation spans across multiple days
            if ($startDate->toDateString() !== $endDate->toDateString()) {
                return response()->json([
                    'available' => false,
                    'message' => 'Reservations cannot span more than one day.',
                ], 400);
            }

            // Get the day of the week
            $dayOfWeek = strtolower($startDate->format('l')); // Example: 'monday', 'tuesday'

            // Get the field's working hours
            $field = Field::find($validatedData['field']);
            $schedule = $field->schedules()->where('day_of_week', $dayOfWeek)->first();

            if (!$schedule) {
                return response()->json([
                    'available' => false,
                    'message' => 'The field does not have working hours registered for the selected day.',
                ], 400);
            }

            // Check if the field is closed on this day
            if ($schedule->is_closed) {
                return response()->json([
                    'available' => false,
                    'message' => 'The field is closed on the selected day.',
                ], 400);
            }

            // Convert the working hours to Carbon objects
            $openingTime = Carbon::parse($schedule->opening_time, $startDate->timezone)
                ->setDate($startDate->year, $startDate->month, $startDate->day);
            $closingTime = Carbon::parse($schedule->closing_time, $startDate->timezone)
                ->setDate($startDate->year, $startDate->month, $startDate->day);

            // Validate the time
            if ($startDate->lt($openingTime) || $endDate->gt($closingTime)) {
                return response()->json([
                    'available' => false,
                    'message' => 'The selected dates are outside the field\'s operating hours.',
                ], 400);
            }

            // Check for reservation conflicts
            $conflictingReservations = DB::table('field_reservation')
                ->where('field_id', $validatedData['field'])
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                          ->orWhereBetween('end_date', [$startDate, $endDate])
                          ->orWhere(function ($query) use ($startDate, $endDate) {
                              $query->where('start_date', '<=', $startDate)
                                    ->where('end_date', '>=', $endDate);
                          });
                })
                ->exists();

            if ($conflictingReservations) {
                return response()->json([
                    'available' => false,
                    'message' => 'There is already a reservation for the selected dates.',
                ], 409);
            }

            return response()->json([
                'available' => true,
                'message' => 'The dates are available.',
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Error checking availability: ' . $exception->getMessage(),
            ], 500);
        }
    }

}
