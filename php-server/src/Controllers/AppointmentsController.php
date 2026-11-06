<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Utils\Request;
use App\Utils\Response;
use Exception;
use PDO;

class AppointmentsController
{
    private static function generateBookingRef(): string
    {
        $random = strtoupper(bin2hex(random_bytes(3)));
        $year = date('Y');
        return "MBT-{$year}-{$random}";
    }

    private static function formatAppointment(array $a): array
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
            'confirmed_date_time' => $a['confirmed_date_time'] ?? null,
            'customer_notes' => $a['customer_notes'] ?? null,
            'status' => $a['status'] ?? 'pending',
            'admin_notes' => $a['admin_notes'] ?? null,
            'price_ngn' => isset($a['price_ngn']) ? (int) $a['price_ngn'] : null,
            'duration_mins' => isset($a['duration_mins']) ? (int) $a['duration_mins'] : null,
            'service_image' => $a['service_image'] ?? null,
            'created_at' => $a['created_at'] ?? null,
            'updated_at' => $a['updated_at'] ?? null,
        ];
    }

    public function create(): void
    {
        // 1. Try to get authenticated user if present (optional auth for guest bookings)
        $user = null;
        try {
            $token = Request::getBearerToken();
            if ($token) {
                $user = AuthMiddleware::requireAuth();
            }
        } catch (Exception $e) {
            $user = null;
        }

        try {
            $body = Request::getBody();
            $serviceId = !empty($body['service_id']) ? (int) $body['service_id'] : null;
            $serviceName = isset($body['service_name']) ? trim((string) $body['service_name']) : '';
            $stylistName = isset($body['stylist_name']) ? trim((string) $body['stylist_name']) : 'Any Available Specialist';
            $customerName = isset($body['customer_name']) ? trim((string) $body['customer_name']) : ($user['full_name'] ?? '');
            $customerEmail = isset($body['customer_email']) ? trim((string) $body['customer_email']) : ($user['email'] ?? '');
            $customerPhone = isset($body['customer_phone']) ? trim((string) $body['customer_phone']) : ($user['phone'] ?? '');
            $requestedDate = isset($body['requested_date']) ? trim((string) $body['requested_date']) : '';
            $requestedTime = isset($body['requested_time']) ? trim((string) $body['requested_time']) : '';
            $customerNotes = isset($body['customer_notes']) ? trim((string) $body['customer_notes']) : null;

            if ($serviceName === '' || $requestedDate === '' || $requestedTime === '' || $customerName === '' || $customerPhone === '') {
                Response::error('Please provide all required appointment fields: service, customer name, phone, date, and time slot.', 400);
            }

            // Past date validation
            $today = date('Y-m-d');
            if ($requestedDate < $today) {
                Response::error('Appointment date cannot be in the past.', 400);
            }

            $pdo = Database::getConnection();

            // Double booking check for approved slots
            if (!empty($stylistName) && $stylistName !== 'Any Available Specialist') {
                $conflictStmt = $pdo->prepare('
                    SELECT id FROM appointments 
                    WHERE requested_date = ? AND requested_time = ? AND status = "approved" AND stylist_name = ?
                ');
                $conflictStmt->execute([$requestedDate, $requestedTime, $stylistName]);
            } else {
                $conflictStmt = $pdo->prepare('
                    SELECT id FROM appointments 
                    WHERE requested_date = ? AND requested_time = ? AND status = "approved"
                ');
                $conflictStmt->execute([$requestedDate, $requestedTime]);
            }

            if ($conflictStmt->fetch()) {
                Response::error('The requested time slot is already fully booked. Please choose an alternative time slot.', 409);
            }

            // Determine user_id: link to authenticated user or lookup/create by email
            $userId = $user ? (int) $user['id'] : null;
            if ($userId === null && !empty($customerEmail)) {
                $stmt = $pdo->prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)');
                $stmt->execute([strtolower($customerEmail)]);
                $existing = $stmt->fetch();
                if ($existing) {
                    $userId = (int) $existing['id'];
                } else {
                    $randomPass = 'mbt' . rand(1000, 9999);
                    $hash = password_hash($randomPass, PASSWORD_BCRYPT);
                    $insUser = $pdo->prepare('
                        INSERT INTO users (full_name, email, phone, password_hash, role)
                        VALUES (?, ?, ?, ?, "client")
                    ');
                    $insUser->execute([$customerName, strtolower($customerEmail), $customerPhone, $hash]);
                    $userId = (int) $pdo->lastInsertId();
                }
            }

            $bookingRef = self::generateBookingRef();

            $insertStmt = $pdo->prepare('
                INSERT INTO appointments (
                    booking_ref, user_id, service_id, service_name, stylist_name,
                    customer_name, customer_email, customer_phone, requested_date,
                    requested_time, status, customer_notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending", ?)
            ');

            $insertStmt->execute([
                $bookingRef,
                $userId,
                $serviceId,
                $serviceName,
                $stylistName,
                $customerName,
                $customerEmail,
                $customerPhone,
                $requestedDate,
                $requestedTime,
                $customerNotes,
            ]);

            $appointmentId = (int) $pdo->lastInsertId();

            // Create in-app notification for the customer
            if ($userId) {
                $notifStmt = $pdo->prepare('
                    INSERT INTO notifications (user_id, type, title, message, appointment_id)
                    VALUES (?, "system", "Appointment Request Submitted", ?, ?)
                ');
                $notifMsg = "Your booking request for \"{$serviceName}\" on {$requestedDate} at {$requestedTime} has been submitted (Ref: {$bookingRef}). It is currently pending salon administrator approval.";
                $notifStmt->execute([$userId, $notifMsg, $appointmentId]);
            }

            $fetchStmt = $pdo->prepare('SELECT * FROM appointments WHERE id = ?');
            $fetchStmt->execute([$appointmentId]);
            $newAppointment = $fetchStmt->fetch();

            Response::json([
                'message' => 'Appointment submitted successfully. Awaiting salon administrator confirmation.',
                'appointment' => self::formatAppointment($newAppointment),
            ], 201);
        } catch (Exception $e) {
            error_log('Create appointment error: ' . $e->getMessage());
            Response::error('Failed to submit appointment.', 500);
        }
    }

    public function myBookings(): void
    {
        $user = AuthMiddleware::requireAuth();

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('
                SELECT a.*, s.price_ngn, s.duration_mins, s.image_url as service_image
                FROM appointments a
                LEFT JOIN services s ON a.service_id = s.id
                WHERE a.user_id = ?
                ORDER BY a.requested_date DESC, a.id DESC
            ');
            $stmt->execute([(int) $user['id']]);
            $rows = $stmt->fetchAll();

            $bookings = array_map([self::class, 'formatAppointment'], $rows);

            Response::json([
                'bookings' => $bookings,
                'appointments' => $bookings, // Alias for maximum client convenience
            ]);
        } catch (Exception $e) {
            error_log('Fetch customer bookings error: ' . $e->getMessage());
            Response::error('Failed to retrieve bookings.', 500);
        }
    }

    public function cancel(int|string $id): void
    {
        $user = AuthMiddleware::requireAuth();

        try {
            $pdo = Database::getConnection();
            $checkStmt = $pdo->prepare('SELECT * FROM appointments WHERE id = ? AND user_id = ?');
            $checkStmt->execute([(int) $id, (int) $user['id']]);
            $apt = $checkStmt->fetch();

            if (!$apt) {
                Response::error('Appointment not found.', 404);
            }

            if ($apt['status'] === 'completed' || $apt['status'] === 'cancelled') {
                Response::error("Appointment is already {$apt['status']}.", 400);
            }

            $cancelStmt = $pdo->prepare('
                UPDATE appointments 
                SET status = "cancelled", updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            ');
            $cancelStmt->execute([(int) $apt['id']]);

            // Notification
            $notif = $pdo->prepare('
                INSERT INTO notifications (user_id, type, title, message, appointment_id)
                VALUES (?, "system", "Appointment Cancelled", ?, ?)
            ');
            $notif->execute([
                (int) $user['id'],
                "Your appointment (Ref: {$apt['booking_ref']}) for {$apt['service_name']} on {$apt['requested_date']} has been cancelled.",
                (int) $apt['id'],
            ]);

            Response::json(['message' => 'Appointment cancelled successfully.']);
        } catch (Exception $e) {
            error_log('Cancel appointment error: ' . $e->getMessage());
            Response::error('Failed to cancel appointment.', 500);
        }
    }

    public function getAvailability(): void
    {
        try {
            $date = Request::getQueryParam('date');
            if (!$date) {
                Response::error('Date query parameter is required.', 400);
            }

            $pdo = Database::getConnection();
            $stmt = $pdo->prepare('
                SELECT requested_time, stylist_name 
                FROM appointments 
                WHERE requested_date = ? AND status = "approved"
            ');
            $stmt->execute([(string) $date]);
            $booked = $stmt->fetchAll();

            $bookedSlots = array_map(function (array $b) {
                return [
                    'time' => $b['requested_time'],
                    'stylist' => $b['stylist_name'],
                ];
            }, $booked);

            Response::json([
                'date' => $date,
                'booked_slots' => $bookedSlots,
            ]);
        } catch (Exception $e) {
            error_log('Check availability error: ' . $e->getMessage());
            Response::error('Failed to check availability.', 500);
        }
    }
}

