<?php
require_once __DIR__ . '/vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader);

$twig->addGlobal('environment', $_ENV['VERCEL_ENV'] ?? 'development');

$request = $_SERVER['REQUEST_URI'];

switch ($request) {
  case '/':
    echo $twig->render('base.twig');
    break;

  case '/accordion':
    echo $twig->render('accordion.twig');
    break;

  case '/accordion-bordered':
    echo $twig->render('accordion-bordered.twig');
    break;

  case '/accordion-multiple':
    echo $twig->render('accordion-multiple.twig');
    break;
}

exit;
