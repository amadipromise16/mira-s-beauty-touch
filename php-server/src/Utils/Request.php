<?php

declare(strict_types=1);

namespace App\Utils;

class Request
{
    private static ?array $parsedBody = null;
    private static ?array $headers = null;

    public static function getMethod(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    public static function getPath(): string
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';

        // Strip subdirectories if running inside a subdirectory (e.g., /php-server/public)
        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
        $baseDir = dirname($scriptName);
        if ($baseDir !== '/' && $baseDir !== '\\' && str_starts_with($path, $baseDir)) {
            $path = substr($path, strlen($baseDir));
        }

        if ($path === '' || $path === false) {
            $path = '/';
        }

        return rtrim($path, '/') ?: '/';
    }

    public static function getHeaders(): array
    {
        if (self::$headers !== null) {
            return self::$headers;
        }

        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            if ($headers !== false) {
                $normalized = [];
                foreach ($headers as $k => $v) {
                    $normalized[strtolower((string) $k)] = (string) $v;
                }
                self::$headers = $normalized;
                return self::$headers;
            }
        }

        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = strtolower(str_replace('_', '-', substr($key, 5)));
                $headers[$name] = (string) $value;
            } elseif (in_array($key, ['CONTENT_TYPE', 'CONTENT_LENGTH', 'AUTHORIZATION'], true)) {
                $name = strtolower(str_replace('_', '-', $key));
                $headers[$name] = (string) $value;
            }
        }

        self::$headers = $headers;
        return self::$headers;
    }

    public static function getHeader(string $name): ?string
    {
        $headers = self::getHeaders();
        return $headers[strtolower($name)] ?? null;
    }

    public static function getBearerToken(): ?string
    {
        $auth = self::getHeader('authorization');
        if (!$auth) {
            return null;
        }

        if (preg_match('/Bearer\s(\S+)/i', $auth, $matches)) {
            return $matches[1];
        }

        return null;
    }

    public static function getBody(): array
    {
        if (self::$parsedBody !== null) {
            return self::$parsedBody;
        }

        $contentType = self::getHeader('content-type') ?? '';

        if (str_contains($contentType, 'application/json')) {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            self::$parsedBody = is_array($data) ? $data : [];
            return self::$parsedBody;
        }

        if (!empty($_POST)) {
            self::$parsedBody = $_POST;
            return self::$parsedBody;
        }

        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $data = json_decode($raw, true);
            if (is_array($data)) {
                self::$parsedBody = $data;
                return self::$parsedBody;
            }
            parse_str($raw, $parsed);
            if (is_array($parsed)) {
                self::$parsedBody = $parsed;
                return self::$parsedBody;
            }
        }

        self::$parsedBody = [];
        return self::$parsedBody;
    }

    public static function getQueryParams(): array
    {
        return $_GET ?? [];
    }

    public static function getQueryParam(string $key, mixed $default = null): mixed
    {
        return $_GET[$key] ?? $default;
    }
}

