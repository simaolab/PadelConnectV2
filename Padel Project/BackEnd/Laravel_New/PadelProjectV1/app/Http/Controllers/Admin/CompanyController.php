<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all Companies from table Company
        try
        {
            $companies = Company::withCount('fields')->with('user')->get();
            // If table Company does not have any data echo a message, else show data
            if ($companies->isEmpty()) { return response()->json(
                [
                    'message'   => 'Esta lista ainda não contém dados.',
                    'data'     => []
                ], 200);
            }
            else
            {
                return response()->json([
                    'companies' => $companies
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
    public function store(StoreCompanyRequest $request)
    {
        //Verify the data from request
        //validated() follows the StoreCompanyRequest rules
        $validatedData = $request->validated();

        $user = new User();
        $user->username = $validatedData['user_name'];
        $user->email    = $validatedData['user_email'];
        $user->password = Hash::make($validatedData['user_password']);
        $user->nif      = $validatedData['user_nif'];
        $user->birthday = '01/01/2000';
        $user->role_id  = 2;

        $user->save();

        $company = Company::create([
            'name' => $validatedData['name'],
            'contact' => $validatedData['contact'],
            'address' => $validatedData['address'],
            'user_id' => $user->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Empresa '.$company->name.' criada com sucesso!',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($companyId)
    {
        //Search for the company
        $company = Company::withCount('fields')->find($companyId);

        //If the company does not exist show message error, else show company
        if (!$company) { return response()->json(
            [
                'message' => 'Empresa não foi encontrada!'
            ], 404);
        }
        else
        {
            return response()->json(
                [
                    'company' => $company->load('user')
                ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request, $companyId)
    {
        //Search for the Company
        $company = Company::withCount('fields')->find($companyId);
      	$request->merge(['user' => $company->user_id]);
        //If the company does not exist show message error, else validate and update the company data
        if(!$company) { return response()->json(
            [
                'message' => 'Empresa não foi encontrada!'
            ], 404);
        }
        else
        {
            $company->update($request->validated());
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Empresa '.$company->name.' atualizada com sucesso!'
                ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($companyId)
    {
        //Search for the Company
        $company = Company::find($companyId);
        //If the company does not exist show message error
        if(!$company){ return response()->json(
            [
                'message' => 'Empresa não foi encontrada!'
            ], 404);
        }

        $fieldsCount = $company->fields->count();

        if($fieldsCount > 0){
            return response()->json([
                'message' => 'Não é possível eliminar esta empresa. Tem '.$fieldsCount.' campos associados.'
            ], 400);
        }

        //Deletes companies and show message
        $company->delete();
        return response()->json([
            'message' => 'Empresa '.$company->name.' eliminada com sucesso!'
        ]);
    }

    public function search($name = null)
    {
        try{
            //If something was sent in the route
            if ($name) {
                //Get all companies that matches with the data sent
                $companies = Company::where('name', 'LIKE', '%' . $name . '%')->get();
            }

            //Return the data
            return response()->json(
                [
                    'message' => 'Resultados da sua pesquisa:',
                    'companies' => $companies
                ], 200);
        } catch (\Exception $e) {
            return response()->json([
            'message' => 'Erro ao procurar a role!',
            'error' => $e->getMessage()
            ], 500);
        }
    }
}
