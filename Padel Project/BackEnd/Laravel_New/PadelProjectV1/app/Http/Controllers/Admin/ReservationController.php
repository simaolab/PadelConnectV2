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
use Exception as GlobalException;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try
        {
            $reservations = Reservation::with('fields')->get();
            // If table Reservation does not have any data echo a message else show data
            if ($reservations->isEmpty()) {
                return response()->json([
                    'message'   => 'Esta lista ainda não contém dados.',
                    'reservations'     => []
                ]);
            }
            else {
                return response()->json(
                    [
                        'reservations' => $reservations
                    ], 200);
            }
        }
        catch(\Exception $exception)
        {
            return response()->json(['error' => $exception], 500);
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
        $validatedData = $request->validated();

        // Extract and format the dates
        $reservationData = Arr::except($validatedData, ['fields']);
        $reservationData['start_date'] = Carbon::createFromFormat('d/m/Y', $reservationData['start_date'])->format('Y-m-d');
        $reservationData['end_date'] = Carbon::createFromFormat('d/m/Y', $reservationData['end_date'])->format('Y-m-d');

         // Check if there is an existing reservation conflicting with the provided dates
        $conflictDate = Reservation::where('start_date', '<=', $reservationData['end_date'])
            ->where('end_date', '>=', $reservationData['start_date'])
            ->exists();

        if ($conflictDate) {
            return response()->json([
                'status' => 'error',
                'message' => 'Já existe uma reserva para as datas selecionadas.',
            ], 409);
        }


        $reservation = Reservation::create($reservationData);
        $reservation->fields()->sync($request->input('fields'));

        return response()->json([
            'status' => 'success',
            'message' => 'Reserva criada com sucesso.',
            'reservation' => $reservation->load('fields'),
        ], 201);
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


}
