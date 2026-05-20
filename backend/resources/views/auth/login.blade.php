@extends('layouts.app')
@section('title', 'Login')

@section('content')
<div class="container animate-fade-in">
    <div class="row justify-content-center mt-5">
        <div class="col-md-5">
            <div class="glass-card">
                <div class="text-center mb-4">
                    <h3 class="fw-bold text-success">Welcome Back</h3>
                    <p class="text-muted">Login to access your AgroVision dashboard</p>
                </div>
                
                @if ($errors->any())
                    <div class="alert alert-danger" style="border-radius: 10px;">
                        <ul class="mb-0">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('login') }}">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label fw-medium">Email address</label>
                        <input type="email" name="email" class="form-control" style="border-radius: 10px; padding: 12px;" required autofocus value="{{ old('email') }}">
                    </div>
                    <div class="mb-4">
                        <label class="form-label fw-medium">Password</label>
                        <input type="password" name="password" class="form-control" style="border-radius: 10px; padding: 12px;" required>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary-custom">Login</button>
                    </div>
                </form>
                <div class="text-center mt-4">
                    <p class="text-muted">Don't have an account? <a href="{{ route('register') }}" class="text-success text-decoration-none fw-bold">Register</a></p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
