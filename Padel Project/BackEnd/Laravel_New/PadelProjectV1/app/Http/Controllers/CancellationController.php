<?php

namespace App\Http\Controllers;

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
        //1
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
