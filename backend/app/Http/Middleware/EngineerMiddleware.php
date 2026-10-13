<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EngineerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !in_array($request->user()->role, ['admin', 'engineer'], true)) {
            return response()->json(['message' => 'Accès réservé aux ingénieurs affectés.'], 403);
        }
        return $next($request);
    }
}
