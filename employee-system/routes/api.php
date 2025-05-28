<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

Route::get('/employees', [EmployeeController::class, 'index']);
Route::post('/sendDataEmployee', [EmployeeController::class, 'store']);