'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';
import Sidebar from '@/components/Sidebar';

interface Detection {
  id: number;
  image: string;
  disease_name: string;
  accuracy: number;
  created_at: string;
}

interface DashboardData {
  totalDetections: number;
  totalUsers: number;
  recentDetections: Detection[];
  accuracyData: {
    high: number;
    medium: number;
    low: number;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [dashRes, userRes] = await Promise.all([
          axios.get('/api/dashboard'),
          axios.get('/api/user'),
        ]);
        if (dashRes.data.success) {
          setData(dashRes.data.data);
        }
        setUserName(userRes.data.name);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('auth_token');
          router.push('/login');
        } else {
          setError('Failed to load dashboard data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-100 text-green-700';
    if (accuracy >= 70) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="flex flex-grow">
      <Sidebar />
      <div className="flex-grow p-6 md:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {userName ? `Welcome back, ${userName.split(' ')[0]}! 👋` : 'Dashboard'}
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your plant disease detections.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>
        ) : data && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="glass-card !p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-green/10 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-microscope text-primary-green text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Detections</p>
                  <p className="text-3xl font-bold text-gray-800">{data.totalDetections}</p>
                </div>
              </div>

              <div className="glass-card !p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-users text-blue-500 text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800">{data.totalUsers}</p>
                </div>
              </div>

              <div className="glass-card !p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-chart-pie text-emerald-500 text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">High Accuracy (&ge;90%)</p>
                  <p className="text-3xl font-bold text-gray-800">{data.accuracyData.high}</p>
                </div>
              </div>
            </div>

            {/* Accuracy Breakdown */}
            <div className="glass-card mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-5">Accuracy Breakdown</h2>
              <div className="space-y-4">
                {[
                  { label: 'High Confidence (≥90%)', value: data.accuracyData.high, color: 'bg-green-500', total: data.totalDetections },
                  { label: 'Medium Confidence (70–89%)', value: data.accuracyData.medium, color: 'bg-yellow-400', total: data.totalDetections },
                  { label: 'Low Confidence (<70%)', value: data.accuracyData.low, color: 'bg-red-400', total: data.totalDetections },
                ].map((item) => {
                  const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold">{item.value} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Detections */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-800">Recent Detections</h2>
                <Link href="/history" className="text-sm text-primary-green font-semibold hover:underline">
                  View All →
                </Link>
              </div>
              {data.recentDetections.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fa-solid fa-leaf text-5xl text-gray-200 mb-4"></i>
                  <p className="text-gray-400">No detections yet.</p>
                  <Link href="/detect" className="btn-primary-custom inline-block mt-4 text-sm">
                    Start Detection
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-gray-400 font-semibold pb-3 pr-4">Disease</th>
                        <th className="text-left text-gray-400 font-semibold pb-3 pr-4">Accuracy</th>
                        <th className="text-left text-gray-400 font-semibold pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.recentDetections.map((det) => (
                        <tr key={det.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 pr-4 font-medium text-gray-700">{det.disease_name}</td>
                          <td className="py-3 pr-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getAccuracyBadge(det.accuracy)}`}>
                              {det.accuracy.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 text-gray-500">{formatDate(det.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
