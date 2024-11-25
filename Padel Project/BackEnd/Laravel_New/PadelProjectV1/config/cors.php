<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    /*
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
    */
    'paths' => ['api/'], // Aplica-se a todas as rotas da API

    'allowed_methods' => [''], // Permite todos os métodos HTTP (GET, POST, PUT, DELETE)

    'allowed_origins' => ['http://localhost:4200/'], // Permite o domínio do seu frontend Angular

    'allowed_headers' => ['*'], // Permite todos os cabeçalhos

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
