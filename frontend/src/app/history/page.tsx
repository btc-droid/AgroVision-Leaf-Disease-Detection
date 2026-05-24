'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

interface Detection {
  id: number;
  image: string;
  disease_name: string;
  accuracy: number;
  description: string;
  solution: string;
  created_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedData {
  data: Detection[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  links: PaginationLink[];
}

export default function History() {
  const router = useRouter();
  const [paginated, setPaginated] = useState<PaginatedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  const fetchHistory = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/history?page=${page}`);
      if (response.data.success) {
        setPaginated(response.data.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('auth_token');
        router.push('/login');
      } else {
        setError('Failed to load history. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchHistory();
  }, [router]);

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-100 text-green-700 border-green-200';
    if (accuracy >= 70) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-600 border-red-200';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-grow">
      <Sidebar />
      <div className="flex-grow p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Detection History</h1>
            <p className="text-gray-500 mt-1">
              {paginated ? `${paginated.total} total detection${paginated.total !== 1 ? 's' : ''}` : 'Your past plant disease analyses'}
            </p>
          </div>
          <Link href="/detect" className="btn-primary-custom flex items-center gap-2 text-sm">
            <i className="fa-solid fa-plus"></i>
            New Detection
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading history...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        ) : paginated && paginated.data.length === 0 ? (
          <div className="glass-card text-center py-20">
            <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-clock-rotate-left text-gray-300 text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Detections Yet</h3>
            <p className="text-gray-400 mb-6">Your detection history will appear here after your first analysis.</p>
            <Link href="/detect" className="btn-primary-custom inline-flex items-center gap-2">
              <i className="fa-solid fa-microscope"></i> Start Your First Detection
            </Link>
          </div>
        ) : (
          <>
            {/* Detection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
              {paginated?.data.map((det) => (
                <div
                  key={det.id}
                  className="glass-card !p-0 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedDetection(det)}
                >
                  {/* Image */}
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={`${BACKEND_URL}/storage/detections/${det.image}`}
                      alt={det.disease_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x200/e8f5e9/2E7D32?text=No+Image`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${getAccuracyBadge(det.accuracy)}`}>
                      {det.accuracy.toFixed(1)}%
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-base mb-1 truncate">{det.disease_name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{det.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <i className="fa-regular fa-calendar"></i>
                      <span>{formatDate(det.created_at)}</span>
                      <span className="text-gray-200">•</span>
                      <i className="fa-regular fa-clock"></i>
                      <span>{formatTime(det.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {paginated && paginated.last_page > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => fetchHistory(paginated.current_page - 1)}
                  disabled={paginated.current_page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                {Array.from({ length: paginated.last_page }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchHistory(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                      page === paginated.current_page
                        ? 'bg-primary-green text-white shadow-md'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => fetchHistory(paginated.current_page + 1)}
                  disabled={paginated.current_page === paginated.last_page}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {selectedDetection && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDetection(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div
              className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image */}
              <div className="relative h-52">
                <img
                  src={`${BACKEND_URL}/storage/detections/${selectedDetection.image}`}
                  alt={selectedDetection.disease_name}
                  className="w-full h-full object-cover rounded-t-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/500x200/e8f5e9/2E7D32?text=No+Image`;
                  }}
                />
                <button
                  onClick={() => setSelectedDetection(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
                <span className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-sm font-bold border ${getAccuracyBadge(selectedDetection.accuracy)}`}>
                  {selectedDetection.accuracy.toFixed(1)}% confidence
                </span>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Detected Disease</p>
                  <h2 className="text-2xl font-black text-gray-800">{selectedDetection.disease_name}</h2>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <i className="fa-regular fa-calendar"></i>
                    {formatDate(selectedDetection.created_at)} at {formatTime(selectedDetection.created_at)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                    <i className="fa-solid fa-circle-info text-blue-400"></i> Description
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                    {selectedDetection.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                    <i className="fa-solid fa-lightbulb text-yellow-500"></i> Recommended Solution
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-green-50 p-3 rounded-xl border border-green-100">
                    {selectedDetection.solution}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedDetection(null)}
                  className="w-full btn-primary-custom py-3 flex items-center justify-center gap-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
