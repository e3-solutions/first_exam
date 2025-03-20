"use client"

// pages/index.tsx
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatInterface from '../components/ChatInterface';
import { QuickBooksAuth } from '../types';
import { initiateQuickBooksAuth } from '../services/quickbooks';

export default function Home() {
  const [quickBooksAuth, setQuickBooksAuth] = useState<QuickBooksAuth | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for stored QuickBooks auth on page load
  useEffect(() => {
    const storedAuth = localStorage.getItem('quickbooks_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth) as QuickBooksAuth;
        // Only set if the token is still valid
        if (new Date(authData.expiresAt) > new Date()) {
          setQuickBooksAuth(authData);
        }
      } catch (error) {
        console.error('Error parsing stored QuickBooks auth:', error);
        setError('Error loading stored authentication');
      }
    }
  }, []);
  
  // Handle QuickBooks OAuth code in URL (after callback)
  useEffect(() => {
    // Check pathname only after component mounts on client
    const pathname = window.location.pathname;
    console.log({pathname})
    // Only process if we're on the callback page
    
    if (pathname === '/quickbooks/callback') {
      const code = searchParams.get('code');
      const realmId = searchParams.get('realmId');
      
      if (code && realmId) {
        console.log('Received OAuth callback:', { code, realmId });
        // Handle the OAuth callback here
        const handleCallback = async () => {
          try {
            const { handleQuickBooksCallback } = await import('../services/quickbooks');
            const auth = await handleQuickBooksCallback(code, realmId);
            setQuickBooksAuth(auth);
            setError(null);
            // Clear the URL parameters by redirecting to home
            router.replace('/');
          } catch (error) {
            console.error('Error handling QuickBooks callback:', error);
            setError('Failed to authenticate with QuickBooks');
          }
        };
        
        handleCallback();
      }
    }
  }, [searchParams, router]);
  
  const handleConnectQuickBooks = () => {
    try {
      initiateQuickBooksAuth();
    } catch (error) {
      setError('Failed to start QuickBooks authentication');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">QuickBooks AI Chat</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        {error && (
          <div className="max-w-md mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {!quickBooksAuth ? (
          <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Connect to QuickBooks</h2>
            <p className="mb-6">
              Connect your QuickBooks account to chat with AI about your financial data.
            </p>
            <button
              onClick={handleConnectQuickBooks}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect QuickBooks
            </button>
          </div>
        ) : (
          <div className="h-[calc(100vh-12rem)]">
            <ChatInterface quickBooksAuth={quickBooksAuth} />
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <p>QuickBooks AI Chat Interview Project</p>
      </footer>
    </div>
  );
}