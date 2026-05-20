<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgroVision AI - @yield('title', 'Plant Disease Detection')</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS for Modern Glassmorphism & Agritech Theme -->
    <style>
        :root {
            --primary-green: #2E7D32;
            --light-green: #A5D6A7;
            --dark-green: #1B5E20;
            --bg-color: #f4f7f6;
            --glass-bg: rgba(255, 255, 255, 0.7);
            --glass-border: rgba(255, 255, 255, 0.4);
            --text-dark: #2c3e50;
            --shadow-soft: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            background-image: radial-gradient(circle at 10% 20%, rgba(165, 214, 167, 0.2) 0%, rgba(244, 247, 246, 1) 90%);
            color: var(--text-dark);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Glassmorphism Card */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            box-shadow: var(--shadow-soft);
            padding: 2rem;
            transition: transform 0.3s ease;
        }

        .glass-card:hover {
            transform: translateY(-5px);
        }

        /* Navbar */
        .navbar-custom {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(15px);
            border-bottom: 1px solid var(--glass-border);
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            padding: 1rem 2rem;
        }

        .navbar-brand {
            font-weight: 700;
            color: var(--primary-green) !important;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nav-link {
            font-weight: 500;
            color: var(--text-dark) !important;
            transition: color 0.3s ease;
        }

        .nav-link:hover {
            color: var(--primary-green) !important;
        }

        .btn-primary-custom {
            background: linear-gradient(135deg, var(--primary-green), var(--dark-green));
            border: none;
            border-radius: 8px;
            color: white;
            padding: 0.6rem 1.5rem;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);
            transition: all 0.3s ease;
        }

        .btn-primary-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
            color: white;
        }
        
        .main-content {
            flex-grow: 1;
            padding: 2rem 0;
        }

        /* Sidebar for Dashboard */
        .dashboard-wrapper {
            display: flex;
            min-height: calc(100vh - 76px);
        }
        
        .sidebar {
            width: 250px;
            background: rgba(255, 255, 255, 0.9);
            border-right: 1px solid var(--glass-border);
            padding: 2rem 1rem;
            backdrop-filter: blur(10px);
        }

        .sidebar a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            color: var(--text-dark);
            text-decoration: none;
            border-radius: 10px;
            margin-bottom: 10px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .sidebar a:hover, .sidebar a.active {
            background: rgba(46, 125, 50, 0.1);
            color: var(--primary-green);
        }
        
        .dashboard-content {
            flex-grow: 1;
            padding: 2rem;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
            animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
    </style>
    @stack('styles')
</head>
<body>

    @if(!request()->is('dashboard') && !request()->is('detect') && !request()->is('history'))
    <!-- Main Public Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom sticky-top">
        <div class="container">
            <a class="navbar-brand" href="{{ url('/') }}">
                <i class="fa-solid fa-leaf"></i> AgroVision AI
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    @guest
                        <li class="nav-item">
                            <a class="nav-link me-3" href="{{ route('login') }}">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="btn btn-primary-custom" href="{{ route('register') }}">Get Started</a>
                        </li>
                    @else
                        <li class="nav-item">
                            <a class="nav-link me-3" href="{{ route('dashboard') }}">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <form action="{{ route('logout') }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-sm btn-outline-danger" style="border-radius: 8px;">Logout</button>
                            </form>
                        </li>
                    @endguest
                </ul>
            </div>
        </div>
    </nav>
    <main class="main-content">
        @yield('content')
    </main>
    @else
    <!-- Dashboard Layout -->
    <nav class="navbar navbar-expand-lg navbar-custom sticky-top" style="padding: 0.8rem 2rem;">
        <a class="navbar-brand" href="{{ url('/') }}">
            <i class="fa-solid fa-leaf"></i> AgroVision AI
        </a>
        <div class="ms-auto d-flex align-items-center">
            <span class="me-3 fw-medium">Welcome, {{ Auth::user()->name }}</span>
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" class="btn btn-sm btn-outline-danger" style="border-radius: 8px;">Logout</button>
            </form>
        </div>
    </nav>
    <div class="dashboard-wrapper">
        <div class="sidebar d-none d-md-block">
            <div class="text-muted small fw-bold mb-3 px-3 text-uppercase">Menu</div>
            <a href="{{ route('dashboard') }}" class="{{ request()->is('dashboard') ? 'active' : '' }}">
                <i class="fa-solid fa-chart-pie"></i> Overview
            </a>
            <a href="{{ route('detect.index') }}" class="{{ request()->is('detect') ? 'active' : '' }}">
                <i class="fa-solid fa-microscope"></i> AI Detection
            </a>
            <a href="{{ route('detect.history') }}" class="{{ request()->is('history') ? 'active' : '' }}">
                <i class="fa-solid fa-clock-rotate-left"></i> History
            </a>
        </div>
        <div class="dashboard-content">
            @yield('content')
        </div>
    </div>
    @endif

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    @stack('scripts')
</body>
</html>
