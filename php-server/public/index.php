<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/autoload.php';

use App\Config\Config;
use App\Config\Database;
use App\Database\Seeder;
use App\Router\Router;
use App\Utils\Response;
use App\Controllers\AuthController;
use App\Controllers\ServicesController;
use App\Controllers\PerfumesController;
use App\Controllers\GalleryController;
use App\Controllers\AppointmentsController;
use App\Controllers\NotificationsController;
use App\Controllers\AdminController;

// Load environment configuration
Config::load();

// Run seeder automatically if database is fresh
try {
    $pdo = Database::getConnection();
    $userCount = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    if ($userCount === 0) {
        Seeder::run($pdo);
    }
} catch (Throwable $e) {
    error_log('Database initialization / seed notice: ' . $e->getMessage());
}

$router = new Router();

// Health Check
$router->get('/api/health', function () {
    Response::json([
        'status' => 'ok',
        'brand' => "Mira's Beauty Touch",
        'timestamp' => date('c'),
    ]);
});

// Auth Routes
$router->post('/api/auth/register', [AuthController::class, 'register']);
$router->post('/api/auth/login', [AuthController::class, 'login']);
$router->get('/api/auth/me', [AuthController::class, 'me']);
$router->post('/api/auth/forgot-password', [AuthController::class, 'forgotPassword']);
$router->post('/api/auth/reset-password', [AuthController::class, 'resetPassword']);
$router->put('/api/auth/profile', [AuthController::class, 'updateProfile']);

// Services Routes
$router->get('/api/services', [ServicesController::class, 'getAll']);
$router->get('/api/services/categories', [ServicesController::class, 'getCategories']);
$router->get('/api/services/:id', [ServicesController::class, 'getById']);
$router->post('/api/services', [ServicesController::class, 'create']);
$router->put('/api/services/:id', [ServicesController::class, 'update']);
$router->delete('/api/services/:id', [ServicesController::class, 'delete']);

// Perfumes Routes
$router->get('/api/perfumes', [PerfumesController::class, 'getAll']);
$router->get('/api/perfumes/brands', [PerfumesController::class, 'getBrands']);
$router->get('/api/perfumes/:id', [PerfumesController::class, 'getById']);
$router->post('/api/perfumes', [PerfumesController::class, 'create']);
$router->put('/api/perfumes/:id', [PerfumesController::class, 'update']);
$router->delete('/api/perfumes/:id', [PerfumesController::class, 'delete']);

// Gallery Routes
$router->get('/api/gallery', [GalleryController::class, 'getAll']);
$router->post('/api/gallery/:id/like', [GalleryController::class, 'toggleLike']);
$router->post('/api/gallery', [GalleryController::class, 'create']);
$router->delete('/api/gallery/:id', [GalleryController::class, 'delete']);

// Appointments Routes
$router->post('/api/appointments', [AppointmentsController::class, 'create']);
$router->get('/api/appointments/my-bookings', [AppointmentsController::class, 'myBookings']);
$router->post('/api/appointments/:id/cancel', [AppointmentsController::class, 'cancel']);
$router->get('/api/appointments/availability', [AppointmentsController::class, 'getAvailability']);

// Notifications Routes
$router->get('/api/notifications', [NotificationsController::class, 'getAll']);
$router->put('/api/notifications/:id/read', [NotificationsController::class, 'markAsRead']);
$router->put('/api/notifications/read-all', [NotificationsController::class, 'markAllAsRead']);

// Admin Routes
$router->get('/api/admin/stats', [AdminController::class, 'getStats']);
$router->get('/api/admin/appointments', [AdminController::class, 'getAppointments']);
$router->put('/api/admin/appointments/:id/approve', [AdminController::class, 'approveAppointment']);
$router->put('/api/admin/appointments/:id/reject', [AdminController::class, 'rejectAppointment']);
$router->put('/api/admin/appointments/:id/reschedule', [AdminController::class, 'rescheduleAppointment']);
$router->put('/api/admin/appointments/:id/complete', [AdminController::class, 'completeAppointment']);
$router->delete('/api/admin/appointments/:id', [AdminController::class, 'deleteAppointment']);
$router->get('/api/admin/users', [AdminController::class, 'getUsers']);
$router->get('/api/admin/settings', [AdminController::class, 'getSettings']);
$router->put('/api/admin/settings', [AdminController::class, 'updateSettings']);

// Dispatch Request
$router->dispatch();

