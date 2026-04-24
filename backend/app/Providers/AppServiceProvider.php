<?php

namespace App\Providers;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Response::macro('apiSuccess', function ($data, $message = "Success", $status = 200) {
            return Response::json([
                'success' => true,
                'message' => $message,
                'data' => $data,
            ], $status);
        });

        Response::macro('apiSuccessPaginated', function ($paginator, $message = "Success", $status = 200) {
            return Response::json([
                'success' => true,
                'message' => $message,
                'data' => $paginator->items(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'links' => [
                        'next' => $paginator->nextPageUrl(),
                        'prev' => $paginator->previousPageUrl(),
                    ],
                ],
            ], $status);
        });


        Response::macro('apiError', function ($message = "Error", $errors = [], $status = 422) {
            return Response::json([
                'success' => false,
                'message' => $message,
                'errors' => $errors,
            ], $status);
        });
    }
}
