<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Passport\Passport;

class AuthenticationController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterUserRequest $request)
    {
        try {
            // Create a new user with the validated data from RegisterUserRequest
            $user = new User();
            $user->username = $request->username;
            $user->email    = $request->email;
            $user->password = Hash::make($request->password);
            $user->nif      = $request->nif;
            $user->role_id  = 3;

            // Attempt to save the user to the database
            if (!$user->save()) {
                return response()->json([
                    'response_code' => '500',
                    'status' => 'error',
                    'message' => 'Error registering user',
                ], 500);
            }

            // Create a new client with the user id
            $client = new Client();
            $client->user_id = $user->id;
            $client->save();

            // Create an access token for the new user
            $token = $user->createToken('authToken')->accessToken;

            // Register the successful registration in the register log
            \Log::channel('register')->info('User registered', [
                'user_id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'ip_address' => $request->ip(),
                'timestamp' => now()->toDateTimeString(),
            ]);

            // Return success message with user and token details
            return response()->json([
                'response_code' => '200',
                'status' => 'success',
                'message' => 'Registered successfully',
                'user' => $user,
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            // Catch any errors that occur during registration
            return response()->json([
                'response_code' => '500',
                'status' => 'error',
                'message' => 'Error during registration: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated user information.
     */
    public function userInfo()
    {
        // Retrieve the authenticated user with role relation
        $user = Auth::user()->load('role');

        if ($user) {
            // Return user information if authenticated
            return response()->json([
                'response_code' => '200',
                'status' => 'success',
                'message' => 'User information retrieved successfully',
                'user' => $user
            ]);
        }

        // Return an error response if the user is not authenticated
        return response()->json([
            'response_code' => '401',
            'status' => 'error',
            'message' => 'User not authenticated',
        ], 401);
    }

    /**
     * Log the user in and create a token.
     */
    public function login(LoginRequest $request)
    {
        try {
            // Attempt to authenticate the user
            $request->authenticate();

            // Get the authenticated user details
            $user = Auth::user()->load('role');

            // Update column last_login
            $user->update([
                'last_login_at' => now(),
            ]);

            // Create an access token for the user
            $accessToken = $user->createToken('authToken')->accessToken;

            // Set the token expiration time
            // Passport uses the token expiration defined in config/passport.php
            $expiresIn = config('passport.tokens_expire_in', 3600); // Get expiration time from config
            $expiresInInSeconds = $expiresIn; // Directly using the Passport's expiration value

            // Register the successful login in the login log
            \Log::channel('login')->info('User logged in', [
                'user_id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'ip_address' => $request->ip(),
                'timestamp' => now()->toDateTimeString(),
            ]);

            // Return the success message with token details
            return response()->json([
                'response_code' => '200',
                'status' => 'success',
                'message' => 'Login successful',
                'user_info' => $user,
                'token' => $accessToken,
                'expires_in' => $expiresInInSeconds // Token expiration in seconds
            ]);
        } catch (\Exception $e) {
            // Register the failed login attempt in the login log
            \Log::channel('login')->error('Failed login attempt', [
                'email' => $request->input('login'),
                'ip_address' => $request->ip(),
                'timestamp' => now()->toDateTimeString(),
                'error' => $e->getMessage(),
            ]);

            // Return the error response for failed login
            return response()->json([
                'response_code' => '401',
                'status' => 'error',
                'message' => 'Login failed, verify your credentials',
            ], 401);
        }
    }


    /**
     * Log the user out by revoking the token.
     */
    public function logout(Request $request)
    {
        try {
            // Get the authenticated user
            $user = $request->user();

            // Check if the user is authenticated
            if (!$user) {
                return response()->json([
                    'response_code' => '401',
                    'status' => 'error',
                    'message' => 'User is not authenticated'
                ], 401);
            }

            // Get the current token of the user
            $token = $request->user()->token();

            // If there's a token, revoke it
            if ($token) {
                // Revoke the current access token to log out the user
                $token->revoke();

                // Log the logout action
                \Log::channel('login')->info('User logged out', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'username' => $user->username,
                    'ip_address' => $request->ip(),
                    'timestamp' => now()->toDateTimeString(),
                ]);

                return response()->json([
                    'response_code' => '200',
                    'status' => 'success',
                    'message' => 'Logout successful for ' . $user->username
                ]);
            }

            // If no token is found, return an error
            return response()->json([
                'response_code' => '401',
                'status' => 'error',
                'message' => 'Token is already revoked or invalid'
            ], 401);
        } catch (\Exception $e) {
            // Log the error for review
            \Log::error('Error attempting to log out: ' . $e->getMessage());

            // Generic error response
            return response()->json([
                'response_code' => '500',
                'status' => 'error',
                'message' => 'An error occurred while processing logout. Please try again later.'
            ], 500);
        }
    }

}
