<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNationalityRequest;
use App\Http\Requests\UpdateNationalityRequest;
use App\Models\Nationality;

class NationalityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all Nationalities from table Nationality
        try
        {
            $nationalities = Nationality::withCount('clients')->get();
            // If table Nationality does not have any data echo a message, else show data
            if ($nationalities->isEmpty()) { return response()->json(
                [
                    'message'           => 'Esta lista ainda não contém dados. Crie uma nacionalidade primeiro.',
                    'nationalities'     => []
                ], 200); }
            else { return response()->json($nationalities, 200); }
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
        //Not used, only for view
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNationalityRequest $request)
    {
        //Verify the data from request
        //validated() follows the StoreNationalityRequest rules
        $validatedData = $request->validated();

        //Create a new nationality with the verified data
        $nationality = Nationality::create($validatedData);
        return response()->json([
            'status' => 'success',
            'message' => 'Nacionalidade '.$nationality->name.' criada com sucesso!'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($nationalityId)
    {
        //Search for the nationality
        $nationality = Nationality::withCount('clients')->find($nationalityId);

        //If the nationality does not exist show message error, else show nationality
        if (!$nationality) { return response()->json(
            [
                'message' => 'Nacionalidade não foi encontrada!'
            ], 404);
        }
        else { return response()->json(['data' => $nationality], 200); }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Nationality $nationality)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNationalityRequest $request, $nationalityId)
    {
        //Search for the Nationality
        $nationality = Nationality::withCount('clients')->find($nationalityId);
        //If the nationality does not exist show message error, else validate and update nationality data
        if(!$nationality){ return response()->json(
            [
                'message' => 'Nacionalidade não foi encontrada'
            ], 404);
        }
        else
        {
            $nationality->update($request->validated());
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Nacionalidade '.$nationality->name.' atualizada com sucesso!'
                ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($nationalityId)
    {
        //Search for the Nationality
        $nationality = Nationality::find($nationalityId);
        //If the nationality does not exist show message error
        if(!$nationality){ return response()->json(
            [
                'message' => 'Nacionalidade não foi encontrada!'
            ], 404);
        }

        //Get all clients that are associated do this nationality
        $clients = $nationality->clients;

        //If there are clients associated
        if ($clients->isNotEmpty()) {
            //We set the nationality as null
            foreach ($clients as $client) {
                $client->nationality_id = null;
                $client->save();
            }
        }

        //Deletes nationality and show message with nationality deleted
        $nationality->delete();
        return response()->json([
            'message' => 'Nacionalidade '.$nationality->name.' eliminada com sucesso!',
            'clients_affected' => $clients->count()
        ]);
    }

    public function search($name = null)
    {
        try{
            //If something was sent in the route
            if ($name) {
                $nationalities = Nationality::withCount('clients')
                    ->where('name', 'LIKE', '%' . $name . '%')
                    ->get();
            }
            else { $nationalities = Nationality::all(); }

            //Show all values that match with the search input
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'nationalities' => $nationalities
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar a nacionalidade!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
