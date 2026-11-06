<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Utils\Jwt;
use App\Utils\Request;
use App\Utils\Response;
use Exception;
use PDO;

class AuthController
{
    private static function generateToken(array $user): string
    {
        return Jwt::sign(
            [
                'id' => (int) $user['id'],
                'email' => $user['email'],
                'role' => $user['role'],
            ],
            AuthMiddleware::getSecret(),
            7 * 86400
        );
    }

    public function register(): void
    {
        try {
            $body = Request::getBody();
            $fullName = isset($body['full_name']) ? trim((string) $body['full_name']) : '';
            $email = isset($body['email']) ? trim((string) $body['email']) : '';
            $phone = isset($body['phone']) ? trim((string) $body['phone']) : null;
            $password = isset($body['password']) ? (string) $body['password'] : '';

            if ($fullName === '' || $email === '' || $password === '') {
                Response::error('Please provide full name, email, and password.', 400);
            }

            if (strlen($password) < 6) {
                Response::error('Password must be at least 6 characters long.', 400);
            }

            $cleanEmail = strtolower($email);
            $pdo = Database::getConnection();

            $checkStmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
            $checkStmt->execute([$cleanEmail]);
            if ($checkStmt->fetch()) {
                Response::error('An account with this email address already exists.', 409);
            }

            $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

            $insertStmt = $pdo->prepare('
                INSERT INTO users (full_name, email, phone, password_hash, role)
                VALUES (?, ?, ?, ?, "client")
            ');
            $insertStmt->execute([$fullName, $cleanEmail, $phone, $passwordHash]);
            $newId = (int) $pdo->lastInsertId();

            $newUser = [
                'id' => $newId,
                'full_name' => $fullName,
                'email' => $cleanEmail,
                'phone' => $phone,
                'role' => 'client',
            ];

            // Welcome in-app notification
            $notifStmt = $pdo->prepare('
                INSERT INTO notifications (user_id, type, title, message)
                VALUES (?, "system", "Welcome to Mira’s Beauty Touch!", "Thank you for joining us. Book your beauty appointments or explore our exquisite perfume collection today.")
            ');
            $notifStmt->execute([$newId]);

            $token = self::generateToken($newUser);

            Response::json([
                'message' => 'Account created successfully!',
                'token' => $token,
                'user' => $newUser,
            ], 201);
        } catch (Exception $e) {
            error_log('Registration error: ' . $e->getMessage());
            Response::error('Registration failed. Please try again.', 500);
        }
    }

    public function login(): void
    {
        try {
            $body = Request::getBody();
            $email = isset($body['email']) ? trim((string) $body['email']) : '';
            $password = isset($body['password']) ? (string) $body['password'] : '';

            if ($email === '' || $password === '') {
                Response::error('Please provide both email and password.', 400);
            }

            $cleanEmail = strtolower($email);
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
            $stmt->execute([$cleanEmail]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, (string) $user['password_hash'])) {
                Response::error('Invalid email address or password.', 401);
            }

            $safeUser = [
                'id' => (int) $user['id'],
                'full_name' => $user['full_name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'role' => $user['role'],
            ];

            $token = self::generateToken($safeUser);

            Response::json([
                'message' => 'Logged in successfully.',
                'token' => $token,
                'user' => $safeUser,
            ]);
        } catch (Exception $e) {
            error_log('Login error: ' . $e->getMessage());
            Response::error('Login failed. Please try again.', 500);
        }
    }

    public function me(): void
    {
        try {
            $user = AuthMiddleware::requireAuth();
            $pdo = Database::getConnection();

            $unreadStmt = $pdo->prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0');
            $unreadStmt->execute([(int) $user['id']]);
            $unread = $unreadStmt->fetch();

            Response::json([
                'user' => $user,
                'unread_notifications' => $unread ? (int) $unread['count'] : 0,
            ]);
        } catch (Exception $e) {
            error_log('Me endpoint error: ' . $e->getMessage());
            Response::error('Failed to retrieve profile.', 500);
        }
    }

    public function forgotPassword(): void
    {
        try {
            $body = Request::getBody();
            $email = isset($body['email']) ? trim((string) $body['email']) : '';

            if ($email === '') {
                Response::error('Please provide your registered email address.', 400);
            }

            $cleanEmail = strtolower($email);
            $pdo = Database::getConnection();

            $userStmt = $pdo->prepare('SELECT id, full_name, email FROM users WHERE email = ?');
            $userStmt->execute([$cleanEmail]);
            $user = $userStmt->fetch();

            if (!$user) {
                Response::json([
                    'message' => 'If an account exists with this email address, password reset instructions have been generated.',
                ]);
            }

            $resetToken = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour

            $insertToken = $pdo->prepare('
                INSERT INTO password_resets (user_id, token, expires_at)
                VALUES (?, ?, ?)
            ');
            $insertToken->execute([(int) $user['id'], $resetToken, $expiresAt]);

            Response::json([
                'message' => 'Password reset link generated. Follow the link to choose a new password.',
                'reset_token' => $resetToken,
                'reset_link' => "/reset-password?token={$resetToken}",
            ]);
        } catch (Exception $e) {
            error_log('Forgot password error: ' . $e->getMessage());
            Response::error('Unable to process password reset request.', 500);
        }
    }

    public function resetPassword(): void
    {
        try {
            $body = Request::getBody();
            $token = isset($body['token']) ? trim((string) $body['token']) : '';
            $newPassword = isset($body['new_password']) ? (string) $body['new_password'] : '';

            if ($token === '' || $newPassword === '') {
                Response::error('Token and new password are required.', 400);
            }

            if (strlen($newPassword) < 6) {
                Response::error('New password must be at least 6 characters.', 400);
            }

            $pdo = Database::getConnection();
            $tokenStmt = $pdo->prepare('
                SELECT * FROM password_resets 
                WHERE token = ? AND is_used = 0 AND expires_at > CURRENT_TIMESTAMP
            ');
            $tokenStmt->execute([$token]);
            $record = $tokenStmt->fetch();

            if (!$record) {
                Response::error('Invalid or expired password reset token.', 400);
            }

            $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);

            $updatePwd = $pdo->prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
            $updatePwd->execute([$passwordHash, (int) $record['user_id']]);

            $markUsed = $pdo->prepare('UPDATE password_resets SET is_used = 1 WHERE id = ?');
            $markUsed->execute([(int) $record['id']]);

            Response::json([
                'message' => 'Password reset successfully. You may now log in with your new password.',
            ]);
        } catch (Exception $e) {
            error_log('Reset password error: ' . $e->getMessage());
            Response::error('Failed to reset password.', 500);
        }
    }

    public function updateProfile(): void
    {
        try {
            $user = AuthMiddleware::requireAuth();
            $body = Request::getBody();
            $fullName = isset($body['full_name']) ? trim((string) $body['full_name']) : '';
            $phone = isset($body['phone']) ? trim((string) $body['phone']) : null;

            if ($fullName === '') {
                Response::error('Full name is required.', 400);
            }

            $pdo = Database::getConnection();
            $updateStmt = $pdo->prepare('
                UPDATE users 
                SET full_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ');
            $updateStmt->execute([$fullName, $phone, (int) $user['id']]);

            $userStmt = $pdo->prepare('SELECT id, full_name, email, phone, role FROM users WHERE id = ?');
            $userStmt->execute([(int) $user['id']]);
            $updatedUser = $userStmt->fetch();
            if ($updatedUser) {
                $updatedUser['id'] = (int) $updatedUser['id'];
            }

            Response::json([
                'message' => 'Profile updated successfully.',
                'user' => $updatedUser,
            ]);
        } catch (Exception $e) {
            error_log('Update profile error: ' . $e->getMessage());
            Response::error('Failed to update profile.', 500);
        }
    }
}

