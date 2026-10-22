<?php
require_once __DIR__ . '/../config.php';

if (admin_logged_in()) {
    header('Location: ' . base_url('admin/index.php'));
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        flash_set('success', 'Selamat datang di Panel Admin Penerbit AISU!');
        header('Location: ' . base_url('admin/index.php'));
        exit;
    } else {
        $error = 'Username atau password yang Anda masukkan salah!';
    }
}

render_header('Login Admin', 'Panel Autentikasi Pengelola Penerbit AISU', 'admin/login.php');
?>

<div style="max-width:320px;margin:30px auto;background:#0d1a2b;border:1px solid #1a2f4c;padding:16px;">
  <h1 style="color:#38bdf8;font-size:11px;font-weight:bold;margin-bottom:8px;text-align:center;">LOGIN ADMIN PENERBIT</h1>
  <p style="color:#94a3b8;font-size:10px;text-align:center;margin-bottom:12px;">Masuk untuk mengelola katalog buku dan kategori</p>

  <?php if ($error): ?>
    <div class="alert alert-error"><?= sanitize($error) ?></div>
  <?php endif; ?>

  <form method="POST" action="">
    <div class="form-group">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" class="form-control" required autofocus autocomplete="username">
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" class="form-control" required autocomplete="current-password">
    </div>

    <div style="margin-top:12px;">
      <button type="submit" class="btn btn-primary" style="width:100%;">Masuk ke Sistem</button>
    </div>
  </form>

  <div style="margin-top:12px;padding-top:8px;border-top:1px solid #16273e;text-align:center;color:#64748b;font-size:10px;">
    Kredensial Default: admin / admin123<br>
    (Dapat diubah di <code>config.php</code>)
  </div>
</div>

<?php render_footer(); ?>
