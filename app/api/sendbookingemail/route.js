

import axios from 'axios';
import { formatDate, formatTime } from '@/utils/formatting';

// Validate required environment variables at startup
const validateEnv = () => {
  const requiredEnv = {
    EMAILAPI: process.env.EMAILAPI,
    EMAILTEMP: process.env.EMAILTEMP,
    SENDERMAIL: process.env.SENDERMAIL
  };

  for (const [key, value] of Object.entries(requiredEnv)) {
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
  }
};

// Validate booking details structure
const validateBookingDetails = (details) => {
  const requiredFields = [
    'customerName',
    'customerEmail',
    'orderId',
    'bookingDate',
    'fromDate',
    'toDate',
    'airport',
    'carNumber',
    'parkingSlot',
    'paidAmount'
  ];

  const missingFields = requiredFields.filter(field => !details[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

export async function POST(request) {
  try {
    // Validate environment variables first
    validateEnv();

    const bookingDetails = await request.json();
    console.log("Received booking details:", bookingDetails);

    // Validate booking details structure
    validateBookingDetails(bookingDetails);

    // Format dates and times
    const formattedData = {
      bookingDate: formatDate(bookingDetails.bookingDate),
      fromDate: formatDate(bookingDetails.fromDate),
      toDate: formatDate(bookingDetails.toDate),
      fromTime: formatTime(bookingDetails.fromTime || '00:00'), // Default value if missing
      toTime: formatTime(bookingDetails.toTime || '00:00')      // Default value if missing
    };

    // Prepare email parameters with fallbacks for optional fields
    const emailParams = {
      customerName: bookingDetails.customerName,
      orderId: bookingDetails.orderId,
      ...formattedData,
      airport: bookingDetails.airport,
      carNumber: bookingDetails.carNumber,
      parkingSlot: bookingDetails.parkingSlot,
      paidAmount: bookingDetails.paidAmount,
      paymentMethod: bookingDetails.paymentMethod || 'Not specified',
      Departure_Terminal: bookingDetails.departureTerminal || 'Not specified',
      Departure_Flight: bookingDetails.departureFlightNumber || 'Not specified',
      Arrival_Terminal: bookingDetails.returnTerminal || 'Not specified',
      Arrival_Flight: bookingDetails.returnFlightNumber || 'Not specified',
      couponApplied:bookingDetails.couponApplied,
      offerApplied:bookingDetails.offerApplied,
      couponDetails:bookingDetails.couponDetails,
      offerDetails:bookingDetails.offerDetails,
      originalPrice:bookingDetails.originalPrice,
      totalSavings:bookingDetails.totalSavings,
    };

    const emailPayload = {
      sender: {
        email: process.env.SENDERMAIL,
        name: 'Simple Parking'
      },
      to: [{
        email: bookingDetails.customerEmail,
        name: bookingDetails.customerName
      },
      {
        email: 'kprathap1307@gmail.com',
        name: 'Prathap'
      }
    ],
      templateId: Number(process.env.EMAILTEMP), // Ensure template ID is a number
      params: emailParams,
      headers: {
        'X-Mailin-custom': 'booking-confirmation'
      }
    };

    console.log("Sending to Brevo API:", JSON.stringify(emailPayload, null, 2));

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailPayload,
      {
        headers: {
          'api-key': process.env.EMAILAPI,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 5000 // 5-second timeout
      }
    );

    console.log("Brevo API response:", response.data);

    return new Response(JSON.stringify({ 
      success: true,
      messageId: response.data.messageId 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to send booking confirmation',
      details: errorMessage,
      ...(error.response?.data && { apiResponse: error.response.data })
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}