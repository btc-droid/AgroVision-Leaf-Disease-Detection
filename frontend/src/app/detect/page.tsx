'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

interface DetectionResult {
  disease_name: string;
  accuracy: number;
  description: string;
  solution: string;
  image_url: string;
}

export default function Detect() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG or PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    setError('');
    setResult(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setResult({
          ...response.data.data,
          image_url: response.data.image_url,
        });
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('auth_token');
        router.push('/login');
      } else {
        setError(err.response?.data?.message || 'Analysis failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-50 border-green-200';
    if (accuracy >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="flex flex-grow">
      <Sidebar />
      <div className="flex-grow p-6 md:p-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">AI Plant Disease Detection</h1>
          <p className="text-gray-500 mt-1">Upload a leaf image to identify diseases with deep learning.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Zone */}
          <div className="glass-card flex flex-col">
            <h2 className="text-lg font-bold text-gray-700 mb-5 flex items-center gap-2">
              <i className="fa-solid fa-upload text-primary-green"></i>
              Upload Image
            </h2>

            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-300 flex-grow ${
                  isDragging
                    ? 'border-primary-green bg-primary-green/5 scale-[1.02]'
                    : 'border-gray-200 hover:border-primary-green/50 hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-green/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-primary-green text-3xl"></i>
                </div>
                <p className="font-semibold text-gray-700 mb-1">Drag & drop your image</p>
                <p className="text-sm text-gray-400 mb-4">or click to browse</p>
                <span className="text-xs text-gray-300 bg-gray-100 px-3 py-1 rounded-full">
                  JPG, PNG — max 5MB
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4 flex-grow">
                <div className="relative rounded-xl overflow-hidden border border-gray-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-56 object-cover"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <i className="fa-solid fa-file-image text-primary-green"></i>
                  <span className="truncate">{selectedFile?.name}</span>
                  <span className="text-gray-300 shrink-0">
                    ({selectedFile ? (selectedFile.size / 1024).toFixed(0) : 0} KB)
                  </span>
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation shrink-0"></i>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className={`mt-5 btn-primary-custom py-3 flex items-center justify-center gap-2 ${
                (!selectedFile || isLoading) ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Analyze Image
                </>
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="glass-card flex flex-col">
            <h2 className="text-lg font-bold text-gray-700 mb-5 flex items-center gap-2">
              <i className="fa-solid fa-flask text-primary-green"></i>
              Analysis Result
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center flex-grow py-12">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-green/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary-green border-t-transparent animate-spin"></div>
                  <div className="absolute inset-3 rounded-full bg-primary-green/10 flex items-center justify-center">
                    <i className="fa-solid fa-seedling text-primary-green"></i>
                  </div>
                </div>
                <p className="font-semibold text-gray-700">Analyzing your image...</p>
                <p className="text-sm text-gray-400 mt-1">This may take a few seconds</p>
              </div>
            ) : result ? (
              <div className="flex flex-col gap-5 flex-grow">
                {/* Disease Name + Accuracy */}
                <div className={`border rounded-xl p-5 ${getAccuracyBg(result.accuracy)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Detected Disease</p>
                      <h3 className="text-xl font-bold text-gray-800">{result.disease_name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Confidence</p>
                      <p className={`text-2xl font-black ${getAccuracyColor(result.accuracy)}`}>
                        {result.accuracy.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.accuracy >= 90 ? 'bg-green-500' :
                        result.accuracy >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${result.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-circle-info text-blue-400 text-sm"></i>
                    Description
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    {result.description}
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-lightbulb text-yellow-500 text-sm"></i>
                    Recommended Solution
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-green-50 p-4 rounded-xl border border-green-100">
                    {result.solution}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-rotate-left"></i> New Detection
                  </button>
                  <Link
                    href="/history"
                    className="flex-1 btn-primary-custom py-2.5 text-sm flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-clock-rotate-left"></i> View History
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-leaf text-gray-300 text-4xl"></i>
                </div>
                <p className="font-semibold text-gray-400">No results yet</p>
                <p className="text-sm text-gray-300 mt-1">Upload an image and click "Analyze" to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
