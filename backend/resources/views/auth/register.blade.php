@extends('layouts.app')
@section('title', 'Register')

@section('content')
<div class="container animate-fade-in">
    <div class="row justify-content-center mt-4">
        <div class="col-md-5">
            <div class="glass-card">
                <div class="text-center mb-4">
                    <h3 class="fw-bold text-success">Create Account</h3>
                    <p class="text-muted">Join AgroVision to detect plant diseases</p>
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

                <form method="POST" action="{{ route('register') }}">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label fw-medium">Full Name</label>
                        <input type="text" name="name" class="form-control" style="border-radius: 10px; padding: 12px;" required autofocus value="{{ old('name') }}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-medium">Email address</label>
                        <input type="email" name="email" class="form-control" style="border-radius: 10px; padding: 12px;" required value="{{ old('email') }}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-medium">Password</label>
                        <input type="password" name="password" class="form-control" style="border-radius: 10px; padding: 12px;" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label fw-medium">Confirm Password</label>
                        <input type="password" name="password_confirmation" class="form-control" style="border-radius: 10px; padding: 12px;" required>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary-custom">Register</button>
                    </div>
                </form>
                <div class="text-center mt-4">
                    <p class="text-muted">Already have an account? <a href="{{ route('login') }}" class="text-success text-decoration-none fw-bold">Login</a></p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
