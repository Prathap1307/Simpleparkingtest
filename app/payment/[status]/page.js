'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import Link from 'next/link';

export default function PaymentStatusPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Validate and sanitize input
  const status = (params.status)?.toLowerCase();
  const bookingId = searchParams.get('bookingId') || '';
  const isValidStatus = (s) => 
    ['success', 'pending', 'failed'].includes(s);
  const safeStatus = isValidStatus(status) ? status : 'pending';

  // Status configurations with safe Tailwind classes
  const statusConfig = {
    success: {
      title: 'Payment Successful!',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      message: 'Your booking has been confirmed. A receipt has been sent to your email.',
      colorClass: 'text-green-600',
      bgClass: 'bg-green-100'
    },
    pending: {
      title: 'Processing Your Payment',
      icon: <Spinner size="lg" className="text-blue-500" />,
      message: 'Your payment is being processed. This may take a few moments. Please don\'t close this page.',
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-100'
    },
    failed: {
      title: 'Payment Failed',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      message: 'We couldn\'t process your payment. Please try again or use a different payment method.',
      colorClass: 'text-red-600',
      bgClass: 'bg-red-100'
    }
  };

  const currentConfig = statusConfig[safeStatus];

  const checkBookingStatus = async (id) => {
    if (isCheckingStatus) return;
    
    setIsCheckingStatus(true);
    try {
      const response = await fetch(`/api/booking-status?id=${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error('Failed to check status');
      
      const data = await response.json();
      
      if (data.status === 'confirmed') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastSuccessfulBooking', id);
          localStorage.removeItem('pendingBooking');
        }
        router.push(`/payment/success?bookingId=${encodeURIComponent(id)}`);
      } else if (data.status === 'payment_failed') {
        router.push('/payment/failed');
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
      setError('Failed to verify payment status. Please check your dashboard later.');
    } finally {
      setIsCheckingStatus(false);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (safeStatus === 'pending' && bookingId) {
      setIsProcessing(true);
      
      // Store pending booking
      if (typeof window !== 'undefined') {
        const pendingData = { 
          bookingId, 
          timestamp: new Date().toISOString() 
        };
        localStorage.setItem('pendingBooking', JSON.stringify(pendingData));
      }

      // Start polling with cleanup
      const interval = setInterval(() => {
        checkBookingStatus(bookingId);
      }, 5000);

      return () => clearInterval(interval);
    } else if (safeStatus === 'success' && bookingId && typeof window !== 'undefined') {
      localStorage.setItem('lastSuccessfulBooking', bookingId);
      localStorage.removeItem('pendingBooking');
    }
  }, [safeStatus, bookingId]);

  // Sanitize booking ID display
  const sanitizeId = (id) => {
    return id.replace(/[^a-zA-Z0-9-]/g, '');
  };

  return (
    <div className="max-w-md mx-auto text-center py-12 px-4">
    <gtag />
      <div className="mb-6">{currentConfig.icon}</div>
      <h1 className={`text-2xl font-bold ${currentConfig.colorClass} mb-4`}>
        {currentConfig.title}
      </h1>
      
      {error ? (
        <div className={`p-4 rounded-lg mb-6 ${statusConfig.failed.bgClass}`}>
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <p className="mb-6">{currentConfig.message}</p>
      )}

      {bookingId && (
        <div className={`p-4 rounded-lg mb-6 ${currentConfig.bgClass}`}>
          <p className="font-semibold">Booking Reference:</p>
          <p className="text-lg font-mono">{sanitizeId(bookingId)}</p>
        </div>
      )}

      <div className="space-y-3">
        {safeStatus === 'success' && (
          <Link href="/Manage-booking" passHref>
            <Button color="primary" className="w-full">
              View Your Bookings
            </Button>
          </Link>
        )}
        
        {safeStatus === 'pending' && !isProcessing && (
          <Link href="/" passHref>
            <Button color="primary" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        )}
        
        {safeStatus === 'failed' && (
          <>
            <Link href="/checkout" passHref>
              <Button color="primary" className="w-full">
                Try Again
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button variant="bordered" className="w-full">
                Need Help?
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}