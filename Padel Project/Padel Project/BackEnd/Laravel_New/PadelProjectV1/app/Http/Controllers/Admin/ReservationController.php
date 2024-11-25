<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Exception;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

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
                    'message'   => 'Esta lista ainda não contém dados..',
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
        // Verify the data sent
        // validated() follows the StoreReservationRequest rules
        $validatedData = $request->validated();

        // Remove the 'fields' key from the validated data
        //Use of Arr::except: This helper is designed to exclude specified keys from an array.
        $reservationData = Arr::except($validatedData, ['fields']);

        // Create a new reservation with the verified data
        $reservation = Reservation::create($reservationData);

        // Sync the fields relationship
        $reservation->fields()->sync($request->input('fields'));

        // Fetch the newly created reservation with its related fields
        $newReservation = Reservation::where('id', $reservation->id)->with('fields')->get();

        return response()->json([
            'message' => 'Reserva criada com sucesso.',
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
                    'message' => 'Reserva atualizada com sucesso!'
                ], 200);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $reservationId)
    {
        try {
            // Locate the reservation by its ID
            $reservation = Reservation::find($reservationId);

            // Check if the reservation exists
            if (!$reservation) {
                // Return a 404 response if the reservation is not found
                return response()->json(['message' => 'Reserva não foi encontrada!'], 404);
            }

            // Check if a specific field ID is provided in the request
            if ($request->has('field_id')) {
                $fieldId = $request->input('field_id'); // Get the 'field_id' from the request

                $fieldName = $reservation->fields()->where('fields.id', $fieldId)->value('name');
                // Check if the specified field is associated with the reservation
                if ($reservation->fields()->where('fields.id', $fieldId)->exists()) {
                    // If associated, detach (remove) the specific field from the reservation
                    $reservation->fields()->detach($fieldId);

                    // Return a success response with the updated list of fields
                    return response()->json([
                        'message' => "Campo (Nome: $fieldName) elminado da reserva com sucesso!",
                    ], 200);
                } else {
                    // Return a 404 error if the field is not associated with the reservation
                    return response()->json(['message' => "Campo (Nome: $fieldName) não está acossiado a esta reserva"], 404);
                }
            }

            // If no 'field_id' is provided, delete the entire reservation
            $reservation->delete();

            // Return a success response confirming the reservation was deleted
            return response()->json([
                'message' => 'Reserva foi eleminada com sucesso!',
            ], 200);
        } catch (Exception $exception) {
            // Catch any exceptions and return a 500 error with the exception message
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
