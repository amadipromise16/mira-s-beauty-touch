<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/autoload.php';

use App\Config\Config;
use App\Database\Seeder;

Config::load();
Seeder::run();

