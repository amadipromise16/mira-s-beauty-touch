<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Utils\Response;
use Exception;
use PDO;

class NotificationsController
{
    public function getAll(): void
    {
        $user = AuthMiddleware::requireAuth();

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('
                SELECT * FROM notifications 
                WHERE user_id = ? 
                ORDER BY id DESC 
                LIMIT 50
            ');
            $stmt->execute([(int) $user['id']]);
            $notifications = $stmt->fetchAll();

            $unreadStmt = $pdo->prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0');
            $unreadStmt->execute([(int) $user['id']]);
            $unread = $unreadStmt->fetch();

            $formatted = array_map(function (array $n) {
                return [
                    'id' => (int) $n['id'],
                    'user_id' => (int) $n['user_id'],
                    'type' => $n['type'],
                    'title' => $n['title'],
                    'message' => $n['message'],
                    'appointment_id' => $n['appointment_id'] !== null ? (int) $n['appointment_id'] : null,
                    'is_read' => (int) ($n['is_read'] ?? 0),
                    'read' => (bool) ($n['is_read'] ?? 0),
                    'created_at' => $n['created_at'] ?? null,
                ];
            }, $notifications);

            Response::json([
                'notifications' => $formatted,
                'unread_count' => $unread ? (int) $unread['count'] : 0,
            ]);
        } catch (Exception $e) {
            error_log('Fetch notifications error: ' . $e->getMessage());
            Response::error('Failed to retrieve notifications.', 500);
        }
    }

    public function markAsRead(int|string $id): void
    {
        $user = AuthMiddleware::requireAuth();

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?');
            $stmt->execute([(int) $id, (int) $user['id']]);

            Response::json(['message' => 'Notification marked as read.']);
        } catch (Exception $e) {
            error_log('Update notification error: ' . $e->getMessage());
            Response::error('Failed to update notification.', 500);
        }
    }

    public function markAllAsRead(): void
    {
        $user = AuthMiddleware::requireAuth();

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?');
            $stmt->execute([(int) $user['id']]);

            Response::json(['message' => 'All notifications marked as read.']);
        } catch (Exception $e) {
            error_log('Update notifications error: ' . $e->getMessage());
            Response::error('Failed to update notifications.', 500);
        }
    }
}

