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
}
