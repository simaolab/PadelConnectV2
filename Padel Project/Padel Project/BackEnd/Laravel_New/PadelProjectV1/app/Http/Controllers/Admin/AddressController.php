<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $addresses = Address::all();
        // If table Address does not have any data show a message
        if ($addresses->isEmpty())
        {
            return response()->json(
            [
                'message'   => 'Esta lista ainda não contém dados.',
                'addresses'     => []
            ], 200);
        }
        // Else, show addresses data
        else
        {
            return response()->json(
            [
                'addresses' => $addresses
            ], 200);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //Not used, only for view
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAddressRequest $request)
    {
        //Verify the data from request
        //validated() follows the StoreAddressRequest rules
        $validatedData = $request->validated();

        //Create a new address with the verified data
        $address = Address::create($validatedData);
        return response()->json(
            [
                'message'   => 'Morada '. $address->address .' criada com sucesso!'
            ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($addressId)
    {
        //Search for the address
        $address = Address::find($addressId);

        //If the address does not exist show message error, else show address
        if (!$address) { return response()->json(
            [
                'message' => 'Morada não foi encontrada!'
            ], 404); }
        else {
            return response()->json(
                [
                    'address' => $address
                ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Address $address)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAddressRequest $request, $addressId)
    {
        //Search for the Address
        $address = Address::find($addressId);
        //If the address does not exist show message error, else validate and update address data
        if(!$address){ return response()->json(
            [
                'message' => 'Morada não foi encontrada!'
            ], 404); }
        else
        {
            $address->update($request->validated());
            return response()->json(
                [
                    'message' => 'Morada '.$address->address.' atualizada com sucesso!'
                ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($addressId)
    {
        //Search for the Address
        $address = Address::find($addressId);
        //If the address does not exist, show message error
        if(!$address){ return response()->json(
            [
                'message' => 'Morada não foi encontrada!'
            ], 404);
        }

        //Deletes address and show message
        $address->delete();
        return response()->json([
            'message' => 'Morada '.$address->address.' eliminada com sucesso!'
        ]);
    }

    /**
     * Search for any name
     */
    public function search($address = null)
    {
        try {
            //If something was sent in the route
            if ($address) {
                //Get all addresses that matches with the data sent
                $addresses = Address::where('address', 'LIKE', '%' . $address . '%')->get();
            }

            //Return the data
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'addresses' => $addresses
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar a morada!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
