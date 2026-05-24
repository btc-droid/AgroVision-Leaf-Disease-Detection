'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Link from 'next/link';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - AgroVision AI</title>
      </Head>
      <div className="container mx-auto px-4 flex-grow flex items-center justify-center py-12">
        <div className="max-w-md w-full glass-card animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-primary-green mb-2">Welcome Back</h3>
            <p className="text-gray-500">Login to access your AgroVision dashboard</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all"
                required 
                autoFocus
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary-custom mt-2 py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-500">
              Don't have an account? <Link href="/register" className="text-primary-green font-bold hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
