<?php
require_once __DIR__ . '/../config.php';

$_SESSION['admin_logged_in'] = false;
unset($_SESSION['admin_logged_in']);
session_destroy();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
flash_set('success', 'Anda telah berhasil keluar dari sistem admin.');
header('Location: ' . base_url('admin/login.php'));
exit;
