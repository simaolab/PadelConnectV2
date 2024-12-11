<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cancellation;
use App\Http\Requests\StoreCancellationRequest;
use App\Http\Requests\UpdateCancellationRequest;

class CancellationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Retrieves the authenticated user's ID
            $userId = auth()->id();
            // Recover the logged-in user and check their role
            $user = auth()->user();

            // Check if the user has the admin role (role_id = 1)
            if ($user->role_id === 1) {
                // If admin, returns all cancellations with booking information
                $cancellations = Cancellation::with(['reservation.fields'])->get();
            } else {
                // If the user is not admin, it does not return cancellations
                return response()->json([
                    'message' => 'Não tem permissão para visualizar os cancelamentos.'
                ], 403);
            }

            // If there are no cancellations, returns a message stating
            if ($cancellations->isEmpty()) {
                return response()->json([
                    'message' => 'Nenhum cancelamento encontrado.',
                    'cancellations' => []
                ]);
            }

            // Prepare the answer
            $response = [
                'cancellations' => $cancellations
            ];

            // Returns the cancellations
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
    public function store(StoreCancellationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Cancellation $cancellation)
    {
        //
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
