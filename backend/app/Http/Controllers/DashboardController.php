<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Detection;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $totalDetections = Detection::where('user_id', $user->id)->count();
        $totalUsers = User::count();
        
        $recentDetections = Detection::where('user_id', $user->id)
                                     ->latest()
                                     ->take(5)
                                     ->get();

        $accuracyData = [
            'high' => Detection::where('user_id', $user->id)->where('accuracy', '>=', 90)->count(),
            'medium' => Detection::where('user_id', $user->id)->whereBetween('accuracy', [70, 89.99])->count(),
            'low' => Detection::where('user_id', $user->id)->where('accuracy', '<', 70)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'totalDetections' => $totalDetections,
                'totalUsers' => $totalUsers,
                'recentDetections' => $recentDetections,
                'accuracyData' => $accuracyData
            ]
        ]);
    }
}
