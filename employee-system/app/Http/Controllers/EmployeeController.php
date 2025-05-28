<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    public function index()
    {
        $path = storage_path('app/private/employees.json');

        if (file_exists($path)) {
            $data = json_decode(file_get_contents($path), true);
            return response()->json([
                'status' => true,
                'data' => $data,
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'File not found',
            ], 404);
        }
    }
    public function store(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'maritalStatus' => 'required|in:single,married,divorced,widowed,separated,engaged',
            'phone' => ['required', 'regex:/^[0-9]{6,15}$/'],
            'email' => 'required|email',
            'address' => 'required|string',
            'dob' => 'required|date',
            'nationality' => 'required|string',
            'hireDate' => 'required|date',
            'department' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $employeeData = $validator->validated();

        // Format dob and hireDate to dd-mm-yyyy
        $employeeData['dob'] = Carbon::parse($employeeData['dob'])->format('d-m-Y');
        $employeeData['hireDate'] = Carbon::parse($employeeData['hireDate'])->format('d-m-Y');

        // Get current content (if any) from storage/app/employees.json
        $existingData = [];

        if (Storage::exists('employees.json')) {
            $existingData = json_decode(Storage::get('employees.json'), true) ?? [];
        }

        // Append new employee data
        $existingData[] = $employeeData;

        // Save back to the file
        Storage::put('employees.json', json_encode($existingData, JSON_PRETTY_PRINT));

        return response()->json([
            'status' => true,
            'message' => 'Employee data saved successfully to JSON file',
            'data' => $employeeData,
        ]);
    }
}