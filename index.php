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
  '/breadcrumb' => $twig->render('breadcrumb.twig'),
  '/breadcrumb-wrapping' => $twig->render('breadcrumb-wrapping.twig'),
  '/button' => $twig->render('button.twig'),
  '/button-group' => $twig->render('button-group.twig'),
  '/button-group-segmented' => $twig->render('button-group-segmented.twig'),
  '/checkbox' => $twig->render('checkbox.twig'),
  '/checkbox-tile' => $twig->render('checkbox-tile.twig'),
  '/combobox' => $twig->render('combobox.twig'),
  '/combobox-2' => $twig->render('combobox-2.twig'),
};

exit;
