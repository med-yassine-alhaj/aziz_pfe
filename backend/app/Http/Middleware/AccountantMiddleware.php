<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AccountantMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isAccountant()) {
            return response()->json([
                'message' => 'Accès refusé. Rôle comptable requis.',
            ], 403);
        }

        return $next($request);
    }
}
