// FIXED VERSION - Use consistent date parsing
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    // Handle both "YYYY-MM-DD" and full ISO strings
    let date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      // For date-only strings like "2025-10-25"
      const [year, month, day] = dateString.split('-');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    if (isNaN(date.getTime())) return 'N/A';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'N/A';
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  try {
    // Handle time strings like "06:15", "23:15", or full ISO dates
    let date;
    if (timeString.includes('T')) {
      date = new Date(timeString);
    } else {
      // For time-only strings like "06:15"
      const [hours, minutes] = timeString.split(':');
      date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes || 0), 0, 0);
    }
    
    if (isNaN(date.getTime())) return 'N/A';
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes} ${ampm}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return 'N/A';
  }
};