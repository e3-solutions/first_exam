'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function QuickBooksCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get('code');
        const realmId = searchParams.get('realmId');

        if (!code || !realmId) {
          console.error('Missing required parameters');
          router.push('/?error=missing_params');
          return;
        }

        console.log('Processing QuickBooks callback with:', { code, realmId });
        
        // Exchange the code for tokens using our API route
        const response = await fetch('/api/quickbooks/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Token exchange failed');
        }

        const auth = await response.json();
        
        // Store the complete auth object including realmId
        const completeAuth = {
          ...auth,
          realmId,
        };
        
        // Store in localStorage
        localStorage.setItem('quickbooks_auth', JSON.stringify(completeAuth));
        
        console.log('Successfully authenticated with QuickBooks');
        
        // Redirect back to home page
        router.push('/');
      } catch (error) {
        console.error('Error handling QuickBooks callback:', error);
        router.push('/?error=auth_failed');
      }
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing QuickBooks Authentication</h1>
        <p>Please wait while we complete the authentication process...</p>
      </div>
    </div>
  );
} 