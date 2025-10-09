import axios from 'axios';



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

        const emailPayload = {
            sender: { email: process.env.SENDERMAIL, name: 'Simple Parking' },
            to: [{ email: bookingDetails.customerEmail, name: bookingDetails.customerName }, { email: 'kprathap1307@gmail.com', name: 'Prathap' }],
            templateId: Number(process.env.EMAILTEMP),
            params: bookingDetails,
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