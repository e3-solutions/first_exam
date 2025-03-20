"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import ChatInterface from '../components/ChatInterface';
import { QuickBooksAuth } from '../types';

export default function Home() {
  const [quickBooksAuth, setQuickBooksAuth] = useState<QuickBooksAuth | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for stored QuickBooks auth on page load
  useEffect(() => {
    const storedAuth = localStorage.getItem('quickbooks_auth');
    console.log('storedAuth', storedAuth);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth) as QuickBooksAuth;
        // Only set if the token is still valid
        if (new Date(authData.expiresAt) > new Date()) {
          setQuickBooksAuth(authData);
        }
      } catch (error) {
        console.error('Error parsing stored QuickBooks auth:', error);
      }
    }
  }, []);

  // Handle QuickBooks OAuth code in URL (after callback)
  useEffect(() => {
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');

    if (code && realmId) {
      const handleCallback = async () => {
        try {
          const response = await fetch(`/api/quickbooks?code=${code}&realmId=${realmId}`);
          if (!response.ok) throw new Error('Failed to handle callback');
          const auth = await response.json();
          setQuickBooksAuth(auth);
          localStorage.setItem('quickbooks_auth', JSON.stringify(auth));
          router.replace('/');
        } catch (error) {
          console.error('Error handling QuickBooks callback:', error);
        }
      };

      handleCallback();
    }
  }, [searchParams, router]);

  const handleConnectQuickBooks = async () => {
    try {

      const response = await fetch('/api/quickbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add body if you need to send data
        // body: JSON.stringify({ someData: 'value' }),
      });
      console.log(response);
      // const response = await fetch('/api/quickbooks', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to initiate auth');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error initiating QuickBooks auth:', error);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>QuickBooks AI Chat</title>
        <meta name="description" content="Chat with AI about your QuickBooks data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">QuickBooks AI Chat</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
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