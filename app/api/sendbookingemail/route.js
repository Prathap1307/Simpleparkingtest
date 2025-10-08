import axios from 'axios';

// --- Time Zone Configuration ---
const TARGET_TIME_ZONE = 'Europe/London'; 

// --- Helper Functions ---

// 1. Cleans the date string to ensure only YYYY-MM-DD is passed to the email template.
function cleanDateString(dateValue) {
    if (!dateValue || typeof dateValue !== 'string') return 'N/A';
    
    // Check if it's an ISO string (contains 'T') or just a date string.
    const isoIndex = dateValue.indexOf('T');
    
    if (isoIndex > -1) {
        // If it's an ISO string, strip off the time component and return only the date part.
        return dateValue.substring(0, isoIndex);
    }
    
    // Otherwise, return the string as is (e.g., "2025-10-23")
    return dateValue;
}

// 2. Formats the single 'bookingDate' field (less critical)
const formatBookingDate = (dateStr) => {
    // We pass a cleaned date string to the Date constructor to avoid local time shifts
    const cleanedDate = cleanDateString(dateStr); 
    if (cleanedDate === 'N/A') return 'N/A';
    
    const dateObj = new Date(cleanedDate);

    if (isNaN(dateObj.getTime())) {
        return cleanedDate; // Fallback to the cleaned string if formatting fails
    }

    const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TARGET_TIME_ZONE };
    return dateObj.toLocaleDateString('en-GB', options);
};

// 3. Helper Function for Time Conversion (Converts HH:MM to 12-hour format)
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
        console.log("1",bookingDetails )

        // --- TIME ZONE SAFE STRING PASS-THROUGH ---
        
        // 1. Format the less critical booking date
        const bookingDateFormatted = formatBookingDate(bookingDetails.bookingDate);

        // 2. Extract and clean date strings, and format time strings.
        const formattedData = {
            bookingDate: bookingDateFormatted,
            // FIX: Use cleanDateString() to strip any ISO time component passed from the client
            fromDate: cleanDateString(bookingDetails.fromDate),
            toDate: cleanDateString(bookingDetails.toDate),
            
            // FIX: Convert raw time string (HH:MM) to 12-hour format manually
            fromTime: convert24to12Hour(bookingDetails.fromTime || '00:00'),
            toTime: convert24to12Hour(bookingDetails.toTime || '00:00'),
        };

        // Prepare email parameters (omitted for brevity)
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
            couponApplied: bookingDetails.couponApplied,
            offerApplied: bookingDetails.offerApplied,
            couponDetails: bookingDetails.couponDetails,
            offerDetails: bookingDetails.offerDetails,
            originalPrice: bookingDetails.originalPrice,
            totalSavings: bookingDetails.totalSavings,
        };

        console.log('ep',emailParams)

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