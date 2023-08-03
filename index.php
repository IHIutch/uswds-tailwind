<?php
include_once(__DIR__ . '/vendor/autoload.php');

$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader);

$request = $_SERVER['REQUEST_URI'];

switch ($request) {
  case '/':
    echo $twig->render('base.twig');
    return;

  case '/accordion':
    echo $twig->render('accordion.twig');
    return;
}
