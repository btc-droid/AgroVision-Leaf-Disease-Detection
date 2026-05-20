<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Detection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DetectionController extends Controller
{
    public function process(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5120', // 5MB max
        ]);

        $user = $request->user();
        
        // Save image temporarily
        $path = $request->file('image')->store('temp_images');
        $fullPath = storage_path('app/private/' . $path);
        
        // Ensure path works for Laravel 11 / Storage
        if(!file_exists($fullPath)) {
            $fullPath = storage_path('app/' . $path);
        }

        try {
            // Call Python FastAPI
            $response = Http::attach(
                'file', file_get_contents($fullPath), 'image.jpg'
            )->post('http://127.0.0.1:8000/predict');

            // Delete temp image if you want, or move it to a public folder to display
            $publicPath = $request->file('image')->store('public/detections');
            $imageName = basename($publicPath);
            Storage::delete($path); // delete temp

            if ($response->successful()) {
                $data = $response->json();
                
                $detection = Detection::create([
                    'user_id' => $user->id,
                    'image' => $imageName,
                    'disease_name' => $data['disease_name'] ?? 'Unknown',
                    'accuracy' => $data['accuracy'] ?? 0,
                    'description' => $data['description'] ?? 'No description',
                    'solution' => $data['solution'] ?? 'No solution available',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Analysis complete!',
                    'data' => $detection,
                    'image_url' => asset('storage/detections/' . $imageName)
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'AI Engine failed to process the image.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not connect to the AI Engine. Is it running? Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function history(Request $request)
    {
        $detections = Detection::where('user_id', $request->user()->id)->latest()->paginate(10);
        return response()->json([
            'success' => true,
            'data' => $detections
        ]);
    }
}
