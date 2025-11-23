"use client";
import React, { useState, useEffect } from 'react';
import DynamicTable from '../Tablecmp';
import Dynamicmodal from '../Modalcmp';
import CustomDangerAlert from '../Dangeralert';
import { CircularProgress , Card, CardHeader, CardBody, CardFooter , Input , Select , SelectItem , Button } from "@heroui/react";
import { useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pagination } from "@heroui/react";
import * as XLSX from 'xlsx'; // Import Excel library
import { processCustomerData } from '@/utils/customerUtils';

export default function Allbookings() {
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

    // New states for UI elements
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("OrderId");
  const [dateFilterOption, setDateFilterOption] = useState("all");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");


  // Card data states
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPickups, setTotalPickups] = useState(0);
  const [totalDrops, setTotalDrops] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [instructions,setinstructions] = useState("")
  const [location, setLocation] = useState("");
  const [airport, setAirport] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [Status,setStatus] = useState()
  const [filtersActive, setFiltersActive] = useState(false);

  //travel
  const [terminals, setTerminals] = useState([]);
  const [loadingTerminals, setLoadingTerminals] = useState(false);
  const [departureTerminal, setDepartureTerminal] = useState("");
  const [departureFlightNumber, setDepartureFlightNumber] = useState("");
  const [returnTerminal, setReturnTerminal] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");

  //offer/coupon
  const [hasDiscount, setHasDiscount] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [offerApplied, setOfferApplied] = useState(false);
  const [couponDetails, setCouponDetails] = useState("");
  const [offerDetails, setOfferDetails] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [totalSavings, setTotalSavings] = useState("");


  // Date formatting helpers
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const formatTime = (timeString) => {
      if (!timeString) return "";
      if (timeString.includes("T")) {
        const time = new Date(timeString);
        return time.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      return timeString.substring(0, 5);
    };

    // Helper to get today's date in YYYY-MM-DD format
      const getTodayDate = () => new Date().toISOString().split('T')[0];

      // Format date for display
      const formatDisplayDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      };

      // Format datetime for display
      const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

const filteredData = useMemo(() => {
  let result = [...bookingData];
  
  // Apply search filter
  if (searchTerm) {
    result = result.filter(booking => {
      const fieldValue = booking[searchOption]?.toString().toLowerCase() || '';
      return fieldValue.includes(searchTerm.toLowerCase());
    });
  }

  // Only proceed with date filtering if we have valid parameters
  const shouldFilterDates = dateFilterOption || filterFromDate || filterToDate;
  
  if (shouldFilterDates) {
    // Function to normalize dates to YYYY-MM-DD format for comparison
    const normalizeDate = (dateStr) => {
      if (!dateStr) return null;
      
      try {
        // Handle both "2025-07-01" and "2025-07-01T23:00:00.000Z" formats
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return null;
        
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Error normalizing date:', dateStr, error);
        return null;
      }
    };

    // Normalize filter dates (use null if not provided)
    const fromDateNorm = filterFromDate ? normalizeDate(filterFromDate) : null;
    const toDateNorm = filterToDate ? normalizeDate(filterToDate) : null;

    // Map the numeric option to meaningful string
    const getFilterOption = () => {
      switch(dateFilterOption) {
        case "$.0": return "booking";
        case "$.1": return "pickup";
        case "$.2": return "drop";
        case "$.3": return "pickup_drop";
        case "$.4": return "all";
        default: return dateFilterOption; // fallback
      }
    };

    const effectiveFilterOption = getFilterOption();

    result = result.filter(booking => {
      // Normalize all relevant dates from the booking
      const bookingDateNorm = normalizeDate(booking.bookingDate?.S || booking.bookingDate);
      const pickupDateNorm = normalizeDate(booking.FromDate?.S || booking.FromDate);
      const dropDateNorm = normalizeDate(booking.ToDate?.S || booking.ToDate);

      // Date comparison function
      const isDateInRange = (date) => {
        if (!date) return false;
        const afterFrom = !fromDateNorm || date >= fromDateNorm;
        const beforeTo = !toDateNorm || date <= toDateNorm;
        return afterFrom && beforeTo;
      };

      // Determine which dates to check based on filter option
      switch (effectiveFilterOption) {
        case 'booking':
          return isDateInRange(bookingDateNorm);
        case 'pickup':
          return isDateInRange(pickupDateNorm);
        case 'drop':
          return isDateInRange(dropDateNorm);
        case 'pickup_drop':
          return isDateInRange(pickupDateNorm) || isDateInRange(dropDateNorm);
        case 'all':
          return isDateInRange(bookingDateNorm) || 
                isDateInRange(pickupDateNorm) || 
                isDateInRange(dropDateNorm);
        default:
          // Default to no date filtering if option is invalid
          return true;
      }
    });
  }
  
  return result;
}, [
  bookingData, 
  searchTerm, 
  searchOption,
  dateFilterOption,
  filterFromDate,
  filterToDate
]);
  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // Calculate total pages safely
  const totalPages = useMemo(() => {
    if (filteredData.length === 0 || rowsPerPage === 0) return 1;
    return Math.ceil(filteredData.length / rowsPerPage);
  }, [filteredData, rowsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData, rowsPerPage]);
    
  // count calculate

  useEffect(() => {
    if (bookingData.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Total orders today
    const totalOrdersCount = bookingData.filter(
      booking => booking.bookingDate === today
    ).length;
    
    // Total pickups today
    const totalPickupsCount = bookingData.filter(booking => {
      const fromDate = booking.FromDate.split('T')[0];
      return fromDate === today;
    }).length;
    
    // Total drops today
    const totalDropsCount = bookingData.filter(booking => {
      const toDate = booking.ToDate.split('T')[0];
      return toDate === today;
    }).length;
    
    // Total sales (sum of all PaidAmount)
    const totalSalesAmount = bookingData.reduce(
      (sum, booking) => sum + parseFloat(booking.PaidAmount || 0),
      0
    );

    setTotalOrders(totalOrdersCount);
    setTotalPickups(totalPickupsCount);
    setTotalDrops(totalDropsCount);
    setTotalSales(totalSalesAmount);
  }, [bookingData]);

  //count calculates

  //Remove filter

  const handleRemoveFilters = () => {
    setSearchTerm("");
    setSearchOption("OrderId");
    setDateFilterOption("all");
    setFilterFromDate("");
    setFilterToDate("");
  };

  //Remove filter

  // report gennerate 

  const generateReportPDF = () => {
  const doc = new jsPDF();
  const reportData = filteredData.length > 0 ? filteredData : bookingData;
  const today = new Date().toLocaleDateString();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(40, 53, 147);
  doc.text('Simple Parking Report', 105, 15, null, null, 'center');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${today}`, 105, 22, null, null, 'center');
  
  // Add summary cards
  doc.setFontSize(14);
  doc.text('Summary', 14, 32);
  
  const cardData = [
    { title: 'Total Orders', value: totalOrders },
    { title: 'Total Pickups', value: totalPickups },
    { title: 'Total Drops', value: totalDrops },
    { title: 'Total Sales', value: `$${totalSales.toFixed(2)}` },
  ];
  
  cardData.forEach((card, index) => {
    const x = 14 + (index % 2) * 95;
    const y = 40 + Math.floor(index / 2) * 20;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y, 90, 15, 'F');
    doc.text(`${card.title}: ${card.value}`, x + 5, y + 10);
  });
  
  // Add bookings table
    doc.setFontSize(14);
    doc.text('Booking Details', 14, 80);
    
    const headers = [
      'Order ID',
      'Customer',
      'Phone',
      'Dates',
      'Location',
      'Amount',
      'Status'
    ];
    
    const rows = reportData.map(booking => [
      booking.OrderId,
      booking.ParkingName.substring(0, 20),
      booking.CustomerPhone,
      `${formatDate(booking.FromDate)} to ${formatDate(booking.ToDate)}`,
      `${booking.Location} (${booking.Airport})`.substring(0, 25),
      `$${booking.PaidAmount}`,
      booking.Status
    ]);

    autoTable(doc, {
      startY: 85,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1.5 },
      headStyles: { fillColor: [40, 53, 147] }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        'center'
      );
    }
    
    doc.save(`parking-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // report generate 

  // remove filter 

  <div className="flex justify-end mt-4">
  <Button 
    color="default"
    variant="bordered"
    onClick={handleRemoveFilters}
  >
    Remove All Filters
  </Button>
</div>

// remove filter 

    const searchOptions = [
    { value: "OrderId", label: "Order ID" },
    { value: "ParkingName", label: "Name" },
    { value: "ParkingSlot", label: "Parking Space" },
    { value: "CustomerEmail", label: "Customer Email" },
    { value: "CustomerPhone", label: "Phone Number" },
    { value: "FromDate", label: "Pickup Date" },
    { value: "ToDate", label: "Drop Date" },
    { value: "Airport", label: "Airport" },
  ];

  //ftech locations
  const [LocationsData,setLocationsData] = useState([])
  const [ ParkingslotData, setParkingslotData] = useState([])

  const columns = [
    { name: "Order ID", uid: "OrderId" },
    { name: "Name", uid: "ParkingName" },
    { name: "Parking Space", uid: "Location" },
    { name: "Customer Email", uid: "CustomerEmail" },
    { name: "Phone Number", uid: "CustomerPhone" },
    { name: "From Date", uid: "FromDate" },
    { name: "From Time", uid: "FromTime" },
    { name: "To Date", uid: "ToDate" },
    { name: "To Time", uid: "ToTime" },
    { name: "Airport", uid: "Airport" },
    { name: "Paid Price", uid: "PaidAmount" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = {
    confirmed: "success",
    cancelled: "danger",
    pending: "warning",
  };

  const exportToExcel = (data, fileName) => {
    // Sort data by FromDate (pickup date) - oldest first
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.FromDate?.S || a.FromDate);
      const dateB = new Date(b.FromDate?.S || b.FromDate);
      return dateA - dateB;
    });

    // Format data for Excel with all dates in DD/MM/YYYY format
    const excelData = sortedData.map(booking => ({
      'Order ID': booking.OrderId || 'N/A',
      'Customer Name': booking.ParkingName || 'N/A',
      'Email': booking.CustomerEmail || 'N/A',
      'Phone': booking.CustomerPhone || 'N/A',
      'Booking Date': formatDateDDMMYYYY(booking.bookingDate?.S || booking.bookingDate),
      'From Date': formatDateDDMMYYYY(booking.FromDate?.S || booking.FromDate),
      'To Date': formatDateDDMMYYYY(booking.ToDate?.S || booking.ToDate),
      'Airport': booking.Airport || 'N/A',
      'Location': booking.Location || 'N/A',
      'Parking Slot': booking.ParkingSlot || 'N/A',
      'Car Number': booking.CarNumber || 'N/A',
      'instructions':booking.instructions,
      'Has Discount': booking.HasDiscount ? 'Yes' : 'No',
      'Coupon Applied': booking.CouponApplied ? 'Yes' : 'No',
      'Coupon Details': booking.CouponDetails || 'N/A',
      'Offer Applied': booking.OfferApplied ? 'Yes' : 'No',
      'Offer Details': booking.OfferDetails || 'N/A',
      'Original Price': `$${booking.OriginalPrice || booking.PaidAmount || '0.00'}`,
      'Total Savings': `$${booking.TotalSavings || '0.00'}`,
      'Paid Amount': `$${booking.PaidAmount || '0.00'}`,
      'Payment Method': booking.PaymentMethod || 'N/A',
      'Status': booking.Status || 'N/A',
      'Booking Time': booking.bookingTime || 'N/A',
      'Created At': formatDateTime(booking.createdAt) || 'N/A',
      'Updated At': formatDateTime(booking.updatedAt) || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    
    // Add summary data to a new sheet
    const summaryData = [
      ["Report Name", fileName],
      ["Total Records", data.length],
      ["Generated Date", new Date().toLocaleDateString('en-GB')],
      ["", ""],
      ["First Booking Date", formatDateDDMMYYYY(sortedData[0]?.FromDate?.S || sortedData[0]?.FromDate)],
      ["Last Booking Date", formatDateDDMMYYYY(sortedData[sortedData.length-1]?.ToDate?.S || sortedData[sortedData.length-1]?.ToDate)],
      ["", ""],
      ["Metric", "Value"],
      ["Total Orders", totalOrders],
      ["Total Pickups", totalPickups],
      ["Total Drops", totalDrops],
      ["Total Sales", `$${totalSales.toFixed(2)}`]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };


  const generateMainPDF = () => {
    const reportData = filteredData.length > 0 ? filteredData : bookingData;
    generatePDFReport(reportData, "Parking Report");
  };

  const generateMainExcel = () => {
    const reportData = filteredData.length > 0 ? filteredData : bookingData;
    exportToExcel(reportData, "Parking-Report");
  };

  const generatePDFReport = (reportData, reportTitle) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-GB');
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text(reportTitle, 105, 15, null, null, 'center');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${today}`, 105, 22, null, null, 'center');
    
    // Add summary
    doc.setFontSize(14);
    doc.text('Report Summary', 14, 32);
    
    const summaryData = [
      { label: 'Report Title', value: reportTitle },
      { label: 'Total Records', value: reportData.length },
      { label: 'Generated Date', value: today },
      { label: 'Total Discounts Applied', value: reportData.filter(b => b.HasDiscount).length }
    ];
    
    summaryData.forEach((item, index) => {
      const y = 40 + index * 10;
      doc.text(`${item.label}: ${item.value}`, 14, y);
    });

    // Calculate discount statistics
    const totalDiscountAmount = reportData.reduce((sum, booking) => {
      return sum + parseFloat(booking.TotalSavings || 0);
    }, 0);
    
    const totalOriginalAmount = reportData.reduce((sum, booking) => {
      return sum + parseFloat(booking.OriginalPrice || booking.PaidAmount || 0);
    }, 0);
    
    const totalFinalAmount = reportData.reduce((sum, booking) => {
      return sum + parseFloat(booking.PaidAmount || 0);
    }, 0);

    doc.text(`Total Original Amount: £${totalOriginalAmount.toFixed(2)}`, 14, 80);
    doc.text(`Total Discounts: £${totalDiscountAmount.toFixed(2)}`, 14, 90);
    doc.text(`Total Final Amount: £${totalFinalAmount.toFixed(2)}`, 14, 100);
    
    // Sort data by FromDate (pickup date) - oldest first
    const sortedData = [...reportData].sort((a, b) => {
      const dateA = new Date(a.FromDate?.S || a.FromDate);
      const dateB = new Date(b.FromDate?.S || b.FromDate);
      return dateA - dateB;
    });

    // Add bookings table with ALL fields
    doc.setFontSize(14);
    doc.text('Booking Details', 14, 120);
    
    const headers = [
      'Order ID',
      'Customer',
      'From Date',
      'To Date',
      'Location',
      'Original Price',
      'Discounts',
      'Final Price',
      'Status'
    ];
    
    const rows = sortedData.map(booking => {
      // Format discount information
      let discountInfo = '';
      if (booking.HasDiscount) {
        if (booking.CouponApplied && booking.CouponDetails) {
          discountInfo += `Coupon: ${booking.CouponDetails}\n`;
        }
        if (booking.OfferApplied && booking.OfferDetails) {
          discountInfo += `Offer: ${booking.OfferDetails}\n`;
        }
        discountInfo += `Saved: £${parseFloat(booking.TotalSavings || 0).toFixed(2)}`;
      } else {
        discountInfo = 'None';
      }

      return [
        booking.OrderId || 'N/A',
        booking.ParkingName?.substring(0, 15) || 'N/A',
        formatDateDDMMYYYY(booking.FromDate?.S || booking.FromDate),
        formatDateDDMMYYYY(booking.ToDate?.S || booking.ToDate),
        `${booking.Location || 'N/A'} (${booking.Airport || 'N/A'})`.substring(0, 15),
        `£${booking.OriginalPrice || booking.PaidAmount || '0.00'}`,
        discountInfo,
        `£${booking.PaidAmount || '0.00'}`,
        booking.Status || 'N/A'
      ];
    });

    autoTable(doc, {
      startY: 125,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: { 
        fontSize: 8, 
        cellPadding: 2,
        valign: 'middle',
        minCellHeight: 10
      },
      headStyles: { 
        fillColor: [40, 53, 147],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' },
        7: { cellWidth: 'auto' },
        8: { cellWidth: 'auto' }
      },
      margin: { top: 125 },
      tableWidth: 'wrap',
      didDrawCell: (data) => {
        // Handle multi-line discount info
        if (data.column.index === 6 && data.cell.raw.includes('\n')) {
          const lines = data.cell.raw.split('\n');
          doc.setFontSize(7);
          doc.setTextColor(0, 0, 0);
          
          let y = data.cell.y + 4;
          lines.forEach(line => {
            doc.text(line, data.cell.x + 2, y);
            y += 4;
          });
          
          doc.setFontSize(8); // Reset font size
        }
      }
    });
    
    // Add discount summary section
    const discountStatsY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Discount Summary', 14, discountStatsY);
    
    // Calculate coupon/offer statistics
    const couponStats = reportData.reduce((stats, booking) => {
      if (booking.CouponApplied) {
        stats.count++;
        const couponValue = parseFloat(booking.CouponDetails?.match(/£(\d+\.\d{2})/)?.[1] || 0);
        stats.totalValue += couponValue;
      }
      return stats;
    }, { count: 0, totalValue: 0 });
    
    const offerStats = reportData.reduce((stats, booking) => {
      if (booking.OfferApplied) {
        stats.count++;
        const offerValue = parseFloat(booking.OfferDetails?.match(/£(\d+\.\d{2})/)?.[1] || 0);
        stats.totalValue += offerValue;
      }
      return stats;
    }, { count: 0, totalValue: 0 });

    doc.setFontSize(10);
    doc.text(`Coupons Applied: ${couponStats.count} (Total: £${couponStats.totalValue.toFixed(2)})`, 20, discountStatsY + 10);
    doc.text(`Offers Applied: ${offerStats.count} (Total: £${offerStats.totalValue.toFixed(2)})`, 20, discountStatsY + 20);
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        'center'
      );
    }
    
    doc.save(`${reportTitle.toLowerCase().replace(/\s+/g, '-')}-${today.replace(/\//g, '-')}.pdf`);
  };



  // Card-specific report functions
  const generateTodayOrdersPDF = () => {
    const today = getTodayDate();
    const reportData = bookingData.filter(booking => booking.bookingDate === today);
    generatePDFReport(reportData, "Today's Orders Report");
  };

  const generateTodayOrdersExcel = () => {
    const today = getTodayDate();
    const reportData = bookingData.filter(booking => booking.bookingDate === today);
    exportToExcel(reportData, "Today's-Orders");
  };
  const generateTodayPickupsPDF = () => {
    const today = getTodayDate();
    const reportData = bookingData.filter(booking => {
      const fromDate = booking.FromDate?.split('T')[0];
      return fromDate === today;
    });
    generatePDFReport(reportData, "Today's Pickups Report");
  };

  const generateTodayPickupsExcel = () => {
    const today = getTodayDate();
    const reportData = bookingData.filter(booking => {
      const fromDate = booking.FromDate?.split('T')[0];
      return fromDate === today;
    });
    exportToExcel(reportData, "Today's-Pickups");
  };

  const generateTodayDropsPDF = () => {
    const today = getTodayDate();
    const reportData = bookingData.filter(booking => {
      const toDate = booking.ToDate?.split('T')[0];
      return toDate === today;
    });
    generatePDFReport(reportData, "Today's Drops Report");
  };

  const generateTodayDropsExcel = () => {
    const today = getTodayDate();
    const reportData = bookingData.filter(booking => {
      const toDate = booking.ToDate?.split('T')[0];
      return toDate === today;
    });
    exportToExcel(reportData, "Today's-Drops");
  };

  const generateTotalSalesPDF = () => {
    generatePDFReport(bookingData, "Total Sales Report");
  };

  const generateTotalSalesExcel = () => {
    exportToExcel(bookingData, "Total-Sales-Report");
  };

  const generateOrderId = async () => {
    const res = await fetch("/api/Todaysbooking");
    const existingBookings = await res.json();

    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentYear = String(now.getFullYear()).slice(-2);

    const currentMonthOrders = existingBookings.filter(booking => {
      if (!booking.OrderId) return false;
      return booking.OrderId.includes(`simpleparking${currentMonth}${currentYear}`);
    });

    let nextOrderNum = 1;
    if (currentMonthOrders.length > 0) {
      const lastOrder = currentMonthOrders[currentMonthOrders.length - 1];
      const lastOrderNum = parseInt(lastOrder.OrderId.split('-')[1]);
      nextOrderNum = lastOrderNum + 1;
    }

    return `simpleparking${currentMonth}${currentYear}-${String(nextOrderNum).padStart(2, '0')}`;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/Todaysbooking");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();

      setBookingData(data);
    } catch (err) {
      console.error("Error fetching booking data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setFromDate("");
    setFromTime("");
    setToDate("");
    setToTime("");
    setPaidAmount("");
    setPaymentMethod("");
    setCarNumber("");
    setinstructions("")
    setLocation("");
    setAirport("");
    setParkingSlot("");
    setBookingStatus("");
    setIsEdit(false);
    setIsModalOpen(false);
    setDepartureTerminal("");
    setDepartureFlightNumber("");
    setReturnTerminal("");
    setReturnFlightNumber("");
    setHasDiscount(false);
    setCouponApplied(false);
    setOfferApplied(false);
    setCouponDetails("");
    setOfferDetails("");
    setOriginalPrice("");
    setTotalSavings("");
  };

    // Add fetchTerminals function
  const fetchTerminals = async (airportName) => {
    try {
      setLoadingTerminals(true);
      const response = await fetch(`/api/airports?name=${encodeURIComponent(airportName)}`);
      if (!response.ok) throw new Error('Failed to fetch airport data');
      
      const data = await response.json();
      let terminalOptions = [];
      
      if (data && data.Terminals) {
        if (!isNaN(data.Terminals)) {
          const terminalCount = parseInt(data.Terminals);
          terminalOptions = Array.from({ length: terminalCount }, (_, i) => ({
            value: `Terminal ${i + 1}`,
            label: `Terminal ${i + 1}`
          }));
        } else if (Array.isArray(data.Terminals)) {
          terminalOptions = data.Terminals.map(terminal => ({
            value: terminal.value || terminal.name || `Terminal ${terminal.id}`,
            label: terminal.label || terminal.name || `Terminal ${terminal.id}`
          }));
        }
      }
      
      if (terminalOptions.length === 0) {
        terminalOptions = Array.from({ length: 5 }, (_, i) => ({
          value: `Terminal ${i + 1}`,
          label: `Terminal ${i + 1}`
        }));
      }
      
      setTerminals(terminalOptions);
    } catch (error) {
      console.error('Error fetching terminals:', error);
      setTerminals(Array.from({ length: 5 }, (_, i) => ({
        value: `Terminal ${i + 1}`,
        label: `Terminal ${i + 1}`
      })));
    } finally {
      setLoadingTerminals(false);
    }
  };

  // Add effect to fetch terminals when airport changes
  useEffect(() => {
    if (airport) {
      fetchTerminals(airport);
    }
  }, [airport]);

  const handleEdit = (item) => {
    setCurrentRecord(item);
    setIsEdit(true);
    setIsModalOpen(true);
    setCustomerName(item.ParkingName.replace(/\(.*\)/, '').trim()); // Remove (edited by admin) if present
    setCustomerEmail(item.CustomerEmail || "");
    setCustomerPhone(item.CustomerPhone || "");
    setFromDate(item.FromDate || "");
    setFromTime(item.FromTime || "");
    setToDate(item.ToDate || "");
    setToTime(item.ToTime || "");
    setPaidAmount(item.PaidAmount || "");
    setPaymentMethod(item.PaymentMethod || "");
    setCarNumber(item.CarNumber || "");
    setinstructions(item.instructions)
    setLocation(item.Location || "");
    setAirport(item.Airport || "");
    setParkingSlot(item.ParkingSlot || "");
    setBookingStatus(item.Status || "");
    setDepartureTerminal(item.DepartureTerminal || "");
    setDepartureFlightNumber(item.DepartureFlightNumber || "");
    setReturnTerminal(item.ReturnTerminal || "");
    setReturnFlightNumber(item.ReturnFlightNumber || "");
      // Add these lines to handle coupon/offer data
    setHasDiscount(item.HasDiscount || false);
    setCouponApplied(item.CouponApplied || false);
    setOfferApplied(item.OfferApplied || false);
    setCouponDetails(item.CouponDetails || "");
    setOfferDetails(item.OfferDetails || "");
    setOriginalPrice(item.OriginalPrice || item.PaidAmount);
    setTotalSavings(item.TotalSavings || "0.00");
  };

  const handleDelete = (item) => {
    setRecordToDelete(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch("/api/Todaysbooking", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordToDelete.id }),
      });
      await fetchData();
    } catch (err) {
      console.error("Error deleting record:", err);
    } finally {
      setShowConfirm(false);
      setRecordToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setRecordToDelete(null);
  };

  const inputs = [
    { label: "Customer Name", value: customerName, onChange: (e) => setCustomerName(e.target.value), type: "text" },
    { label: "Customer Email", value: customerEmail, onChange: (e) => setCustomerEmail(e.target.value), type: "email" },
    { label: "Phone Number", value: customerPhone, onChange: (e) => setCustomerPhone(e.target.value), type: "text" },
    { label: "From Date", value: fromDate, onChange: (e) => setFromDate(e.target.value), type: "date" },
    { label: "From Time", value: fromTime, onChange: (e) => setFromTime(e.target.value), type: "time" },
    { label: "To Date", value: toDate, onChange: (e) => setToDate(e.target.value), type: "date" },
    { label: "To Time", value: toTime, onChange: (e) => setToTime(e.target.value), type: "time" },
    { label: "Paid Price", value: paidAmount, onChange: (e) => setPaidAmount(e.target.value), type: "number" },
    { label: "Paid Via", value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), type: "text" },
    { label: "Car Number", value: carNumber, onChange: (e) => setCarNumber(e.target.value), type: "text" },
    { label: "Customer instruction", value: instructions, onChange: (e) => setinstructions(e.target.value), type: "text" },
    {
      label: "Airport",
      value: airport,
      onChange: setAirport,
      type: "autocomplete",
      options: LocationsData.map(loc => ({
        label: loc.Airport_name,
        value: loc.Airport_name
      }))
    },
    {
      label: "Parking Space",
      value: parkingSlot,
      onChange: setParkingSlot,
      type: "autocomplete",
      options: ParkingslotData.map(loc => ({
        label: loc.ParkingName,
        value: loc.ParkingName
      }))
    },
    {
      label: "Status", value: Status, onChange: setStatus, type: "autocomplete",
      options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]
    },  
  // travel details section
  {
    type: "section",
    label: "Travel Details"
  },
  {
    type: "row",
    inputs: [
      {
        label: "Departure Terminal",
        value: departureTerminal,
        onChange: (e) => setDepartureTerminal(e.target.value),
        type: "select",
        options: terminals,
        disabled: loadingTerminals
      },
      {
        label: "Departure Flight Number",
        value: departureFlightNumber,
        onChange: (e) => setDepartureFlightNumber(e.target.value),
        type: "text",
        placeholder: "e.g. BA123"
      }
    ]
  },
  {
    type: "row",
    inputs: [
      {
        label: "Return Terminal",
        value: returnTerminal,
        onChange: (e) => setReturnTerminal(e.target.value),
        type: "select",
        options: terminals,
        disabled: loadingTerminals
      },
      {
        label: "Return Flight Number",
        value: returnFlightNumber,
        onChange: (e) => setReturnFlightNumber(e.target.value),
        type: "text",
        placeholder: "e.g. BA124"
      },
      {
        type: "section",
        label: "Discount Information"
      },
      {
        label: "Has Discount",
        value: hasDiscount,
        onChange: setHasDiscount,
        type: "checkbox"
      },
      {
        label: "Coupon Applied",
        value: couponApplied,
        onChange: setCouponApplied,
        type: "checkbox",
        disabled: !hasDiscount
      },
      {
        label: "Coupon Details",
        value: couponDetails,
        onChange: (e) => setCouponDetails(e.target.value),
        type: "text",
        disabled: !couponApplied
      },
      {
        label: "Offer Applied",
        value: offerApplied,
        onChange: setOfferApplied,
        type: "checkbox",
        disabled: !hasDiscount
      },
      {
        label: "Offer Details",
        value: offerDetails,
        onChange: (e) => setOfferDetails(e.target.value),
        type: "text",
        disabled: !offerApplied
      },
      {
        label: "Original Price",
        value: originalPrice,
        onChange: (e) => setOriginalPrice(e.target.value),
        type: "number",
        disabled: true
      },
      {
        label: "Total Savings",
        value: totalSavings,
        onChange: (e) => setTotalSavings(e.target.value),
        type: "number",
        disabled: true
      }
    ]
  }
];

//need to implement 
    const handleSearchApply = () => {
      console.log("Search applied with:", { searchTerm, searchOption });
      // Implement your search logic here
    };

    const handleDateFilterApply = () => {
      console.log("Date filter applied with:", { 
        dateFilterOption, 
        filterFromDate, 
        filterToDate 
      });
      // Implement your date filter logic here
    };

  //
  const sendBookingEmail = async (bookingDetails) => {
    try {
      const response = await fetch('/api/sendbookingemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
};

  const buttons = [
    { text: "Close", color: "danger", variant: "flat", onClick: clearForm },
    {
      text: isEdit ? "Update" : "Save",
      color: "primary",
      onClick: async () => {
        try {
          const now = new Date();
          const bookingDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
          const bookingTime = now.toTimeString().split(' ')[0]; // HH:MM:SS format
          
          // Generate order ID first
          const orderId = !isEdit ? await generateOrderId() : currentRecord.OrderId;

          const newRecord = {
            ...(isEdit && { id: currentRecord.id }),
            ParkingName: isEdit ? `${customerName} (edited by admin)` : `${customerName} (added by admin)`,
            CustomerEmail: customerEmail,
            CustomerPhone: customerPhone,
            FromDate: fromDate,
            FromTime: fromTime,
            ToDate: toDate,
            ToTime: toTime,
            PaidAmount: paidAmount,
            PaymentMethod: paymentMethod,
            CarNumber: carNumber,
            instructions:instructions,
            Location: location || airport,
            Airport: airport,
            ParkingSlot: parkingSlot,
            Status: bookingStatus || 'confirmed',
            ...(!isEdit && { 
              OrderId: orderId,
              id: String(Date.now()),
              createdAt: now.toISOString(),
              bookingDate,
              bookingTime
            }),
            HasDiscount: hasDiscount,
            CouponApplied: couponApplied,
            OfferApplied: offerApplied,
            CouponDetails: couponDetails,
            OfferDetails: offerDetails,
            OriginalPrice: originalPrice || paidAmount, // Fallback to paidAmount if no original price
            TotalSavings: totalSavings || "0.00",
            updatedAt: now.toISOString(),
            DepartureTerminal: departureTerminal,
            DepartureFlightNumber: departureFlightNumber,
            ReturnTerminal: returnTerminal,
            ReturnFlightNumber: returnFlightNumber,
          };

          // Process customer data
          await processCustomerData({
            ParkingName: customerName,
            CustomerEmail: customerEmail,
            CustomerPhone: customerPhone,
            CarNumber: carNumber,
            instructions:instructions,
            Airport: airport,
            OrderId: orderId
          });

          // Save booking
          const response = await fetch("/api/Todaysbooking", {
            method: isEdit ? "PUT" : "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save booking');
          }

          // Send email with all required fields
          await sendBookingEmail({
            customerName,
            customerEmail,
            orderId,
            bookingDate,
            fromDate,
            fromTime,
            toDate,
            toTime,
            airport,
            carNumber,
            instructions,
            parkingSlot,
            paidAmount,
            paymentMethod,
            departureTerminal,
            departureFlightNumber,
            returnTerminal,
            returnFlightNumber,
            hasDiscount,
            couponApplied,
            offerApplied,
            couponDetails,
            offerDetails,
            originalPrice: originalPrice || paidAmount,
            totalSavings: totalSavings || "0.00",
            paidAmount
          });

          await fetchData();
          clearForm();
        } catch (err) {
          console.error("Save error:", err);
          alert(`Save failed: ${err.message}`);
        }
      },
    },
  ];

  const fetchlocations = async () => {
    try {
      const res = await fetch("/api/Locations");
      if (!res.ok) throw new Error("Failed to fetch locations data");
      const data = await res.json();
      setLocationsData(data);
    } catch (err) {
      console.error("Error refreshing locations data:", err);
    }
  };

  const fetchparkingslots = async () => {
      try {
      const res = await fetch("/api/Parkingspace");
      if (!res.ok) throw new Error("Failed to fetch parking data");
      const data = await res.json();
      setParkingslotData(data);
    } catch (err) {
      console.error("Error refreshing parking data:", err);
    }
  }
    
  useEffect(() => {
    fetchlocations();
    fetchparkingslots();
  }, []);

  return (
    <div>
    {/* Card Section - Updated without CardContent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders Card */}
        <Card className="bg-blue-50 p-4">
          <CardHeader className="pb-2">
            <p className="text-sm font-semibold text-blue-600">Total Orders Today</p>
          </CardHeader>
          <div className="p-2">
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="solid"
              className='text-blue-50 bg-blue-600'
              onClick={generateTodayOrdersPDF}
            >
              PDF
            </Button>
            <Button 
              variant="solid"
              className='text-blue-50 bg-green-600'
              onClick={generateTodayOrdersExcel}
            >
              Excel
            </Button>
          </div>
        </Card>

        {/* Total Pickups Card */}
        <Card className="bg-green-50 p-4">
          <CardHeader className="pb-2">
            <p className="text-sm font-semibold text-green-600">Total Pickups</p>
          </CardHeader>
          <div className="p-2">
            <p className="text-2xl font-bold">{totalPickups}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="solid"
              className='text-green-50 bg-blue-600'
              onClick={generateTodayPickupsPDF}
            >
              PDF
            </Button>
            <Button 
              variant="solid"
              className='text-green-50 bg-green-600'
              onClick={generateTodayPickupsExcel}
            >
              Excel
            </Button>
          </div>
        </Card>

        {/* Total Drops Card */}
        <Card className="bg-yellow-50 p-4">
          <CardHeader className="pb-2">
            <p className="text-sm font-semibold text-yellow-600">Total Drops</p>
          </CardHeader>
          <div className="p-2">
            <p className="text-2xl font-bold">{totalDrops}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="solid"
              className='text-yellow-50 bg-blue-600'
              onClick={generateTodayDropsPDF}
            >
              PDF
            </Button>
            <Button 
              variant="solid"
              className='text-yellow-50 bg-green-600'
              onClick={generateTodayDropsExcel}
            >
              Excel
            </Button>
          </div>
        </Card>

        {/* Total Sales Card */}
        <Card className="bg-purple-50 p-4">
          <CardHeader className="pb-2">
            <p className="text-sm font-semibold text-purple-600">Total Sales</p>
          </CardHeader>
          <div className="p-2">
            <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="solid"
              className='text-purple-50 bg-blue-600'
              onClick={generateTotalSalesPDF}
            >
              PDF
            </Button>
            <Button 
              variant="solid"
              className='text-purple-50 bg-green-600'
              onClick={generateTotalSalesExcel}
            >
              Excel
            </Button>
          </div>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 mt-4">
        {/* Search row - all in one line */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-4">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 w-1/3"
          />
          <Select
            label="Search By"
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
            className="min-w-[180px] w-1/3"
          >
            {searchOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          <Button
            color="primary"
            className="h-[56px]"
            onClick={handleSearchApply}
          >
            Apply
          </Button>
        </div>

        {/* Date filter row - all in one line */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            label="Date Filter"
            value={dateFilterOption}
            onChange={(e) => setDateFilterOption(e.target.value)}
            className="min-w-[180px]"
          >
            <SelectItem value="booking">Booking Date</SelectItem>
            <SelectItem value="pickup">Pickup Date</SelectItem>
            <SelectItem value="drop">Drop Date</SelectItem>
            <SelectItem value="pickup_drop">Pickup & Drop Date</SelectItem>
            <SelectItem value="all">All Dates</SelectItem>
          </Select>
          <Input
            type="date"
            label="From Date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
          />
          <Input
            type="date"
            label="To Date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
          />
        </div>
        {/* Action buttons at bottom */}
        {filtersActive && (
            <Button 
              color="default"
              variant="bordered"
              onClick={handleRemoveFilters}
              className="ml-4"
            >
              Remove All Filters
            </Button>
          )}
        <div className="flex justify-between mt-6">
          <div>
            <Button
              color="success"
              variant="solid"
              onClick={generateMainPDF}
              className="mr-2"
            >
              Generate PDF
            </Button>
            <Button
              color="warning"
              variant="solid"
              onClick={generateMainExcel}
            >
              Generate Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end p-4">
        <Dynamicmodal
          triggerButton={{
            color: "primary",
            text: "Add New Booking",
            variant: "solid",
            onClick: () => { clearForm(); setIsEdit(false); setIsModalOpen(true); },
          }}
          modalTitle={isEdit ? "Edit Booking" : "Add New Booking"}
          inputs={inputs}
          buttons={buttons}
          ModalOpen={isModalOpen}
          Editmode={isEdit}
        />
      </div>

      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress label="Loading..." size="lg" />
        </div>
      ) : (
        <>
          <DynamicTable
            columns={columns}
            data={paginatedData}
            statusOptions={statusOptions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
          />
          
          {filteredData.length > 0 && (
            <div className="flex flex-col items-center py-4">
              <Pagination 
                color="secondary"
                page={currentPage} 
                total={totalPages} 
                onChange={setCurrentPage}
                className="mb-4"
              />
            </div>
          )}
        </>
      )}

      {showConfirm && recordToDelete && (
        <div className="fixed bottom-6 right-6 z-50 w-[300px]">
          <CustomDangerAlert
            title="Confirm Deletion"
            message={`Are you sure you want to delete booking for ${recordToDelete.ParkingName}?`}
            button1Label="Delete it anyway"
            button2Label="Keep it"
            onButton1Click={confirmDelete}
            onButton2Click={cancelDelete}
          />
        </div>
      )}
    </div>
  );
}