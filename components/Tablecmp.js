"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import jsPDF from 'jspdf';

export const EyeIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const DeleteIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const PrintIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M6 17.9827C4.44655 17.9354 3.51998 17.7626 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12C22 14.8284 22 16.2426 21.1213 17.1213C20.48 17.7626 19.5535 17.9354 18 17.9827"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 10H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 14H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 6V5.2C18 4.0799 18 3.51984 17.782 3.09202C17.5903 2.71569 17.2843 2.40973 16.908 2.21799C16.4802 2 15.9201 2 14.8 2H9.2C8.0799 2 7.51984 2 7.09202 2.21799C6.71569 2.40973 6.40973 2.71569 6.21799 3.09202C6 3.51984 6 4.0799 6 5.2V6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 18V19.8C6 20.9201 6 21.4802 6.21799 21.908C6.40973 22.2843 6.71569 22.5903 7.09202 22.782C7.51984 23 8.0799 23 9.2 23H14.8C15.9201 23 16.4802 23 16.908 22.782C17.2843 22.5903 17.5903 22.2843 17.782 21.908C18 21.4802 18 20.9201 18 19.8V18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const DynamicTable = ({ columns, data, statusOptions, onEdit, onDelete, currentPage, totalPages }) => {

  const generatePDF = (item) => {
  // A4 landscape dimensions in mm (297mm x 210mm)
  const pageWidth = 297;
  const pageHeight = 210;
  const sectionWidth = pageWidth / 3;
  
  // Convert 10px to mm (approx 3.53mm at 96 DPI)
  const marginPx = 10;
  const margin = 15 + (marginPx * 25.4 / 96); // Convert px to mm and add to existing margin
  
  const logoHeight = 40;
  const logoWidth = 80;
  
  const doc = new jsPDF('l', 'mm', 'a4');
  doc.setFont('helvetica');

  // IMPORTANT: Replace with actual logo path or base64 image
  const logoData = "/logo-nobg.png";

  // Function to add watermarked logo to all three columns
  const addWatermarkedLogos = () => {
    // Save current graphics state
    doc.saveGraphicsState();
    
    // Set transparency (30% opacity)
    doc.setGState(new doc.GState({opacity: 0.2}));
    
    // Add logo to all three columns (centered in each column)
    const centerY = pageHeight / 2 - logoHeight / 2;
    
    // Left column
    doc.addImage(logoData, "JPEG", sectionWidth/2 - logoWidth/2, centerY, logoWidth, logoHeight);
    
    // Middle column
    doc.addImage(logoData, "JPEG", sectionWidth + sectionWidth/2 - logoWidth/2, centerY, logoWidth, logoHeight);
    
    // Right column
    doc.addImage(logoData, "JPEG", sectionWidth * 2 + sectionWidth/2 - logoWidth/2, centerY, logoWidth, logoHeight);
    
    // Restore graphics state
    doc.restoreGraphicsState();
  };

  // Add watermarked logos to first page
  addWatermarkedLogos();

  // ========================
  // FIRST SECTION (LEFT 1/3)
  // ========================
  let yPos = margin + 5;
  
  // Customer section
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('CUSTOMER', margin, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 7;
  doc.text(`Name: ${item.ParkingName?.replace(/\(.*\)/, '').trim() || "N/A"}`, margin, yPos);
  yPos += 7;
  doc.text(`Mobile: ${item.CustomerPhone || "N/A"}`, margin, yPos);
  yPos += 7;
  doc.text(`Booking ref: ${item.OrderId || "N/A"}`, margin, yPos);
  
  // Horizontal line
  yPos += 5;
  doc.setLineWidth(0.2);
  doc.line(margin, yPos, margin + sectionWidth - margin, yPos);
  
  // Vehicle section
  yPos += 10;
  doc.setFont(undefined, 'bold');
  doc.text('VEHICLE', margin, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 7;
  doc.text(`Car Reg: ${item.CarNumber || "N/A"}`, margin, yPos);
  yPos += 7;
  doc.text(`Car model: ${item.CarModel || "N/A"}`, margin, yPos);
  yPos += 7;
  doc.text(`Colour: ${item.CarColor || "N/A"}`, margin, yPos);
  
  // Horizontal line
  yPos += 5;
  doc.line(margin, yPos, margin + sectionWidth - margin, yPos);
  
  // Flight details
  yPos += 10;
  doc.setFont(undefined, 'bold');
  doc.text('FLIGHT DETAILS', margin, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 7;
  
  // Flight header
  const flightMargin = margin + 4;
  doc.setFontSize(9);
  doc.text('Date', flightMargin, yPos);
  doc.text('Time', flightMargin + 25, yPos);
  doc.text('Terminal', flightMargin + 40, yPos);
  
  // Departure details
  yPos += 5;
  doc.setFontSize(10);
  doc.text('Departure', margin, yPos);
  yPos += 5;
  doc.text(formatDate(item.FromDate), flightMargin, yPos);
  doc.text(formatTime(item.FromTime), flightMargin + 25, yPos);
  doc.text('T2', flightMargin + 40, yPos);
  
  // Return details
  yPos += 7;
  doc.text('Return', margin, yPos);
  yPos += 5;
  doc.text(formatDate(item.ToDate), flightMargin, yPos);
  doc.text(formatTime(item.ToTime), flightMargin + 25, yPos);
  doc.text('T2', flightMargin + 40, yPos);

  yPos += 5;
  doc.line(margin, yPos, margin + sectionWidth - margin, yPos)

  // Declaration
  const declarationText = 'DECLARATION - By signing this document I agree that i have read and i am willing to be bound by the terms and conditions of Lion Parking and agree to the damage noted on my car. I further agree that the damage noted is not an accurate reflection of the condition of the car, due to time constraints/location.';
  
  doc.setFontSize(6);
  const maxWidth = sectionWidth - margin * 2;
  const declarationLines = doc.splitTextToSize(declarationText, maxWidth);
  
  yPos += 4;
  doc.text(declarationLines, margin, yPos);
  yPos += declarationLines.length * 2.5;

  yPos += 6;
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.text('#signature - 1', margin, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 4;

  const sign1 = 'Signature #01 - We confirm that no items/valuables have been left in the vehicle';
  doc.setFontSize(6);
  const declarationLines1 = doc.splitTextToSize(sign1, maxWidth);
  doc.text(declarationLines1, margin, yPos);
  yPos += declarationLines1.length * 2.5;

  yPos += 4;
  doc.line(margin, yPos, margin + sectionWidth - margin, yPos);

  yPos += 6;
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.text('#signature - 2', margin, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 4;

  const sign2 = 'Signature #02 - Customer confirms vehicle condition and contents';
  doc.setFontSize(6);
  const declarationLines2 = doc.splitTextToSize(sign2, maxWidth);
  doc.text(declarationLines2, margin, yPos);

  // ===========================
  // SECOND SECTION (MIDDLE 1/3)
  // ===========================
  const secondSectionX = sectionWidth + margin/2;
  yPos = margin + 5;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('ARRIVAL INFORMATION', secondSectionX, yPos);
  
  // Date of Arrival
  yPos += 12;
  doc.setFontSize(10);
  doc.text('DATE OF ARRIVAL', secondSectionX, yPos);
  yPos += 6;
  doc.setFontSize(12);
  doc.text(formatDate(item.FromDate), secondSectionX, yPos);
  
  // Horizontal line
  yPos += 8;
  doc.line(secondSectionX, yPos, sectionWidth * 2 - margin/2, yPos);
  
  // Time of Arrival
  yPos += 12;
  doc.setFontSize(10);
  doc.text('TIME OF ARRIVAL', secondSectionX, yPos);
  yPos += 6;
  doc.setFontSize(12);
  doc.text(formatTime(item.FromTime), secondSectionX, yPos);
  
  // Horizontal line
  yPos += 8;
  doc.line(secondSectionX, yPos, sectionWidth * 2 - margin/2, yPos);
  
  // Terminal
  yPos += 12;
  doc.setFontSize(10);
  doc.text('TERMINAL', secondSectionX, yPos);
  yPos += 6;
  doc.setFontSize(12);
  doc.text('2', secondSectionX, yPos);

  // ==========================
  // THIRD SECTION (RIGHT 1/3)
  // ==========================
  const thirdSectionX = sectionWidth * 2 + margin/2;
  yPos = margin + 5;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('CONTACT INFORMATION', thirdSectionX, yPos);
  doc.setFont(undefined, 'normal');
  
  yPos += 6;
  doc.text('After luggage collection call:', thirdSectionX, yPos);
  yPos += 6;
  doc.setFont(undefined, 'bold');
  doc.text('+44 7361 111683', thirdSectionX, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  doc.text('Customer relations:', thirdSectionX, yPos);
  yPos += 6;
  doc.text('support@simpleparking.uk', thirdSectionX, yPos);
  
  yPos += 6;
  doc.text('Amendments/cancellations:', thirdSectionX, yPos);
  yPos += 6;
  doc.text('9AM-5PM Mon-Fri', thirdSectionX, yPos);
  
  // Horizontal line
  yPos += 8;
  doc.line(thirdSectionX, yPos, pageWidth - margin, yPos);
  
  // Booking Summary
  yPos += 12;
  doc.setFont(undefined, 'bold');
  doc.text('BOOKING SUMMARY', thirdSectionX, yPos);
  doc.setFont(undefined, 'normal');
  
  const summaryMargin = thirdSectionX + 5;
  
  // Header
  yPos += 6;
  doc.setFontSize(8);
  doc.text('Details', summaryMargin, yPos);
  
  // Content rows
  yPos += 2;
  doc.setFontSize(8);
  
  const summaryData = [
    {label: 'Booking ref:', value: item.OrderId || "N/A"},
    {label: 'Car reg:', value: item.CarNumber || "N/A"},
    {label: 'Model:', value: item.CarModel || "N/A"},
    {label: 'Colour:', value: item.CarColor || "N/A"},
    {label: 'Departure:', value: `${formatDate(item.FromDate)} ${formatTime(item.FromTime)} T2`},
    {label: 'Return:', value: `${formatDate(item.ToDate)} ${formatTime(item.ToTime)} T2`},
    {label: 'Paid:', value: `$${item.PaidAmount || "0"}`}
  ];
  
  summaryData.forEach(row => {
    yPos += 5;
    doc.text(row.label, summaryMargin, yPos);
    doc.text(row.value, summaryMargin + 25, yPos);
  });

  // =====================
  // SECOND PAGE
  // =====================
  doc.addPage('l', 'a4');
  
  // Add watermarked logos to second page
  addWatermarkedLogos();

  // ===========================
  // FIRST COLUMN - TERMS AND CONDITIONS
  // ===========================
  yPos = margin + 25;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('TERMS AND CONDITIONS', margin, yPos);

  doc.setFontSize(4);
  doc.setFont(undefined, 'normal');

  const terms = [
    "By using our services, you confirm acceptance of these Terms & Conditions available at: www.simpleparking.uk",
    "1.BOOKINGS AND SERVICE  :  Bookings through our website or Consolidators are deemed to be made when final confirmation of the booking has been sent via email. All terms and conditions are deemed to have been accepted at the point confirmation is made. Whilst every effort is made to ensure that collections and deliveries of the vehicle are made at the requested times. We do not accept any responsibility for delays of its service, caused because of circumstances beyond our control, such as traffic congestion, delayed flights, road accidents, security alerts, severe weather conditions, luggage delays and immigration delays. This list is not exhausted. Where a third-party service provider is used, they will have their own terms and conditions. If you require a copy of these, please ask, however we will do our best to make you aware of anything you need to know. Once your booking is complete, our role will be as an intermediary between you and the service provider, booking details will be provided with the supplier and we will send you a booking reference number by email on behalf of the supplier",
    "2.PAYMENT  : Increased duration of the stay will be debited from the clients account and payment collected prior to the return of the vehicle. Any extended days will be charged are £35 for the first day, £15 per day thereafter. Full payment of booked service is due prior to the commencement of the service. If your return time passes midnight, early returns or if you return on a flight different to the one originally specified, there will be a charge of £30 payable to the driver in cash. If any height or size limit for vehicles will be an additional cost of £40.00 per day. Airport access fee not included in the price. Where a Meet and Greet service is booked, we kindly ask that you call us once you have cleared Baggage and Customs. This allows us to process your car in a timely manner and make sure it is ready and waiting for you. Please note that if you call prior to this, or there is an unreasonable delay from your call to you arriving at the collection point, you may be charged for any additional parking charges made by the airport authority.",
    "3.CANCELLATIONS AND CURTAILMENT : Flexible products may be cancelled up to 24 hours prior to the date for which the service has been booked and a full refund, less £20.00 administration cost will be made. No refunds will be given for any cancellations, or no use of our service made within 24 hours of the day of travel. Any customer wishing to curtail the length of stay for a service once that service has commenced will be liable to pay the fee for the whole of the service booked. Any alterations made within 24 hours of departure and during the duration of stay will incur a charge of £20.00 for each amendment made. All amendments must be via e-mail and will only be acknowledged once a confirmation e-mail is received. Cancellations or amendments cannot be accepted if you book a supersaver, saver, or nonflexible parking product",
    "4.LIABILITIES AND OTHER TERMS : Where a third-party service provider is used, the company acts only as a booking agent for the service provider, the company is liable to the customer only for losses directly arising from any negligence of the company in processing a booking. Any claims by the customer in respect of the delivery of the product must be made against the service provider and subject to its terms and conditions. Where we are the service provider, our insurance covers our legal liabilities. Vehicles and moveable items which are left unattended are left at the owner's risk whilst the vehicle is in our possession. No claim for damage can be made unless that damage was brought to the attention of our representative upon collection of your vehicle on your return and written notification is given to you at the time.",
  ];

  yPos += 5;

  terms.forEach(term => {
    const splitText = doc.splitTextToSize(term, sectionWidth - margin * 2);
    
    splitText.forEach((line) => {
      doc.text(line, margin, yPos);
      yPos += 3.5;
    });
    
    yPos += 2;
  });

  // ===========================
  // SECOND COLUMN - ADDITIONAL INFORMATION
  // ===========================
  const secondColX = sectionWidth + margin;
  let yPos2 = margin + 25;

  doc.setFontSize(4);
  doc.setFont(undefined, 'normal');
  yPos2 += 5;

  const parkingInfo = [
    " We accept no liability for mechanical, structural and electrical failure of any part of your vehicle including windscreens, glass chips, clutches, tyres and alloy wheels. This list is not exhaustive. We accept no liability for any loss or damage whatsoever caused unless proved to be caused by the negligence of our employees. Your vehicle must beTAXED, MOT and comply with the Road Traffic Act 1988. This is deemed by us to be the case for the whole duration while the vehicle is in our possession. We accept no liability for any faulty keys, alarm fobs, house or other keys left on the key ring. In the event of vehicles not starting, we reserve the right to charge for our time. We therefore advise that only the car key should be given. In the event that the car acquires a puncture whilst in our possession, (including slow punctures) we reserve the right to charge either to inflate the tyre or for the changing of the tyre. We do not accept liability for punctures whilst in our custody. In the event that the vehicle does not start due to a flat battery, we reserve the right to charge for our time in attempting to start the vehicle. Please note that we cannot be held responsible for any consequences that may result as a direct result of us having to jump-start your vehicle. We advise that the customers either leave a spare key with us or keep a spare key for their vehicle on their person. During busy periods your car may be stored in any one of our secondary compounds, (within a 20-mile radius of our main car park). Please note that security levels may vary. If your vehicle needs to be repaired as a result of our negligence, it must be carried out by our own approved organisation. It will be your responsibility to deliver and collect the car from the garage at your own cost. We cannot authorise or agree for any works to be carried out by dealerships that have not been approved, even in the event of the vehicle forgoing its warranty. The company reserves the right to undertake repairs to your vehicle on your behalf in a manner which restores it to the condition in which it arrived at the car park. Our drivers do not consent to being filmed. Therefore, in some cases dash cams may be disconnected.",
    "5.EXCLUSION AND LIMITS OF OUR RESPONSIBILITY : Vehicles parked by the customer personally at a Car park/Hotel do so entirely at their own risk. Loss or damage should be covered by your own insurance. No vehicles will be covered for Theft/Fire/Flood/Malicious damage or any other intervening act of nature whilst the vehicle is parked in our custody. Any indirect/direct loss as a result of damage or loss to the vehicle (such as loss of earnings/missed flights etc.). We cannot pay more than £10,000 for loss of or damage to the vehicle. We will endeavour to deliver your vehicle back to you within 45 mins depending on traffic, weather conditions. We cannot be held liable for any delayed or missed flights/car hire charges as a direct or indirect result of our service. We will not be responsible for any discolour of paintwork or dents or scratches that may become visible after a Car wash/rainfall. This is regardless of if the dents or scratches are mentioned in this document or not. We are unable to accept vehicles that are fitted with a roof luggage box that do not fall under the height restrictions within the airport car parks. In the event of a customer booking the service with a vehicle fitted with a roof luggage box the Company cannot accept liability for any damage. It is not always possible to check the internal condition of the car and therefore we may not accept responsibility for the interior condition. Unless proved otherwise, minor claims, (those below £750) may not be accepted.",
    "6.CUSTOMER RELATIONS PROCEDURE  : If you should have any concerns or issues you wish to raise or investigate further, the following procedure needs to take effect. A written correspondence needs to be made via email / letter / to our office (all correspondence details are available on the customer copy coupon receipt). Our customer relations team shall endeavour to respond back to your query within a maximum 5 working days. Please note that all matters need to be dealt with in writing. Any incidents/issues raised whilst picking or dropping your vehicle need to be made apparent to a Lion Parking Ltd member of staff which will be reported/logged back to the Duty Manager.",
  ];

  parkingInfo.forEach(info => {
    const splitText = doc.splitTextToSize(info, sectionWidth - margin * 2);
    
    splitText.forEach((line) => {
      doc.text(line, secondColX, yPos2);
      yPos2 += 3.5;
    });
    
    yPos2 += 2;
  });

  // ===========================
  // THIRD COLUMN - CONTACT & SUPPORT
  // ===========================
  const thirdColX = sectionWidth * 2 + margin;
  let yPos3 = margin + 25;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('CONTACT & SUPPORT', thirdColX, yPos3);

  doc.setFontSize(7);
  doc.setFont(undefined, 'normal');
  yPos3 += 5;

  const contactInfo = [
    "Emergency Contact: +44 7361 111683",
    "Customer Service: support@simpleparking.uk",
    "Office Hours: 9AM-5PM Mon-Fri",
    "For urgent assistance outside office hours, please use the emergency contact number.",
    "If you experience any issues with your parking service or have questions about your booking, our customer service team is available to assist you during office hours.",
    "For damage claims or incidents, please report them immediately to our staff on site and take photographs if possible for documentation.",
    "7.CHANGING THE CONDITIONS  : These conditions will remain in force unless the change is made in writing directly with us and with our written permission."
    
  ];

  contactInfo.forEach(info => {
    const splitText = doc.splitTextToSize(info, sectionWidth - margin * 2);
    
    splitText.forEach((line) => {
      doc.text(line, thirdColX, yPos3);
      yPos3 += 3.5;
    });
    
    yPos3 += 2;
  });

  // Save the PDF
  doc.save(`parking_receipt_${item.OrderId || 'receipt'}.pdf`);
};

// Helper functions
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatTime(timeString) {
  if (!timeString) return "N/A";
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
}

  const handleEdit = (item) => {
    onEdit && onEdit(item);
  };

  const handleDelete = (item) => {
    onDelete && onDelete(item);
  };

  function formatDate(dateString) {
    if (!dateString) return "";

    if (dateString.includes("T")) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  function formatTime(timeString) {
    if (!timeString) return "";

    if (timeString.includes("T")) {
      const time = new Date(timeString);
      return time.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }

    return timeString; 
  }

  const renderCell = React.useCallback((item, columnKey) => {
    if (columnKey === "FromDate" || columnKey === "ToDate") {
      return formatDate(item[columnKey]);
    }
    if (columnKey === "FromTime" || columnKey === "ToTime") {
      return formatTime(item[columnKey]);
    }

    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: item.avatar}}
            description={item.email}
            name={cellValue}
          >
            {item.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">{item.team}</p>
          </div>
        );
      case "Status":
        return (
          <Chip 
            className="capitalize" 
            color={statusOptions?.[item.Status] || "default"} 
            size="sm" 
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEdit(item)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Print">
              <span
                className="text-lg text-blue-500 cursor-pointer active:opacity-50"
                onClick={() => generatePDF(item)}
              >
                <PrintIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDelete(item)}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [statusOptions]);

  return (
      <div>
        <Table aria-label="Dynamic table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={data}>
            {(item) => (
              <TableRow key={`${item.id}-${currentPage}`}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="mt-4 text-small text-default-500">
          Page {currentPage} of {totalPages} • {data.length} records
        </div>
      </div>
    );
  };

export default DynamicTable;