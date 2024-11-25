<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return response()->json(
                [
                    'message'   => 'Tem de ter sessão iniciada para continuar!',
                    'status'    => '401'
                ], 401);
        }

        $user = strtolower(trim(Auth::user()->role));
        $userRole = strtolower(trim(json_decode($user)->name));

        if ($userRole !== 'admin') {
            return response()->json(
                [
                    'message'   => 'Não tem permissão para aceder a esta página!',
                    'status'    => '403'
                ], 403);
        }

        return $next($request);
    }
}
