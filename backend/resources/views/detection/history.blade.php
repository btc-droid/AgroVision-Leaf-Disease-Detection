@extends('layouts.app')
@section('title', 'Detection History')

@section('content')
<div class="animate-fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-success mb-0">Detection History</h3>
        <a href="{{ route('detect.index') }}" class="btn btn-primary-custom">
            <i class="fa-solid fa-plus me-2"></i> New Scan
        </a>
    </div>

    <div class="glass-card p-0 overflow-hidden">
        <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
                <thead class="bg-light">
                    <tr>
                        <th class="px-4 py-3 text-muted">Image</th>
                        <th class="py-3 text-muted">Disease Name</th>
                        <th class="py-3 text-muted">Accuracy</th>
                        <th class="py-3 text-muted">Status</th>
                        <th class="py-3 text-muted">Date</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($detections as $detection)
                    <tr>
                        <td class="px-4 py-3">
                            <div class="rounded overflow-hidden shadow-sm" style="width: 60px; height: 60px;">
                                <img src="{{ asset('storage/detections/' . $detection->image) }}" class="w-100 h-100 object-fit-cover" alt="Leaf Image" onerror="this.src='https://cdn-icons-png.flaticon.com/512/2913/2913604.png'">
                            </div>
                        </td>
                        <td class="py-3 fw-medium">{{ $detection->disease_name }}</td>
                        <td class="py-3">
                            <div class="d-flex align-items-center gap-2">
                                <div class="progress flex-grow-1" style="height: 6px; max-width: 100px;">
                                    <div class="progress-bar {{ $detection->accuracy >= 90 ? 'bg-success' : ($detection->accuracy >= 70 ? 'bg-warning' : 'bg-danger') }}" role="progressbar" style="width: {{ $detection->accuracy }}%"></div>
                                </div>
                                <span class="small fw-bold">{{ $detection->accuracy }}%</span>
                            </div>
                        </td>
                        <td class="py-3">
                            @if(str_contains(strtolower($detection->disease_name), 'healthy'))
                                <span class="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-2">Healthy</span>
                            @else
                                <span class="badge bg-danger bg-opacity-25 text-danger rounded-pill px-3 py-2">Diseased</span>
                            @endif
                        </td>
                        <td class="py-3 text-muted small">
                            {{ $detection->created_at->format('d M Y, H:i') }}
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="text-center py-5 text-muted">
                            <i class="fa-solid fa-inbox fs-2 mb-3 d-block opacity-50"></i>
                            No detection history found.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    
    <div class="d-flex justify-content-center mt-4">
        {{ $detections->links('pagination::bootstrap-5') }}
    </div>
</div>
@endsection
