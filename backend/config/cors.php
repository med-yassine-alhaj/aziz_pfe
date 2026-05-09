<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'auth/google/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter([
        env('FRONTEND_URL', 'http://localhost:3000'),
        env('ADMIN_FRONTEND_URL', 'http://localhost:3001'),
        'http://localhost:3002', // Client portal (fallback port)
        'http://localhost:3003', // Admin portal (vite shifted port)
    ])),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
