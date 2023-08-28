<?php
require_once __DIR__ . '/vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader);

$twig->addGlobal('environment', $_ENV['VERCEL_ENV'] ?? 'development');

$request = $_SERVER['REQUEST_URI'];

echo match ($request) {
  '/' => $twig->render('base.twig'),
  '/accordion' => $twig->render('accordion.twig'),
  '/accordion-bordered' => $twig->render('accordion-bordered.twig'),
  '/accordion-multiple' => $twig->render('accordion-multiple.twig'),
  '/alert' => $twig->render('alert.twig'),
  '/alert-slim' => $twig->render('alert-slim.twig'),
  '/alert-no-icon' => $twig->render('alert-no-icon.twig'),
};

exit;
