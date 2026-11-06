<?php

declare(strict_types=1);

namespace App\Router;

use App\Utils\Request;
use App\Utils\Response;
use Throwable;

class Router
{
    private array $routes = [];

    public function get(string $path, array|callable $handler): self
    {
        return $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, array|callable $handler): self
    {
        return $this->addRoute('POST', $path, $handler);
    }

    public function put(string $path, array|callable $handler): self
    {
        return $this->addRoute('PUT', $path, $handler);
    }

    public function delete(string $path, array|callable $handler): self
    {
        return $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute(string $method, string $path, array|callable $handler): self
    {
        $cleanPath = $path;
        if (str_starts_with($cleanPath, '/api/')) {
            $subPath = substr($cleanPath, 4);
            $pattern = '(?:/api)?' . preg_replace('#:([a-zA-Z0-9_]+)#', '([^/]+)', $subPath);
        } else {
            $pattern = preg_replace('#:([a-zA-Z0-9_]+)#', '([^/]+)', $cleanPath);
        }
        $regex = '#^' . $pattern . '$#';

        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'regex' => $regex,
            'handler' => $handler,
        ];

        return $this;
    }

    public function dispatch(): void
    {
        Response::setCorsHeaders();

        $method = Request::getMethod();
        $path = Request::getPath();

        // Handle CORS preflight immediately
        if ($method === 'OPTIONS') {
            http_response_code(204);
            exit;
        }

        // Handle static media & uploads if requested via PHP server
        if ($this->serveStaticFile($path)) {
            return;
        }

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if (preg_match($route['regex'], $path, $matches)) {
                array_shift($matches); // Remove full match

                try {
                    $handler = $route['handler'];
                    if (is_callable($handler)) {
                        call_user_func_array($handler, $matches);
                    } elseif (is_array($handler) && count($handler) === 2) {
                        [$class, $action] = $handler;
                        $instance = new $class();
                        call_user_func_array([$instance, $action], $matches);
                    }
                    return;
                } catch (Throwable $e) {
                    error_log('Unhandled Server Error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
                    Response::json(['error' => 'An unexpected internal server error occurred.'], 500);
                }
            }
        }

        Response::error('Endpoint not found: ' . $path, 404);
    }

    private function serveStaticFile(string $path): bool
    {
        // Media files
        if (str_starts_with($path, '/media/')) {
            $relativePath = substr($path, 7);
            $clientMediaDir = dirname(__DIR__, 2) . '/client/public/media/';
            $filePath = realpath($clientMediaDir . $relativePath);

            if ($filePath && str_starts_with($filePath, realpath($clientMediaDir)) && file_exists($filePath)) {
                $this->sendFile($filePath);
                return true;
            }
        }

        // Upload files
        if (str_starts_with($path, '/uploads/')) {
            $relativePath = substr($path, 9);
            $uploadsDirs = [
                dirname(__DIR__, 2) . '/uploads/',
                dirname(__DIR__, 2) . '/../server/uploads/',
            ];

            foreach ($uploadsDirs as $dir) {
                if (!file_exists($dir)) {
                    continue;
                }
                $filePath = realpath($dir . $relativePath);
                if ($filePath && str_starts_with($filePath, realpath($dir)) && file_exists($filePath)) {
                    $this->sendFile($filePath);
                    return true;
                }
            }
        }

        return false;
    }

    private function sendFile(string $filePath): void
    {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'mp4' => 'video/mp4',
            'webm' => 'video/webm',
            'mp3' => 'audio/mpeg',
            'json' => 'application/json',
            'css' => 'text/css',
            'js' => 'application/javascript',
        ];

        $mime = $mimeTypes[$ext] ?? mime_content_type($filePath) ?: 'application/octet-stream';

        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($filePath));
        header('Cache-Control: public, max-age=86400');
        readfile($filePath);
        exit;
    }
}

