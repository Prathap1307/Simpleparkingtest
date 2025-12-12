import { formatDate } from "./formatting";


export const formatTime = (timeString) => {
  // Handle null/undefined/empty cases first
  if (!timeString) return "N/A";
  
  try {
    // Convert to string in case it's a Date object or number
    const timeStr = String(timeString);
    
    let date;
    if (typeof timeStr === 'string' && timeStr.includes('T')) {
      date = new Date(timeStr);
    } else if (typeof timeStr === 'string') {
      // Handle standalone time strings (HH:MM:SS)
      const [hours, minutes] = timeStr.split(':');
      date = new Date();
      date.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0);
    } else {
      // Fallback for other types (like Date objects)
      date = new Date(timeStr);
    }
    
    if (isNaN(date.getTime())) return "N/A";
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes} ${ampm}`;
  } catch (error) {
    return "N/A";
  }
};

export function isDateBetween(dateToCheck, startDateStr, endDateStr) {
  // Convert all dates to Date objects first (handles both strings and Date objects)
  const date = new Date(dateToCheck);
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  // Compare timestamps to avoid timezone issues
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

export function apply_offer(airport, couponsData) {
  const now = new Date();

  const validOffer = couponsData.find(item => {
    if (item.type !== 'offer') return false;
    if (item.Location !== airport) return false;

    return isDateBetween(now, item.fromDate, item.toDate);
  });

  return validOffer ? {
    discountType: validOffer.discountType,
    value: validOffer.value
  } : false;
}

export function apply_coupon(airport, couponCode, couponsData) {
  const now = new Date();
  
  const validCoupon = couponsData.find(item => {
    if (item.type !== 'coupon') return false;
    if (item.Location !== airport) return false;
    if (item.couponCode?.toLowerCase() !== couponCode?.toLowerCase()) return false;
    const check = isDateBetween(now, item.fromDate, item.toDate);
    return check
  });

  return validCoupon ? {
    couponCode: validCoupon.couponCode,
    discountType: validCoupon.discountType,
    value: validCoupon.value
  } : false;
}

