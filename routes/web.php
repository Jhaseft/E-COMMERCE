<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminControllerDashboard;
use App\Http\Controllers\AdminCategoryProductsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'flash' => [
            'success' => session('success'),
            'error' => session('error'),
        ],
    ]);
})->name('welcome');


Route::get('/products', [ProductController::class, 'index'])->name('products.index');

Route::prefix('carrito')->group(function () {
    Route::get('/data', [CartController::class, 'data'])->name('carrito.data');
    Route::post('/add', [CartController::class, 'add'])->name('carrito.add');
    Route::patch('/update/{rowId}', [CartController::class, 'update'])->name('carrito.update');
    Route::delete('/remove/{rowId}', [CartController::class, 'remove'])->name('carrito.remove');
    Route::delete('/clear', [CartController::class, 'clear'])->name('carrito.clear');
});


    Route::get('/checkout', function () {
        return Inertia::render('checkout');
    })->name('checkout');

    // Endpoint para crear pedido
    Route::post('/orders/store', [PedidosController::class, 'store'])->name('orders.store');



Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login.post');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

    Route::middleware('auth:admin')->group(function () {

        Route::get('/dashboard', [AdminControllerDashboard::class, 'index']);

        // Categorías
        Route::get('/categories/paginate', [AdminControllerDashboard::class, 'paginateCategories']);
        Route::post('/categories',          [AdminControllerDashboard::class, 'storeCategory']);
        Route::put('/categories/{category}', [AdminControllerDashboard::class, 'updateCategory']);
        Route::delete('/categories/bulk-delete', [AdminControllerDashboard::class, 'bulkDeleteCategories']);


       Route::get('/categories/{category}/products', [AdminCategoryProductsController::class, 'index']) ->name('admin.categories.products');
    Route::post('/products', [AdminCategoryProductsController::class, 'store']);
    Route::put('/products/{product}', [AdminCategoryProductsController::class, 'update']);
    Route::delete('/products/{product}', [AdminCategoryProductsController::class, 'destroy']);

//mostar estados y metodos de pago
Route::get('/orders/meta', [OrderController::class, 'meta']);
        // Ordenes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
    
    // Reportes de ventas
Route::get('/reportes', [ReportController::class, 'ventas']);
Route::get('/reportes/excel', [ReportController::class, 'exportExcel']);
Route::get('/reportes/csv', [ReportController::class, 'exportCsv']);
Route::get('/reportes/pdf', [ReportController::class, 'exportPdf']);

    });
});



Route::get('/auth/google/redirect', [SocialController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [SocialController::class, 'handleGoogleCallback'])->name('google.callback');


require __DIR__.'/auth.php';
