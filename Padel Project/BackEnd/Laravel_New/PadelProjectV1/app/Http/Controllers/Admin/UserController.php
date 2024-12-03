<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;

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

    public function update(Request $request, $userId)
    {      
        // Validate the request sent by the user
         $request->validate([
            'new_user'     => 'nullable|boolean',
            'user_blocked' => 'nullable|boolean',
        ]);

        //Search for the user
        $user = User::find($userId);

        //If the user does not exist show message error, else show user
        if (!$user) {
            return response()->json(['message' => 'Utilizador não foi encontrado!'], 404);
        }

        // Update user state
        if ($request->has('new_user')) {
          $user->new_user = $request->input('new_user');
        }

        if ($request->has('user_blocked')) {
          $user->user_blocked = $request->input('user_blocked');
          if ($user->user_blocked) {
            $user->blocked_at = now(); 
        } else {
            $user->blocked_at = null;
        }
        }

        // Save changes
        try {
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Cliente '.$user->username.' atualizada com sucesso!'
                ], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        // Validate the request data
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:8|confirmed',
        ]);

        // Get the authenticated user (using Passport token)
        $user = $request->user();

        // Check if the current password matches
        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json(['message' => 'A senha atual está incorreta.'], 400);
        }

        // Update the password
        try {
            $user->password = Hash::make($request->input('new_password'));
            $user->save();

            return response()->json([
                'message' => 'Senha alterada com sucesso!',
            ], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
