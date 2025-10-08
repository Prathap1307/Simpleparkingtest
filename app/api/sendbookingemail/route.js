import axios from 'axios';
// NOTE: Removed the unused imports (formatDate, formatTime) from '@/utils/formatting'
// as the time zone-aware logic is now handled internally.

// --- Time Zone Configuration ---
// Assuming current scope is only UK airports.
const TARGET_TIME_ZONE = 'Europe/London'; 

// --- Time Zone Formatting Function ---
const formatLocalTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return { date: 'N/A', time: 'N/A' };
    
    // 1. Create a Date object by combining date and time strings.
    // We append a time to ensure correct object creation.
    const dateTimeObject = new Date(`${dateStr}T${timeStr}:00`);

    if (isNaN(dateTimeObject.getTime())) {
        console.error("Invalid date or time passed to formatter:", { dateStr, timeStr });
        return { date: 'N/A', time: 'N/A' };
    }

    const locale = 'en-GB';
    
    // Options to display time correctly for the user (reversing UTC shift)
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TARGET_TIME_ZONE };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: TARGET_TIME_ZONE };

    return {
        date: dateTimeObject.toLocaleDateString(locale, dateOptions),
        time: dateTimeObject.toLocaleTimeString(locale, timeOptions),
    };
};

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
        // console.log("Received booking details:", bookingDetails); // Removed verbose logging

        // Validate booking details structure
        validateBookingDetails(bookingDetails);

        // --- TIME ZONE CORRECTED FORMATTING ---
        const departure = formatLocalTime(bookingDetails.fromDate, bookingDetails.fromTime || '00:00');
        const arrival = formatLocalTime(bookingDetails.toDate, bookingDetails.toTime || '00:00');
        
        // Note: For the 'Date of Booking' which is likely a fixed day, 
        // we format it simply without a time component.
        const bookingDateObj = new Date(bookingDetails.bookingDate);
        const bookingDateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TARGET_TIME_ZONE };
        const bookingDateFormatted = bookingDateObj.toLocaleDateString('en-GB', bookingDateOptions);
        
        const formattedData = {
            bookingDate: bookingDateFormatted,
            fromDate: departure.date,
            toDate: arrival.date,
            fromTime: departure.time, 
            toTime: arrival.time,
        };

        // Prepare email parameters with fallbacks for optional fields
        const emailParams = {
            customerName: bookingDetails.customerName,
            orderId: bookingDetails.orderId,
            ...formattedData, // <-- Uses time zone corrected data
            airport: bookingDetails.airport,
            carNumber: bookingDetails.carNumber,
            parkingSlot: bookingDetails.parkingSlot,
            paidAmount: bookingDetails.paidAmount,
            paymentMethod: bookingDetails.paymentMethod || 'Not specified',
            Departure_Terminal: bookingDetails.departureTerminal || 'Not specified',
            Departure_Flight: bookingDetails.departureFlightNumber || 'Not specified',
            Arrival_Terminal: bookingDetails.returnTerminal || 'Not specified',
            Arrival_Flight: bookingDetails.returnFlightNumber || 'Not specified',
            couponApplied: bookingDetails.couponApplied,
            offerApplied: bookingDetails.offerApplied,
            couponDetails: bookingDetails.couponDetails,
            offerDetails: bookingDetails.offerDetails,
            originalPrice: bookingDetails.originalPrice,
            totalSavings: bookingDetails.totalSavings,
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
            templateId: Number(process.env.EMAILTEMP),
            params: emailParams,
            headers: {
                'X-Mailin-custom': 'booking-confirmation'
            }
        };

        // console.log("Sending to Brevo API:", JSON.stringify(emailPayload, null, 2)); // Removed verbose logging

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

        // console.log("Brevo API response:", response.data); // Removed verbose logging

        return new Response(JSON.stringify({ 
            success: true,
            messageId: response.data.messageId 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        // console.error("Full error details:", { // Removed verbose logging
        //     message: error.message,
        //     stack: error.stack,
        //     response: error.response?.data
        // });

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