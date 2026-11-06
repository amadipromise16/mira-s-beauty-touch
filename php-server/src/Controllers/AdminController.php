<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Utils\Request;
use App\Utils\Response;
use Exception;
use PDO;

class AdminController
{
    private static function formatAdminAppointment(array $a): array
    {
        return [
            'id' => (int) $a['id'],
            'booking_ref' => $a['booking_ref'],
            'reference_code' => $a['booking_ref'],
            'user_id' => (int) $a['user_id'],
            'service_id' => $a['service_id'] !== null ? (int) $a['service_id'] : null,
            'service_name' => $a['service_name'],
            'stylist_name' => $a['stylist_name'],
            'customer_name' => $a['customer_name'],
            'customer_email' => $a['customer_email'],
            'customer_phone' => $a['customer_phone'],
            'requested_date' => $a['requested_date'],
            'requested_time' => $a['requested_time'],
            'confirmed_date' => $a['requested_date'],
            'confirmed_time' => $a['requested_time'],
            'confirmed_date_time' => $a['confirmed_date_time'] ?? null,
            'customer_notes' => $a['customer_notes'] ?? null,
            'status' => $a['status'] ?? 'pending',
            'admin_notes' => $a['admin_notes'] ?? null,
            'price_ngn' => isset($a['price_ngn']) ? (int) $a['price_ngn'] : null,
            'user_email' => $a['user_email'] ?? $a['customer_email'] ?? null,
            'user_name' => $a['user_name'] ?? $a['customer_name'] ?? null,
            'created_at' => $a['created_at'] ?? null,
            'updated_at' => $a['updated_at'] ?? null,
        ];
    }

    public function getStats(): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();

            $clientsCount = (int) $pdo->query("SELECT COUNT(*) as count FROM users WHERE role = 'client'")->fetchColumn();
            $pendingApts = (int) $pdo->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'")->fetchColumn();
            $approvedApts = (int) $pdo->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'approved'")->fetchColumn();
            $completedApts = (int) $pdo->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'completed'")->fetchColumn();

            $today = date('Y-m-d');
            $upcomingStmt = $pdo->prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'approved' AND requested_date >= ?");
            $upcomingStmt->execute([$today]);
            $upcomingApts = (int) $upcomingStmt->fetchColumn();

            $galleryItems = (int) $pdo->query("SELECT COUNT(*) as count FROM gallery_items")->fetchColumn();
            $totalLikes = (int) $pdo->query("SELECT COUNT(*) as count FROM gallery_likes")->fetchColumn();
            $totalPerfumes = (int) $pdo->query("SELECT COUNT(*) as count FROM perfumes WHERE is_active = 1")->fetchColumn();
            $totalServices = (int) $pdo->query("SELECT COUNT(*) as count FROM services WHERE is_active = 1")->fetchColumn();

            $revenueStmt = $pdo->query("
                SELECT SUM(COALESCE(s.price_ngn, 15000)) as revenue 
                FROM appointments a 
                LEFT JOIN services s ON a.service_id = s.id 
                WHERE a.status IN ('approved', 'completed')
            ");
            $totalRevenue = (int) $revenueStmt->fetchColumn();

            Response::json([
                'stats' => [
                    'total_clients' => $clientsCount,
                    'total_customers' => $clientsCount,
                    'total_appointments' => $pendingApts + $approvedApts + $completedApts,
                    'pending_appointments' => $pendingApts,
                    'approved_appointments' => $approvedApts,
                    'confirmed_appointments' => $approvedApts,
                    'upcoming_appointments' => $upcomingApts,
                    'completed_appointments' => $completedApts,
                    'gallery_items' => $galleryItems,
                    'total_gallery_likes' => $totalLikes,
                    'total_perfumes' => $totalPerfumes,
                    'total_services' => $totalServices,
                    'total_revenue_ngn' => $totalRevenue,
                ]
            ]);
        } catch (Exception $e) {
            error_log('Admin stats error: ' . $e->getMessage());
            Response::error('Failed to retrieve admin statistics.', 500);
        }
    }

    public function getAppointments(): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $status = Request::getQueryParam('status');
            $search = Request::getQueryParam('search');

            $query = '
                SELECT a.*, u.email as user_email, u.full_name as user_name, s.price_ngn
                FROM appointments a
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN services s ON a.service_id = s.id
                WHERE 1=1
            ';
            $params = [];

            if ($status && $status !== 'all') {
                $statusLower = strtolower($status);
                if ($statusLower === 'confirmed' || $statusLower === 'approved') {
                    $query .= ' AND (a.status = "approved" OR a.status = "confirmed")';
                } else {
                    $query .= ' AND a.status = ?';
                    $params[] = $status;
                }
            }

            if ($search) {
                $query .= ' AND (a.booking_ref LIKE ? OR a.customer_name LIKE ? OR a.customer_phone LIKE ? OR a.service_name LIKE ?)';
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
            }

            $query .= ' ORDER BY a.requested_date DESC, a.id DESC';
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $appointments = array_map([self::class, 'formatAdminAppointment'], $rows);

            Response::json(['appointments' => $appointments]);
        } catch (Exception $e) {
            error_log('Admin appointments error: ' . $e->getMessage());
            Response::error('Failed to retrieve appointments.', 500);
        }
    }

    public function approveAppointment(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $body = Request::getBody();
            $adminNotes = isset($body['admin_notes']) ? trim((string) $body['admin_notes']) : null;
            $confirmedDate = isset($body['confirmed_date']) ? trim((string) $body['confirmed_date']) : null;
            $confirmedTime = isset($body['confirmed_time']) ? trim((string) $body['confirmed_time']) : null;

            $fetchStmt = $pdo->prepare('SELECT * FROM appointments WHERE id = ?');
            $fetchStmt->execute([(int) $id]);
            $apt = $fetchStmt->fetch();

            if (!$apt) {
                Response::error('Appointment not found.', 404);
            }

            $dateToConfirm = $confirmedDate ?: $apt['requested_date'];
            $timeToConfirm = $confirmedTime ?: $apt['requested_time'];
            $confirmedDateTimeStr = "{$dateToConfirm} at {$timeToConfirm}";

            $updateStmt = $pdo->prepare('
                UPDATE appointments 
                SET status = "approved",
                    requested_date = ?,
                    requested_time = ?,
                    confirmed_date_time = ?,
                    admin_notes = COALESCE(?, admin_notes),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ');
            $updateStmt->execute([$dateToConfirm, $timeToConfirm, $confirmedDateTimeStr, $adminNotes, (int) $id]);

            // Mandatory customer notification
            $notifMsg = "Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for {$dateToConfirm} at {$timeToConfirm}.";
            $notifStmt = $pdo->prepare('
                INSERT INTO notifications (user_id, type, title, message, appointment_id)
                VALUES (?, "appointment_approved", "Appointment Approved 🎉", ?, ?)
            ');
            $notifStmt->execute([(int) $apt['user_id'], $notifMsg, (int) $apt['id']]);

            $fetchUpdated = $pdo->prepare('
                SELECT a.*, u.email as user_email, u.full_name as user_name 
                FROM appointments a 
                LEFT JOIN users u ON a.user_id = u.id 
                WHERE a.id = ?
            ');
            $fetchUpdated->execute([(int) $id]);
            $updatedApt = $fetchUpdated->fetch();

            Response::json([
                'message' => 'Appointment approved and customer notified successfully.',
                'appointment' => self::formatAdminAppointment($updatedApt),
            ]);
        } catch (Exception $e) {
            error_log('Approve appointment error: ' . $e->getMessage());
            Response::error('Failed to approve appointment.', 500);
        }
    }

    public function rejectAppointment(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $body = Request::getBody();
            $adminNotes = isset($body['admin_notes']) ? trim((string) $body['admin_notes']) : 'Declined due to scheduling capacity.';

            $fetchStmt = $pdo->prepare('SELECT * FROM appointments WHERE id = ?');
            $fetchStmt->execute([(int) $id]);
            $apt = $fetchStmt->fetch();

            if (!$apt) {
                Response::error('Appointment not found.', 404);
            }

            $updateStmt = $pdo->prepare('
                UPDATE appointments 
                SET status = "rejected",
                    admin_notes = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ');
            $updateStmt->execute([$adminNotes, (int) $id]);

            $notifMsg = "Your appointment request for \"{$apt['service_name']}\" on {$apt['requested_date']} could not be accommodated at this time." . ($adminNotes ? " Note: {$adminNotes}" : ' Please feel free to select another time slot or contact us.');
            $notifStmt = $pdo->prepare('
                INSERT INTO notifications (user_id, type, title, message, appointment_id)
                VALUES (?, "appointment_rejected", "Appointment Update", ?, ?)
            ');
            $notifStmt->execute([(int) $apt['user_id'], $notifMsg, (int) $apt['id']]);

            $fetchUpdated = $pdo->prepare('SELECT * FROM appointments WHERE id = ?');
            $fetchUpdated->execute([(int) $id]);
            $updatedApt = $fetchUpdated->fetch();

            Response::json([
                'message' => 'Appointment rejected and customer notified.',
                'appointment' => self::formatAdminAppointment($updatedApt),
            ]);
        } catch (Exception $e) {
            error_log('Reject appointment error: ' . $e->getMessage());
            Response::error('Failed to reject appointment.', 500);
        }
    }

    public function rescheduleAppointment(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $body = Request::getBody();
            $newDate = isset($body['new_date']) ? trim((string) $body['new_date']) : '';
            $newTime = isset($body['new_time']) ? trim((string) $body['new_time']) : '';
            $adminNotes = isset($body['admin_notes']) ? trim((string) $body['admin_notes']) : 'Rescheduled by salon manager';

            if ($newDate === '' || $newTime === '') {
                Response::error('New date and new time are required.', 400);
            }

            $fetchStmt = $pdo->prepare('SELECT * FROM appointments WHERE id = ?');
            $fetchStmt->execute([(int) $id]);
            $apt = $fetchStmt->fetch();

            if (!$apt) {
                Response::error('Appointment not found.', 404);
            }

            $confirmedDateTimeStr = "{$newDate} at {$newTime}";

            $updateStmt = $pdo->prepare('
                UPDATE appointments 
                SET status = "approved",
                    requested_date = ?,
                    requested_time = ?,
                    confirmed_date_time = ?,
                    admin_notes = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ');
            $updateStmt->execute([$newDate, $newTime, $confirmedDateTimeStr, $adminNotes, (int) $id]);

            $notifMsg = "Your Mira’s Beauty Touch appointment has been rescheduled. Your confirmed appointment is now scheduled for {$newDate} at {$newTime}." . ($adminNotes ? " ({$adminNotes})" : '');
            $notifStmt = $pdo->prepare('
                INSERT INTO notifications (user_id, type, title, message, appointment_id)
                VALUES (?, "appointment_rescheduled", "Appointment Rescheduled 📅", ?, ?)
            ');
            $notifStmt->execute([(int) $apt['user_id'], $notifMsg, (int) $apt['id']]);

            $fetchUpdated = $pdo->prepare('SELECT * FROM appointments WHERE id = ?');
            $fetchUpdated->execute([(int) $id]);
            $updatedApt = $fetchUpdated->fetch();

            Response::json([
                'message' => 'Appointment rescheduled and customer notified.',
                'appointment' => self::formatAdminAppointment($updatedApt),
            ]);
        } catch (Exception $e) {
            error_log('Reschedule appointment error: ' . $e->getMessage());
            Response::error('Failed to reschedule appointment.', 500);
        }
    }

    public function completeAppointment(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $updateStmt = $pdo->prepare('UPDATE appointments SET status = "completed", updated_at = CURRENT_TIMESTAMP WHERE id = ?');
            $updateStmt->execute([(int) $id]);

            Response::json(['message' => 'Appointment marked as completed.']);
        } catch (Exception $e) {
            error_log('Complete appointment error: ' . $e->getMessage());
            Response::error('Failed to mark appointment completed.', 500);
        }
    }

    public function deleteAppointment(int|string $id): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('DELETE FROM appointments WHERE id = ?');
            $stmt->execute([(int) $id]);

            Response::json(['message' => 'Appointment deleted successfully.']);
        } catch (Exception $e) {
            error_log('Delete appointment error: ' . $e->getMessage());
            Response::error('Failed to delete appointment.', 500);
        }
    }

    public function getUsers(): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $users = $pdo->query('
                SELECT 
                    u.id, u.full_name, u.email, u.phone, u.role, u.created_at,
                    COUNT(a.id) as total_appointments
                FROM users u
                LEFT JOIN appointments a ON u.id = a.user_id
                GROUP BY u.id
                ORDER BY u.created_at DESC
            ')->fetchAll();

            $formatted = array_map(function (array $u) {
                return [
                    'id' => (int) $u['id'],
                    'full_name' => $u['full_name'],
                    'email' => $u['email'],
                    'phone' => $u['phone'],
                    'role' => $u['role'],
                    'created_at' => $u['created_at'],
                    'total_appointments' => (int) ($u['total_appointments'] ?? 0),
                ];
            }, $users);

            Response::json(['users' => $formatted]);
        } catch (Exception $e) {
            error_log('Get users error: ' . $e->getMessage());
            Response::error('Failed to retrieve users.', 500);
        }
    }

    public function getSettings(): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $pdo = Database::getConnection();
            $rows = $pdo->query('SELECT * FROM site_settings')->fetchAll();

            $settings = [];
            foreach ($rows as $r) {
                $settings[$r['key']] = $r['value'];
            }

            Response::json(['settings' => $settings]);
        } catch (Exception $e) {
            error_log('Get settings error: ' . $e->getMessage());
            Response::error('Failed to retrieve settings.', 500);
        }
    }

    public function updateSettings(): void
    {
        AuthMiddleware::requireAdmin();

        try {
            $body = Request::getBody();
            $settings = $body['settings'] ?? null;

            if (!is_array($settings)) {
                Response::error('Invalid settings payload.', 400);
            }

            $pdo = Database::getConnection();
            $upsert = $pdo->prepare('
                INSERT INTO site_settings (key, value) VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
            ');

            foreach ($settings as $key => $value) {
                $upsert->execute([(string) $key, (string) $value]);
            }

            Response::json(['message' => 'Settings saved successfully.']);
        } catch (Exception $e) {
            error_log('Update settings error: ' . $e->getMessage());
            Response::error('Failed to save settings.', 500);
        }
    }
}

