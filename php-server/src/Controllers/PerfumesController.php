<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Utils\Request;
use App\Utils\Response;
use Exception;
use PDO;

class PerfumesController
{
    private static function formatPerfume(array $p): array
    {
        return [
            'id' => (int) $p['id'],
            'name' => $p['name'],
            'brand' => $p['brand'],
            'description' => $p['description'],
            'fragrance_notes' => $p['fragrance_notes'],
            'size' => $p['size'] ?? '100ml EDP',
            'price_ngn' => (int) $p['price_ngn'],
            'stock_quantity' => (int) ($p['stock_quantity'] ?? 10),
            'image_url' => $p['image_url'],
            'is_featured' => (int) ($p['is_featured'] ?? 0),
            'is_active' => (int) ($p['is_active'] ?? 1),
            'created_at' => $p['created_at'] ?? null,
            'updated_at' => $p['updated_at'] ?? null,
        ];
    }

    public function getAll(): void
    {
        try {
            $pdo = Database::getConnection();
            $brand = Request::getQueryParam('brand');
            $search = Request::getQueryParam('search');
            $sort = Request::getQueryParam('sort');
            $featured = Request::getQueryParam('featured');

            $query = 'SELECT * FROM perfumes WHERE is_active = 1';
            $params = [];

            if ($featured === 'true' || $featured === '1') {
                $query .= ' AND is_featured = 1';
            }

            if ($brand && $brand !== 'All') {
                $query .= ' AND brand = ?';
                $params[] = $brand;
            }

            if ($search) {
                $query .= ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ? OR fragrance_notes LIKE ?)';
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
            }

            if ($sort === 'price_asc') {
                $query .= ' ORDER BY price_ngn ASC';
            } elseif ($sort === 'price_desc') {
                $query .= ' ORDER BY price_ngn DESC';
            } elseif ($sort === 'name') {
                $query .= ' ORDER BY name ASC';
            } else {
                $query .= ' ORDER BY is_featured DESC, id DESC';
            }

            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $perfumes = array_map([self::class, 'formatPerfume'], $rows);

            Response::json(['perfumes' => $perfumes]);
        } catch (Exception $e) {
            error_log('Fetch perfumes error: ' . $e->getMessage());
            Response::error('Failed to retrieve perfumes.', 500);
        }
    }

    public function getBrands(): void
    {
        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->query('SELECT DISTINCT brand FROM perfumes WHERE is_active = 1 ORDER BY brand ASC');
            $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

            Response::json(['brands' => array_merge(['All'], $rows)]);
        } catch (Exception $e) {
            error_log('Fetch brands error: ' . $e->getMessage());
            Response::error('Failed to retrieve brands.', 500);
        }
    }

    public function getById(int|string $id): void
    {
        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('SELECT * FROM perfumes WHERE id = ?');
            $stmt->execute([(int) $id]);
            $perfume = $stmt->fetch();

            if (!$perfume) {
                Response::error('Perfume product not found.', 404);
            }

            Response::json(['perfume' => self::formatPerfume($perfume)]);
        } catch (Exception $e) {
            error_log('Fetch perfume error: ' . $e->getMessage());
            Response::error('Failed to retrieve perfume.', 500);
        }
    }

    public function create(): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $body = Request::getBody();
            $name = isset($body['name']) ? trim((string) $body['name']) : '';
            $brand = isset($body['brand']) ? trim((string) $body['brand']) : '';
            $description = isset($body['description']) ? trim((string) $body['description']) : null;
            $fragranceNotes = isset($body['fragrance_notes']) ? trim((string) $body['fragrance_notes']) : null;
            $size = isset($body['size']) ? trim((string) $body['size']) : '100ml EDP';
            $priceNgn = isset($body['price_ngn']) ? (int) $body['price_ngn'] : null;
            $stockQuantity = isset($body['stock_quantity']) ? (int) $body['stock_quantity'] : 10;
            $imageUrl = isset($body['image_url']) ? trim((string) $body['image_url']) : null;
            $isFeatured = !empty($body['is_featured']) ? 1 : 0;

            if ($name === '' || $brand === '' || $priceNgn === null) {
                Response::error('Product name, brand, and Nigerian Naira price are required.', 400);
            }

            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('
                INSERT INTO perfumes (name, brand, description, fragrance_notes, size, price_ngn, stock_quantity, image_url, is_featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([$name, $brand, $description, $fragranceNotes, $size, $priceNgn, $stockQuantity, $imageUrl, $isFeatured]);
            $newId = (int) $pdo->lastInsertId();

            $fetchStmt = $pdo->prepare('SELECT * FROM perfumes WHERE id = ?');
            $fetchStmt->execute([$newId]);
            $newPerfume = $fetchStmt->fetch();

            Response::json([
                'message' => 'Perfume product added successfully.',
                'perfume' => self::formatPerfume($newPerfume),
            ], 201);
        } catch (Exception $e) {
            error_log('Create perfume error: ' . $e->getMessage());
            Response::error('Failed to add perfume.', 500);
        }
    }

    public function update(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $body = Request::getBody();

            $stmt = $pdo->prepare('
                UPDATE perfumes
                SET name = COALESCE(?, name),
                    brand = COALESCE(?, brand),
                    description = COALESCE(?, description),
                    fragrance_notes = COALESCE(?, fragrance_notes),
                    size = COALESCE(?, size),
                    price_ngn = COALESCE(?, price_ngn),
                    stock_quantity = COALESCE(?, stock_quantity),
                    image_url = COALESCE(?, image_url),
                    is_featured = COALESCE(?, is_featured),
                    is_active = COALESCE(?, is_active),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ');

            $name = isset($body['name']) ? trim((string) $body['name']) : null;
            $brand = isset($body['brand']) ? trim((string) $body['brand']) : null;
            $description = array_key_exists('description', $body) ? $body['description'] : null;
            $fragranceNotes = array_key_exists('fragrance_notes', $body) ? $body['fragrance_notes'] : null;
            $size = array_key_exists('size', $body) ? $body['size'] : null;
            $priceNgn = array_key_exists('price_ngn', $body) ? (int) $body['price_ngn'] : null;
            $stockQuantity = array_key_exists('stock_quantity', $body) ? (int) $body['stock_quantity'] : null;
            $imageUrl = array_key_exists('image_url', $body) ? $body['image_url'] : null;
            $isFeatured = array_key_exists('is_featured', $body) ? ($body['is_featured'] ? 1 : 0) : null;
            $isActive = array_key_exists('is_active', $body) ? ($body['is_active'] ? 1 : 0) : null;

            $stmt->execute([
                $name,
                $brand,
                $description,
                $fragranceNotes,
                $size,
                $priceNgn,
                $stockQuantity,
                $imageUrl,
                $isFeatured,
                $isActive,
                (int) $id,
            ]);

            $fetchStmt = $pdo->prepare('SELECT * FROM perfumes WHERE id = ?');
            $fetchStmt->execute([(int) $id]);
            $updated = $fetchStmt->fetch();

            if (!$updated) {
                Response::error('Perfume product not found.', 404);
            }

            Response::json([
                'message' => 'Perfume updated successfully.',
                'perfume' => self::formatPerfume($updated),
            ]);
        } catch (Exception $e) {
            error_log('Update perfume error: ' . $e->getMessage());
            Response::error('Failed to update perfume.', 500);
        }
    }

    public function delete(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('DELETE FROM perfumes WHERE id = ?');
            $stmt->execute([(int) $id]);

            Response::json(['message' => 'Perfume deleted successfully.']);
        } catch (Exception $e) {
            error_log('Delete perfume error: ' . $e->getMessage());
            Response::error('Failed to delete perfume.', 500);
        }
    }
}

