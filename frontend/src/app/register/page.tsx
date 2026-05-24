'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Link from 'next/link';
import Head from 'next/head';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat() as string[];
        setErrors(errorMessages);
      } else {
        setErrors([err.response?.data?.message || 'Registration failed. Please try again.']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - AgroVision AI</title>
      </Head>
      <div className="container mx-auto px-4 flex-grow flex items-center justify-center py-12">
        <div className="max-w-md w-full glass-card animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-primary-green mb-2">Create Account</h3>
            <p className="text-gray-500">Join AgroVision to detect plant diseases</p>
          </div>
          
          {errors.length > 0 && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100">
              <ul className="list-disc list-inside">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all"
                required 
                autoFocus
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all"
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary-custom mt-2 py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-500">
              Already have an account? <Link href="/login" className="text-primary-green font-bold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
