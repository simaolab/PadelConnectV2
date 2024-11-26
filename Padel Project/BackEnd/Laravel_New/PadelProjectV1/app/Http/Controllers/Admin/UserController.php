<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all Users from table Users
        try
        {
            $roles = User::with('role')->get();
            // If table User does not have any data echo a message else show users
            if ($roles->isEmpty()) { return response()->json(
                [
                    'message' => 'Esta lista ainda não contém dados.',
                    'users'   => []
                ], 200); }
            else { return response()->json($roles, 200); }
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
     * Display the specified resource.
     */
    public function show($userId)
    {
        //Search for the user
        $user = User::find($userId);
        //If the user does not exist show message error, else show user
        if (!$user) { return response()->json(
            [
                'message' => 'Utilizador não foi encontrado!'
            ], 404); }
        else { return response()->json(
            [
                'user' => $user->load('role')
            ], 200);
        }
    }
}
