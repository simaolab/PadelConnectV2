<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cancellation;
use App\Http\Requests\StoreCancellationRequest;
use App\Http\Requests\UpdateCancellationRequest;
use App\Models\Reservation;
use Illuminate\Http\Request;

class CancellationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Retrieve all cancellations, including associated reservations and their fields
            $cancellations = Cancellation::with('reservation.fields')->get();

            if ($cancellations->isEmpty()) {
                return response()->json(['message' => 'No cancellations found'], 404);
            }

            // Map through cancellations to include removed fields and distinguish cancellation types
            $cancellations->map(function ($cancellation) {
                if ($cancellation->reservation) {
                    // Case where the reservation has been completely removed
                    if (!$cancellation->field_removed) {
                        $cancellation->type = 'Field removed from the reservation';

                        // Include the reservation fields, but only the field IDs
                        if ($cancellation->reservation->fields) {
                            $cancellation->reservation_fields = $cancellation->reservation->fields->pluck('id');
                        } else {
                            $cancellation->reservation_fields = [];
                        }

                    } else {
                        // Case where only a specific field was removed
                        $cancellation->type = 'Field removed';
                        $cancellation->field_id = $cancellation->field_removed;
                        $cancellation->reservation_fields = null;
                    }
                } else {
                    // If the reservation doesn't exist
                    $cancellation->type = 'Reservation deleted';
                    $cancellation->field_id = null;
                    $cancellation->reservation_fields = [];
                    $cancellation->reservation = null;
                }

                return $cancellation;
            });

            return response()->json([
                'message' => 'Cancellations retrieved successfully',
                'cancellations' => $cancellations
            ], 200);

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
    public function store(StoreCancellationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // Retrieve the specific cancellation by ID, including the related reservation and its fields
            $cancellation = Cancellation::with('reservation.fields')->find($id); // Load the relation with the reservation and its fields


            // Check if the cancellation exists
            if (!$cancellation) {
                return response()->json(['message' => 'Cancellation not found'], 404);
            }

            // Process the cancellation data
            // Check if the 'reservation' relation is loaded and exists
            if ($cancellation->reservation) {
                // If the reservation has been completely removed
                if (!$cancellation->field_removed) {
                    $cancellation->type = 'Field eliminated from reservation';

                    // Include the reservation fields, but only the ID of the fields
                    if ($cancellation->reservation->fields) {
                        $cancellation->reservation_fields = $cancellation->reservation->fields->pluck('id');
                    } else {
                        $cancellation->reservation_fields = [];
                    }

                } else {
                    // If only one field was removed
                    $cancellation->type = 'Field removed';
                    $cancellation->field_id = $cancellation->field_removed;
                    $cancellation->reservation_fields = null;  // No fields listed since it is a single removed field

                    // Include the reservation related to the removed field
                    $cancellation->reservation = $cancellation->reservation;
                }
            } else {
                // If the reservation does not exist, mark it as "Reservation eliminated"
                $cancellation->type = 'Reservation eliminated';
                $cancellation->field_id = null;
                $cancellation->reservation_fields = [];
                $cancellation->reservation = null;
            }

            return response()->json([
                'message' => 'Cancellation retrieved successfully',
                'cancellation' => $cancellation
            ], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cancellation $cancellation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCancellationRequest $request, Cancellation $cancellation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cancellation $cancellation)
    {
        //
    }
}
