<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Role;
use App\Models\Roles;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all Roles from table Roles
        try
        {
            $roles = Role::withCount('users')->get();
            // If table Roles does not have any data returns an information message, else show data
            if ($roles->isEmpty()) { return response()->json(
                [
                    'message'   => 'Esta lista ainda não contém dados. Crie uma role primeiro.',
                    'roles'     => []
                ], 200); }
            else { return response()->json(
                [
                    'roles' => $roles
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
    public function store(StoreRoleRequest $request)
    {
        //Verify the data from request
        //validated() follows the StoreRolesRequest rules
        $validatedData = $request->validated();

        //Create a new role with the verified data
        $role = Role::create($validatedData);
        return response()->json([
            'status' => 'success',
            'message' => 'Role '.$role->name.' criada com sucesso!'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($roleId)
    {
        //Search for the role
        $role = Role::withCount('users')->find($roleId);

        //If the role does not exist show message error, else show role
        if (!$role) { return response()->json(
            [
                'message' => 'Role não foi encontrada!'
            ], 404);
        }
        else
        {
            return response()->json(
                [
                    'role' => $role
                ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $roles)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, $roleId)
    {
        //Search for the Role
        $role = Role::withCount('users')->find($roleId);
        //If the role does not exist show message error, else validate and update the role data
        if(!$role){ return response()->json(
            [
                'message' => 'Role não foi encontrada!'
            ], 404); }
        else
        {
            $role->update($request->validated());
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Role '.$role->name.' atualizada com sucesso!'
                ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($roleId)
    {
        //Search for the Role
        $role = Role::find($roleId);
        //If the role does not exist show message error
        if(!$role){ return response()->json(
            [
                'message' => 'Role não foi encontrada!'
            ], 404);
        }

        //Get how many users are associates do this role
        $userCount = $role->users()->count();

        //If there are users associated to this role we show a message error
        if ($userCount > 0) {
            return response()->json([
                'message' => 'Não é possível eliminar esta role. Tem '.$userCount.' utilizadores associados.'
            ], 400);
        }

        //Deletes role and show message
        $role->delete();
        return response()->json(
            [
                'message' => 'Role '.$role->name.' eliminada com sucesso!'
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
                //Get all roles that matches with the data sent
                $roles = Role::withCount('users')
                    ->where('name', 'LIKE', '%' . $name . '%')
                    ->get();
            }

            //Return the data
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'roles' => $roles
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar a role!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
