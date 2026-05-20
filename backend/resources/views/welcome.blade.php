@extends('layouts.app')

@section('title', 'Deep Learning Plant Disease Detection')

@section('content')
<div class="container animate-fade-in">
    <div class="row align-items-center min-vh-75 mt-5">
        <div class="col-lg-6 mb-5 mb-lg-0">
            <span class="badge bg-success bg-opacity-25 text-success mb-3 px-3 py-2 rounded-pill fw-bold">
                <i class="fa-solid fa-microchip me-1"></i> AI Powered Agriculture
            </span>
            <h1 class="display-4 fw-bold mb-4" style="color: var(--dark-green); line-height: 1.2;">
                AgroVision AI<br>
                <span class="text-secondary" style="font-size: 2rem;">Deteksi Penyakit Tanaman Berbasis Deep Learning</span>
            </h1>
            <p class="lead text-muted mb-5" style="font-size: 1.1rem; max-width: 90%;">
                Upload gambar daun tanaman dan biarkan AI kami menganalisis penyakit secara otomatis menggunakan teknologi Convolutional Neural Network (CNN) terkini. Dapatkan hasil instan dan solusi penanganan.
            </p>
            <div class="d-flex gap-3">
                <a href="{{ route('register') }}" class="btn btn-primary-custom btn-lg">
                    Mulai Deteksi <i class="fa-solid fa-arrow-right ms-2"></i>
                </a>
                <a href="#features" class="btn btn-outline-success btn-lg" style="border-radius: 8px;">
                    Pelajari Lebih Lanjut
                </a>
            </div>
            
            <div class="mt-5 d-flex align-items-center gap-4 text-muted">
                <div class="d-flex align-items-center gap-2">
                    <i class="fa-solid fa-check-circle text-success fs-5"></i>
                    <span>Akurasi Tinggi</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <i class="fa-solid fa-bolt text-success fs-5"></i>
                    <span>Real-time Analysis</span>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="position-relative">
                <!-- Abstract blobs for modern background -->
                <div class="position-absolute" style="top: -50px; right: -50px; width: 300px; height: 300px; background: rgba(165, 214, 167, 0.4); filter: blur(60px); border-radius: 50%; z-index: -1;"></div>
                <div class="position-absolute" style="bottom: -50px; left: 0px; width: 250px; height: 250px; background: rgba(46, 125, 50, 0.2); filter: blur(50px); border-radius: 50%; z-index: -1;"></div>
                
                <div class="glass-card text-center p-5">
                    <img src="https://cdn-icons-png.flaticon.com/512/2913/2913604.png" alt="Smart Farming AI" class="img-fluid" style="max-height: 400px; animation: float 6s ease-in-out infinite;">
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
    }
</style>
@endsection
