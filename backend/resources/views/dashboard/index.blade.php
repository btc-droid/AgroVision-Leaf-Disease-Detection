@extends('layouts.app')
@section('title', 'Dashboard')

@section('content')
<div class="animate-fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-success mb-0">Overview Analytics</h3>
        <a href="{{ route('detect.index') }}" class="btn btn-primary-custom">
            <i class="fa-solid fa-plus me-2"></i> New Detection
        </a>
    </div>

    <!-- Stats Row -->
    <div class="row mb-4">
        <div class="col-md-6 mb-3 mb-md-0">
            <div class="glass-card text-center">
                <div class="fs-1 text-success mb-2"><i class="fa-solid fa-leaf"></i></div>
                <h2 class="fw-bold">{{ $totalDetections }}</h2>
                <p class="text-muted mb-0">Total Scans</p>
            </div>
        </div>
        <div class="col-md-6">
            <div class="glass-card text-center">
                <div class="fs-1 text-primary mb-2"><i class="fa-solid fa-users"></i></div>
                <h2 class="fw-bold">{{ $totalUsers }}</h2>
                <p class="text-muted mb-0">Registered Users</p>
            </div>
        </div>
    </div>

    <div class="row">
        <!-- Chart -->
        <div class="col-lg-7 mb-4 mb-lg-0">
            <div class="glass-card h-100">
                <h5 class="fw-bold mb-4">Accuracy Distribution</h5>
                <canvas id="accuracyChart"></canvas>
            </div>
        </div>

        <!-- Recent History -->
        <div class="col-lg-5">
            <div class="glass-card h-100">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold mb-0">Recent Detections</h5>
                    <a href="{{ route('detect.history') }}" class="text-success text-decoration-none small fw-bold">View All</a>
                </div>
                
                @if($recentDetections->isEmpty())
                    <div class="text-center text-muted p-4">
                        <i class="fa-solid fa-folder-open fs-3 mb-2"></i>
                        <p class="mb-0">No detections yet.</p>
                    </div>
                @else
                    <ul class="list-group list-group-flush">
                        @foreach($recentDetections as $detection)
                        <li class="list-group-item bg-transparent px-0 py-3 border-bottom border-light">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded overflow-hidden shadow-sm" style="width: 50px; height: 50px;">
                                        <img src="{{ asset('storage/detections/' . $detection->image) }}" class="w-100 h-100 object-fit-cover" alt="Leaf" onerror="this.src='https://cdn-icons-png.flaticon.com/512/2913/2913604.png'">
                                    </div>
                                    <div>
                                        <h6 class="mb-0 fw-bold">{{ $detection->disease_name }}</h6>
                                        <small class="text-muted">{{ $detection->created_at->diffForHumans() }}</small>
                                    </div>
                                </div>
                                <span class="badge {{ $detection->accuracy >= 90 ? 'bg-success' : ($detection->accuracy >= 70 ? 'bg-warning text-dark' : 'bg-danger') }} rounded-pill">
                                    {{ $detection->accuracy }}%
                                </span>
                            </div>
                        </li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('accuracyChart').getContext('2d');
        const accuracyData = @json($accuracyData);
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['High (>90%)', 'Medium (70-90%)', 'Low (<70%)'],
                datasets: [{
                    data: [accuracyData.high, accuracyData.medium, accuracyData.low],
                    backgroundColor: [
                        '#2E7D32', // High - Green
                        '#FFC107', // Medium - Yellow
                        '#F44336'  // Low - Red
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                cutout: '75%'
            }
        });
    });
</script>
@endpush
