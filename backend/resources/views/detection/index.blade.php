@extends('layouts.app')
@section('title', 'AI Detection')

@section('content')
<div class="animate-fade-in">
    <h3 class="fw-bold text-success mb-4">Plant Disease Detection</h3>
    
    <div class="row">
        <div class="col-lg-6 mb-4">
            <div class="glass-card">
                <h5 class="fw-bold mb-3">Upload Leaf Image</h5>
                <form id="uploadForm" enctype="multipart/form-data">
                    @csrf
                    <div class="upload-area p-5 text-center border rounded position-relative mb-3" style="border: 2px dashed var(--primary-green) !important; background: rgba(46, 125, 50, 0.05); cursor: pointer;" id="dropZone">
                        <input type="file" name="image" id="imageInput" class="position-absolute w-100 h-100 opacity-0" style="top: 0; left: 0; cursor: pointer;" accept="image/jpeg, image/png, image/jpg" required>
                        <i class="fa-solid fa-cloud-arrow-up text-success mb-3" style="font-size: 3rem;"></i>
                        <h5 class="fw-bold">Drag & Drop or Click to Upload</h5>
                        <p class="text-muted small mb-0">Supported formats: JPEG, PNG, JPG (Max 5MB)</p>
                    </div>
                    
                    <div id="previewContainer" class="d-none text-center mb-3">
                        <img id="imagePreview" src="" class="img-fluid rounded shadow-sm" style="max-height: 250px;">
                    </div>
                    
                    <button type="submit" class="btn btn-primary-custom w-100" id="analyzeBtn">
                        <i class="fa-solid fa-microchip me-2"></i> Analyze with AI
                    </button>
                </form>
            </div>
        </div>
        
        <div class="col-lg-6">
            <div class="glass-card h-100 d-flex flex-column justify-content-center align-items-center text-center" id="resultCard">
                <i class="fa-solid fa-seedling text-muted mb-3 opacity-50" style="font-size: 4rem;"></i>
                <h5 class="text-muted opacity-75">Analysis Result Will Appear Here</h5>
                <p class="text-muted small px-4">Upload an image of a plant leaf and click analyze to see the AI predictions.</p>
            </div>
            
            <!-- Result Template (Hidden initially) -->
            <div class="glass-card h-100 d-none" id="resultData">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">Detection Result</h5>
                    <span id="resStatus" class="badge bg-success rounded-pill px-3 py-2">Healthy</span>
                </div>
                
                <h3 id="resDisease" class="fw-bold text-success mb-1">Disease Name</h3>
                <p class="text-muted mb-4">Accuracy: <span id="resAccuracy" class="fw-bold">0%</span></p>
                
                <div class="mb-3">
                    <h6 class="fw-bold"><i class="fa-solid fa-circle-info text-primary me-2"></i> Description</h6>
                    <p id="resDesc" class="text-muted small border-start border-3 border-primary ps-3">...</p>
                </div>
                
                <div>
                    <h6 class="fw-bold"><i class="fa-solid fa-flask text-warning me-2"></i> Recommended Solution</h6>
                    <p id="resSolution" class="text-muted small border-start border-3 border-warning ps-3">...</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const imageInput = document.getElementById('imageInput');
        const previewContainer = document.getElementById('previewContainer');
        const imagePreview = document.getElementById('imagePreview');
        const dropZone = document.getElementById('dropZone');
        const uploadForm = document.getElementById('uploadForm');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resultCard = document.getElementById('resultCard');
        const resultData = document.getElementById('resultData');
        
        // Image Preview
        imageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    previewContainer.classList.remove('d-none');
                    dropZone.classList.add('d-none');
                }
                reader.readAsDataURL(this.files[0]);
            }
        });

        // Form Submit
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if(!imageInput.files[0]) {
                Swal.fire('Error', 'Please select an image first.', 'error');
                return;
            }

            const formData = new FormData(this);
            
            // Loading state
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Analyzing...';
            
            fetch("{{ route('detect.process') }}", {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                }
            })
            .then(response => response.json())
            .then(data => {
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '<i class="fa-solid fa-microchip me-2"></i> Analyze with AI';
                
                if(data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Analysis Complete!',
                        text: 'Successfully processed the image.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    // Show result data
                    resultCard.classList.add('d-none');
                    resultData.classList.remove('d-none');
                    
                    document.getElementById('resDisease').textContent = data.data.disease_name;
                    document.getElementById('resAccuracy').textContent = data.data.accuracy + '%';
                    document.getElementById('resDesc').textContent = data.data.description;
                    document.getElementById('resSolution').textContent = data.data.solution;
                    
                    const statusBadge = document.getElementById('resStatus');
                    // Assuming 'accuracy' and 'disease_name' give us the status, you can adjust this logic based on real data
                    if(data.data.disease_name.toLowerCase().includes('healthy')) {
                        statusBadge.className = 'badge bg-success rounded-pill px-3 py-2';
                        statusBadge.textContent = 'Healthy';
                    } else {
                        statusBadge.className = 'badge bg-danger rounded-pill px-3 py-2';
                        statusBadge.textContent = 'Diseased';
                    }
                    
                } else {
                    Swal.fire('Error', data.message || 'Something went wrong.', 'error');
                }
            })
            .catch(error => {
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '<i class="fa-solid fa-microchip me-2"></i> Analyze with AI';
                Swal.fire('Error', 'Failed to connect to the server.', 'error');
                console.error(error);
            });
        });
    });
</script>
@endpush
