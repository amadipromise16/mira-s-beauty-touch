<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\Config;
use App\Config\Database;
use App\Utils\Jwt;
use App\Utils\Request;
use App\Utils\Response;
use Exception;
use PDO;

class AuthMiddleware
{
    private static ?array $currentUser = null;

    public static function getSecret(): string
    {
        return (string) Config::get('JWT_SECRET', 'miras_beauty_touch_secret_key_default');
    }

    public static function requireAuth(): array
    {
        $token = Request::getBearerToken();
        if (!$token) {
            Response::error('Authentication required. Please sign in.', 401);
        }

        try {
            $secret = self::getSecret();
            $decoded = Jwt::verify($token, $secret);

            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('SELECT id, full_name, email, phone, role FROM users WHERE id = ?');
            $stmt->execute([(int) $decoded['id']]);
            $user = $stmt->fetch();

            if (!$user) {
                Response::error('User account not found or has been deactivated.', 401);
            }

            // Cast id to int for type consistency with Node
            $user['id'] = (int) $user['id'];
            self::$currentUser = $user;
            return $user;
        } catch (Exception $e) {
            Response::error('Invalid or expired authentication session.', 403);
        }
    }

    public static function requireAdmin(): array
    {
        $user = self::requireAuth();

        if (($user['role'] ?? '') !== 'admin') {
            Response::error('Access denied. Administrator privileges required.', 403);
        }

        return $user;
    }

    public static function optionalAuth(): ?array
    {
        $token = Request::getBearerToken();
        if (!$token) {
            self::$currentUser = null;
            return null;
        }

        try {
            $secret = self::getSecret();
            $decoded = Jwt::verify($token, $secret);

            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('SELECT id, full_name, email, phone, role FROM users WHERE id = ?');
            $stmt->execute([(int) $decoded['id']]);
            $user = $stmt->fetch();

            if ($user) {
                $user['id'] = (int) $user['id'];
                self::$currentUser = $user;
                return $user;
            }
        } catch (Exception $e) {
            // Ignored for optional auth
        }

        self::$currentUser = null;
        return null;
    }

    public static function getCurrentUser(): ?array
    {
        return self::$currentUser;
    }
}

