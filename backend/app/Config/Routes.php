<?php

use CodeIgniter\Router\RouteCollection;
$routes->options('api/(:any)', static function () {
    return response()->setStatusCode(204);
});
/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');
$routes->group('api', static function ($routes) {

$routes->post('login', 'Api\AuthController::login');
//upcoming or evwent orders 

    $routes->get('party-orders', 'Api\PartyOrderController::index');
    $routes->post('party-orders', 'Api\PartyOrderController::store');
    $routes->get('party-orders/(:num)', 'Api\PartyOrderController::show/$1');
    $routes->put('party-orders/(:num)', 'Api\PartyOrderController::update/$1');
    $routes->delete('party-orders/(:num)', 'Api\PartyOrderController::delete/$1');

    $routes->get('deliveries', 'Api\DeliveryController::index');
    $routes->post('deliveries', 'Api\DeliveryController::store');
    $routes->get('deliveries/pending', 'Api\DeliveryController::pending');
    $routes->post('deliveries/settle', 'Api\DeliveryController::settle');
    $routes->get('customers', 'Api\CustomerController::index');
    $routes->get('managers', 'Api\ManagerController::index');
    $routes->get('dashboard/monthly', 'Api\DashboardController::monthly');
    $routes->post('customers', 'Api\CustomerController::store');
    $routes->get('expense-categories', 'Api\ExpenseCategoryController::index');
    $routes->post('expense-categories', 'Api\ExpenseCategoryController::store');
    $routes->post('expenses', 'Api\ExpenseController::store');




});
