<?php
require_once __DIR__ . '/vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader);

$request = $_SERVER['REQUEST_URI'];

switch ($request) {
  case '/':
    echo $twig->render('base.twig');
    break;

  case '/accordion':
    echo $twig->render('accordion.twig');
    break;
}

exit;
