<?php

declare(strict_types=1);

namespace App\Config;

use App\Database\Schema;
use PDO;
use Exception;

class Database
{
    private static ?PDO $pdo = null;

    public static function getConnection(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $dbSetting = Config::get('DB_PATH', 'miras_beauty_touch.db');

        // Check configured path, or root/server existing database, or local php-server directory
        if (file_exists($dbSetting)) {
            $dbPath = realpath($dbSetting);
        } else {
            $possiblePaths = [
                $dbSetting,
                dirname(__DIR__, 2) . '/' . $dbSetting,
                dirname(__DIR__, 2) . '/../server/' . $dbSetting,
                dirname(__DIR__, 2) . '/../server/miras_beauty_touch.db',
            ];

            $dbPath = null;
            foreach ($possiblePaths as $path) {
                if (file_exists($path)) {
                    $dbPath = realpath($path);
                    break;
                }
            }

            if ($dbPath === null) {
                $dbPath = dirname(__DIR__, 2) . '/' . $dbSetting;
            }
        }

        try {
            self::$pdo = new PDO('sqlite:' . $dbPath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);

            // Initialize schema if not yet present
            Schema::createTables(self::$pdo);

            return self::$pdo;
        } catch (Exception $e) {
            error_log('Database Connection Error: ' . $e->getMessage());
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }
}

