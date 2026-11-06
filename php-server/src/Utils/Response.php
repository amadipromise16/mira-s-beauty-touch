<?php

declare(strict_types=1);

namespace App\Utils;

class Response
{
    public static function setCorsHeaders(): void
    {
        if (!headers_sent()) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, Accept');
            header('Access-Control-Allow-Credentials: true');
        }
    }

    public static function json(mixed $data, int $statusCode = 200, array $headers = []): void
    {
        self::setCorsHeaders();

        if (!headers_sent()) {
            http_response_code($statusCode);
            header('Content-Type: application/json; charset=utf-8');
            foreach ($headers as $key => $val) {
                header("$key: $val");
            }
        }

        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function error(string $message, int $statusCode = 400): void
    {
        self::json(['error' => $message], $statusCode);
    }
}

