<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Utils\Request;
use App\Utils\Response;
use Exception;
use PDO;

class ServicesController
{
    private static function formatService(array $s): array
    {
        return [
            'id' => (int) $s['id'],
            'name' => $s['name'],
            'category' => $s['category'],
            'description' => $s['description'],
            'price_ngn' => (int) $s['price_ngn'],
            'duration_mins' => (int) ($s['duration_mins'] ?? 60),
            'image_url' => $s['image_url'],
            'is_active' => (int) ($s['is_active'] ?? 1),
            'created_at' => $s['created_at'] ?? null,
        ];
    }

    public function getAll(): void
    {
        try {
            $pdo = Database::getConnection();
            $category = Request::getQueryParam('category');
            $search = Request::getQueryParam('search');

            $query = 'SELECT * FROM services WHERE is_active = 1';
            $params = [];

            if ($category && $category !== 'All') {
                $query .= ' AND category = ?';
                $params[] = $category;
            }

            if ($search) {
                $query .= ' AND (name LIKE ? OR description LIKE ?)';
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
            }

            $query .= ' ORDER BY id ASC';
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $services = array_map([self::class, 'formatService'], $rows);

            Response::json(['services' => $services]);
        } catch (Exception $e) {
            error_log('Fetch services error: ' . $e->getMessage());
            Response::error('Failed to retrieve services.', 500);
        }
    }

    public function getCategories(): void
    {
        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->query('SELECT DISTINCT category FROM services WHERE is_active = 1 ORDER BY category ASC');
            $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

            Response::json(['categories' => array_merge(['All'], $rows)]);
        } catch (Exception $e) {
            error_log('Fetch categories error: ' . $e->getMessage());
            Response::error('Failed to retrieve categories.', 500);
        }
    }

    public function getById(int|string $id): void
    {
        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('SELECT * FROM services WHERE id = ?');
            $stmt->execute([(int) $id]);
            $service = $stmt->fetch();

            if (!$service) {
                Response::error('Service not found.', 404);
            }

            Response::json(['service' => self::formatService($service)]);
        } catch (Exception $e) {
            error_log('Fetch service error: ' . $e->getMessage());
            Response::error('Failed to retrieve service.', 500);
        }
    }

    public function create(): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $body = Request::getBody();
            $name = isset($body['name']) ? trim((string) $body['name']) : '';
            $category = isset($body['category']) ? trim((string) $body['category']) : '';
            $description = isset($body['description']) ? trim((string) $body['description']) : null;
            $priceNgn = isset($body['price_ngn']) ? (int) $body['price_ngn'] : null;
            $durationMins = isset($body['duration_mins']) ? (int) $body['duration_mins'] : 60;
            $imageUrl = isset($body['image_url']) ? trim((string) $body['image_url']) : null;

            if ($name === '' || $category === '' || $priceNgn === null) {
                Response::error('Name, category, and price in Naira are required.', 400);
            }

            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('
                INSERT INTO services (name, category, description, price_ngn, duration_mins, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([$name, $category, $description, $priceNgn, $durationMins, $imageUrl]);
            $newId = (int) $pdo->lastInsertId();

            $fetchStmt = $pdo->prepare('SELECT * FROM services WHERE id = ?');
            $fetchStmt->execute([$newId]);
            $newService = $fetchStmt->fetch();

            Response::json([
                'message' => 'Service created successfully.',
                'service' => self::formatService($newService),
            ], 201);
        } catch (Exception $e) {
            error_log('Create service error: ' . $e->getMessage());
            Response::error('Failed to create service.', 500);
        }
    }

    public function update(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $body = Request::getBody();

            $stmt = $pdo->prepare('
                UPDATE services 
                SET name = COALESCE(?, name),
                    category = COALESCE(?, category),
                    description = COALESCE(?, description),
                    price_ngn = COALESCE(?, price_ngn),
                    duration_mins = COALESCE(?, duration_mins),
                    image_url = COALESCE(?, image_url),
                    is_active = COALESCE(?, is_active)
                WHERE id = ?
            ');

            $name = isset($body['name']) ? trim((string) $body['name']) : null;
            $category = isset($body['category']) ? trim((string) $body['category']) : null;
            $description = array_key_exists('description', $body) ? $body['description'] : null;
            $priceNgn = array_key_exists('price_ngn', $body) ? (int) $body['price_ngn'] : null;
            $durationMins = array_key_exists('duration_mins', $body) ? (int) $body['duration_mins'] : null;
            $imageUrl = array_key_exists('image_url', $body) ? $body['image_url'] : null;
            $isActive = array_key_exists('is_active', $body) ? ($body['is_active'] ? 1 : 0) : null;

            $stmt->execute([
                $name,
                $category,
                $description,
                $priceNgn,
                $durationMins,
                $imageUrl,
                $isActive,
                (int) $id,
            ]);

            $fetchStmt = $pdo->prepare('SELECT * FROM services WHERE id = ?');
            $fetchStmt->execute([(int) $id]);
            $updated = $fetchStmt->fetch();

            if (!$updated) {
                Response::error('Service not found.', 404);
            }

            Response::json([
                'message' => 'Service updated successfully.',
                'service' => self::formatService($updated),
            ]);
        } catch (Exception $e) {
            error_log('Update service error: ' . $e->getMessage());
            Response::error('Failed to update service.', 500);
        }
    }

    public function delete(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('DELETE FROM services WHERE id = ?');
            $stmt->execute([(int) $id]);

            Response::json(['message' => 'Service deleted successfully.']);
        } catch (Exception $e) {
            error_log('Delete service error: ' . $e->getMessage());
            Response::error('Failed to delete service.', 500);
        }
    }
}

