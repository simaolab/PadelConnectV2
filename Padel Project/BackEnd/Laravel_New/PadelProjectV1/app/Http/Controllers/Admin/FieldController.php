<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldRequest;
use App\Http\Requests\UpdateFieldRequest;
use App\Models\Field;

class FieldController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all Fields from table Field
        try
        {
            $fields = Field::with('company')->get();
            // If table Field does not have any data echo a message, else show data
            if ($fields->isEmpty()) { return response()->json(
                [
                    'message'   => 'Esta lista ainda não contém dados.',
                    'fields'     => []
                ], 200); }
            else
            {
                return response()->json(
                    [
                        'fields' => $fields
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
        //Not used, only for view
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFieldRequest $request)
    {
        //Verify the data sended
        //validated() follows the StoreFieldRequest rules
        $validatedData = $request->validated();

        //Create a new field with the verified data
        $field = Field::create($validatedData);
        return response()->json([
            'status' => 'success',
            'message' => 'Campo ' . $field->name. ' criado com sucesso!',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            //Search for the field
            $field = Field::find($id);

            //If the field does not exist show message error else show field
            if (!$field) { return response()->json(
                [
                    'message' => 'Campo não foi encontrado!'
                ], 404);
            }
            else
            {
                return response()->json(
                    [
                        'field' => $field->load('company')
                    ], 200);
            }
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Field $field)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFieldRequest $request, $fieldId)
    {
        //Search for the Field
        $field = Field::find($fieldId);
        //If the field does not exist show message error, else validate and update field data
        if(!$field) { return response()->json(
            [
                'message' => 'Campo não foi encontrado!'
            ], 404);
        }
        else
        {
            $field->update($request->validated());
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Campo '.$field->name.' atualizado com sucesso!'
                ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($fieldId)
    {
        $field = Field::find($fieldId);
        //If the field does not exist show message error
        if(!$field){ return response()->json(
            [
                'message' => 'Campo não foi encontrado!'
            ], 404);
        }

        //Deletes field and show message
        $field->delete();
        return response()->json(
            [
                'message' => 'Campo '.$field->name.' eliminado com sucesso!'
            ]);
    }

    /**
     * Search for any name
     */
    public function search($name = null)
    {
        try {
            //If something was sent in the route
            if ($name) {
                //Get all fields that matches with the data sent
                $fields = Field::with('company')
                    ->where('name', 'LIKE', '%' . $name . '%')
                    ->get();
            }

            //Return the data
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'fields' => $fields
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
            'message' => 'Erro ao procurar o campo!',
            'error' => $e->getMessage()
            ], 500);
        }
    }

}
