import axios from 'axios';
// NOTE: Removed the unused imports (formatDate, formatTime) from '@/utils/formatting'
// as the time zone-aware logic is now handled internally.

// --- Time Zone Configuration for Booking Date Only ---
const TARGET_TIME_ZONE = 'Europe/London'; 

// Function to format the single 'bookingDate' field (less prone to error)
const formatBookingDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    
    // Create Date object for the single date field
    const dateObj = new Date(dateStr);

    if (isNaN(dateObj.getTime())) {
        console.error("Invalid booking date passed:", dateStr);
        return 'N/A';
    }

    const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TARGET_TIME_ZONE };
    return dateObj.toLocaleDateString('en-GB', options);
};


// Validate required environment variables at startup (omitted for brevity)
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

// Validate booking details structure (omitted for brevity)
const validateBookingDetails = (details) => {
    const requiredFields = [
        'customerName', 'customerEmail', 'orderId', 'bookingDate', 'fromDate',
        'toDate', 'airport', 'carNumber', 'parkingSlot', 'paidAmount'
    ];

    const missingFields = requiredFields.filter(field => !details[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
};

// --- CORE FIX: Using original strings for Date/Time fields ---
export async function POST(request) {
    try {
        validateEnv();
        const bookingDetails = await request.json();
        validateBookingDetails(bookingDetails);

        // --- TIME ZONE SAFE STRING PASS-THROUGH ---
        
        // 1. Format the less critical booking date
        const bookingDateFormatted = formatBookingDate(bookingDetails.bookingDate);

        // 2. Safely use the original, client-provided date and time strings.
        // We ensure a fallback to prevent 'N/A' if the fields were missing, 
        // while avoiding date object manipulation.
        const formattedData = {
            bookingDate: bookingDateFormatted,
            // FIX: Pass the raw strings which were correct in your initial successful test payload
            fromDate: bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            // FIX: Convert raw time string (HH:MM) to 12-hour format manually and safely
            fromTime: convert24to12Hour(bookingDetails.fromTime || '00:00'),
            toTime: convert24to12Hour(bookingDetails.toTime || '00:00'),
        };

        // Prepare email parameters (omitted for brevity)
        const emailParams = {
            customerName: bookingDetails.customerName,
            orderId: bookingDetails.orderId,
            ...formattedData, // <-- Uses safe, un-shifted strings
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
            sender: { email: process.env.SENDERMAIL, name: 'Simple Parking' },
            to: [{ email: bookingDetails.customerEmail, name: bookingDetails.customerName }, { email: 'kprathap1307@gmail.com', name: 'Prathap' }],
            templateId: Number(process.env.EMAILTEMP),
            params: emailParams,
            headers: { 'X-Mailin-custom': 'booking-confirmation' }
        };

        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email', emailPayload,
            { headers: { 'api-key': process.env.EMAILAPI, 'Content-Type': 'application/json', 'Accept': 'application/json' }, timeout: 5000 }
        );

        return new Response(JSON.stringify({ success: true, messageId: response.data.messageId }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || error.message;

        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to send booking confirmation',
            details: errorMessage,
            ...(error.response?.data && { apiResponse: error.response.data })
        }), { status: statusCode, headers: { 'Content-Type': 'application/json' } });
    }
}


// --- Helper Function for Time Conversion (Needed since we bypass external formatting) ---
function convert24to12Hour(time24) {
    if (!time24 || typeof time24 !== 'string') return 'N/A';
    
    // Handle HH:MM:SS or HH:MM
    const parts = time24.split(':');
    if (parts.length < 2) return time24;
    
    let [hours, minutes] = parts.map(p => parseInt(p));
    
    if (isNaN(hours) || isNaN(minutes)) return time24;

    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = ((hours % 12) || 12); // Convert '0' and '12' to '12'
    minutes = String(minutes).padStart(2, '0');

    return `${hours}:${minutes} ${suffix}`;
}