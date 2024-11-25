<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use Exception;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::with('nationality', 'address', 'user')->get();
        // If table Clients does not have any data echo a message, else show data
        if ($clients->isEmpty()) { return response()->json(
            [
                'message'       => 'Esta lista ainda não contém dados.',
                'clients'       => []
            ], 200);
        }
        else { return response()->json(
            [
                'clients' => $clients
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
    public function store(StoreClientRequest $request)
    {
        //Verify the data sent
        //validated() follows the StoreClientRequest rules
        $validatedData = $request->validated();

        //Create a new client with the verified data
        $client = Client::create($validatedData);
        return response()->json(
            [
                'message' => 'Cliente '.$client->user->username.' criado com sucesso!'
            ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($clientId)
    {
        //Search for the client
        $client = Client::find($clientId);

        //If the client does not exist show message error, else show client
        if (!$client) { return response()->json(
            [
                'message' => 'Cliente não foi encontrado!'
            ], 404); }
        else {
            return response()->json(
                [
                    'client' => $client->load('nationality','address', 'user')
                ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, $clientId)
    {
        //Search for the Client
        $client = Client::find($clientId);
        //If the client does not exist show message error else validate and update client data
        if(!$client) { return response()->json(
            [
                'message' => 'Cliente não foi encontrado!'
            ], 404);}
        else
        {
            $client->update($request->validated());
            return response()->json([
                'message' => 'Cliente '.$client->user->username.' atualizado com sucesso!'
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($clientId)
    {
        //Search for the Client
        $client = Client::find($clientId);
        //If the client does not exist show message error
        if(!$client){ return response()->json(
            [
                'message' => 'Cliente não foi encontrado!'
            ], 404); }

        //Deletes client and show message
        $client->delete();
        return response()->json(
            [
                'message' => 'Cliente '.$client->user->username.' eliminado com sucesso!'
            ], 200);
    }

    public function search($name = null)
    {
        try {
            //If something was sent in the route
            if ($name) {
                //Get all clients that matches with the data sent on first_name or last_name column
                $clients = Client::with('nationality','address','user')
                    ->where('first_name', 'LIKE', '%' . $name . '%')
                    ->orWhere('last_name', 'LIKE', '%' . $name . '%')
                    ->get();
            }

            //Return the data
            return response()->json(
                [
                    'message' => 'Resultados da sua pesquisa:',
                    'clients' => $clients
                ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar o cliente!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
