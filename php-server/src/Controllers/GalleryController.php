<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Utils\Request;
use App\Utils\Response;
use Exception;
use PDO;

class GalleryController
{
    public function getAll(): void
    {
        try {
            $user = AuthMiddleware::optionalAuth();
            $userId = $user ? (int) $user['id'] : null;

            $pdo = Database::getConnection();
            $category = Request::getQueryParam('category');
            $type = Request::getQueryParam('type');

            $query = '
                SELECT 
                    g.*,
                    COUNT(l.id) AS like_count,
                    CASE 
                        WHEN ? IS NOT NULL AND EXISTS(
                            SELECT 1 FROM gallery_likes ul 
                            WHERE ul.gallery_item_id = g.id AND ul.user_id = ?
                        ) THEN 1 
                        ELSE 0 
                    END AS user_has_liked
                FROM gallery_items g
                LEFT JOIN gallery_likes l ON g.id = l.gallery_item_id
                WHERE g.is_published = 1
            ';

            $params = [$userId, $userId];

            if ($category && $category !== 'All') {
                $query .= ' AND g.category = ?';
                $params[] = $category;
            }

            if ($type && $type !== 'All') {
                $query .= ' AND g.media_type = ?';
                $params[] = $type;
            }

            $query .= ' GROUP BY g.id ORDER BY g.display_order ASC, g.id ASC';

            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $items = $stmt->fetchAll();

            $formatted = array_map(function (array $item) {
                return [
                    'id' => (int) $item['id'],
                    'title' => $item['title'],
                    'category' => $item['category'],
                    'media_type' => $item['media_type'],
                    'media_url' => $item['media_url'],
                    'description' => $item['description'],
                    'is_published' => (int) ($item['is_published'] ?? 1),
                    'display_order' => (int) ($item['display_order'] ?? 100),
                    'created_at' => $item['created_at'] ?? null,
                    'like_count' => (int) ($item['like_count'] ?? 0),
                    'user_has_liked' => (bool) ($item['user_has_liked'] ?? false),
                ];
            }, $items);

            Response::json(['gallery' => $formatted]);
        } catch (Exception $e) {
            error_log('Fetch gallery error: ' . $e->getMessage());
            Response::error('Failed to retrieve gallery items.', 500);
        }
    }

    public function toggleLike(int|string $id): void
    {
        try {
            $user = AuthMiddleware::requireAuth();
            $itemId = (int) $id;
            $userId = (int) $user['id'];

            $pdo = Database::getConnection();

            // Check if gallery item exists
            $checkItem = $pdo->prepare('SELECT id FROM gallery_items WHERE id = ?');
            $checkItem->execute([$itemId]);
            if (!$checkItem->fetch()) {
                Response::error('Gallery item not found.', 404);
            }

            // Check if already liked
            $checkLike = $pdo->prepare('SELECT id FROM gallery_likes WHERE user_id = ? AND gallery_item_id = ?');
            $checkLike->execute([$userId, $itemId]);
            $existing = $checkLike->fetch();

            $userHasLiked = false;

            if ($existing) {
                // Unlike
                $removeLike = $pdo->prepare('DELETE FROM gallery_likes WHERE user_id = ? AND gallery_item_id = ?');
                $removeLike->execute([$userId, $itemId]);
                $userHasLiked = false;
            } else {
                // Like
                try {
                    $insertLike = $pdo->prepare('INSERT INTO gallery_likes (user_id, gallery_item_id) VALUES (?, ?)');
                    $insertLike->execute([$userId, $itemId]);
                    $userHasLiked = true;
                } catch (Exception $insertErr) {
                    $userHasLiked = true;
                }
            }

            // Authoritative like count
            $countStmt = $pdo->prepare('SELECT COUNT(*) as count FROM gallery_likes WHERE gallery_item_id = ?');
            $countStmt->execute([$itemId]);
            $countRes = $countStmt->fetch();
            $likeCount = (int) ($countRes ? $countRes['count'] : 0);

            Response::json([
                'message' => $userHasLiked ? 'Liked successfully.' : 'Like removed.',
                'liked' => $userHasLiked,
                'like_count' => $likeCount,
            ]);
        } catch (Exception $e) {
            error_log('Gallery like error: ' . $e->getMessage());
            Response::error('Failed to update like status.', 500);
        }
    }

    public function create(): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $body = Request::getBody();
            $title = isset($body['title']) ? trim((string) $body['title']) : '';
            $category = isset($body['category']) ? trim((string) $body['category']) : 'Salon Artistry';
            $mediaType = (isset($body['media_type']) && $body['media_type'] === 'video') ? 'video' : 'image';
            $mediaUrl = isset($body['media_url']) ? trim((string) $body['media_url']) : '';
            $description = isset($body['description']) ? trim((string) $body['description']) : null;

            if ($title === '' || $mediaUrl === '') {
                Response::error('Title and media URL are required.', 400);
            }

            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('
                INSERT INTO gallery_items (title, category, media_type, media_url, description)
                VALUES (?, ?, ?, ?, ?)
            ');
            $stmt->execute([$title, $category, $mediaType, $mediaUrl, $description]);
            $newId = (int) $pdo->lastInsertId();

            $fetchStmt = $pdo->prepare('SELECT * FROM gallery_items WHERE id = ?');
            $fetchStmt->execute([$newId]);
            $newItem = $fetchStmt->fetch();

            Response::json([
                'message' => 'Gallery item added successfully.',
                'item' => [
                    'id' => (int) $newItem['id'],
                    'title' => $newItem['title'],
                    'category' => $newItem['category'],
                    'media_type' => $newItem['media_type'],
                    'media_url' => $newItem['media_url'],
                    'description' => $newItem['description'],
                    'is_published' => (int) ($newItem['is_published'] ?? 1),
                    'display_order' => (int) ($newItem['display_order'] ?? 100),
                    'created_at' => $newItem['created_at'] ?? null,
                    'like_count' => 0,
                    'user_has_liked' => false,
                ],
            ], 201);
        } catch (Exception $e) {
            error_log('Create gallery item error: ' . $e->getMessage());
            Response::error('Failed to add gallery item.', 500);
        }
    }

    public function delete(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('DELETE FROM gallery_items WHERE id = ?');
            $stmt->execute([(int) $id]);

            Response::json(['message' => 'Gallery item and associated likes removed successfully.']);
        } catch (Exception $e) {
            error_log('Delete gallery item error: ' . $e->getMessage());
            Response::error('Failed to delete gallery item.', 500);
        }
    }
}

