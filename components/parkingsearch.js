'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Parkingsearchcmp({
  airports, selectedAirport, setSelectedAirport,
  dropOffDate, setDropOffDate,
  dropOffTime, setDropOffTime,
  pickupDate, setPickupDate,
  pickupTime, setPickupTime,
  loading, hasMounted,
  errors, setErrors, searchonclick
}) {
  if (!hasMounted || loading) {
    return (
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Get the selected airport details
  const selectedAirportDetails = airports.find(airport => airport.Airport_name === selectedAirport);
  const isAirportActive = selectedAirportDetails?.Status === 'active';
  const nextActivationDate = selectedAirportDetails?.NextActivation ? new Date(selectedAirportDetails.NextActivation) : null;

  // Calculate min date for date pickers
  const minDropOffDate = isAirportActive ? new Date() : nextActivationDate;

  // Set time constraints only when airport is inactive
  const getTimeConstraints = () => {
    if (!isAirportActive && nextActivationDate) {
      const minTime = new Date(nextActivationDate);
      const maxTime = new Date(nextActivationDate);
      maxTime.setHours(23, 59, 0, 0);
      return { minTime, maxTime };
    }
    return { minTime: null, maxTime: null };
  };

  const { minTime, maxTime } = getTimeConstraints();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    const now = new Date();

    if (!selectedAirport) formErrors.airport = 'Please select an airport';
    if (!dropOffDate || !dropOffTime) formErrors.dropOff = 'Drop-off date and time required';
    if (!pickupDate || !pickupTime) formErrors.pickup = 'Pick-up date and time required';
    
    // Simple validation without creating new Date objects
    if (dropOffDate && pickupDate && dropOffTime && pickupTime) {
      if (!isAirportActive && dropOffDate < nextActivationDate) {
        formErrors.dropOff = `Drop-off must be after ${nextActivationDate.toLocaleString()}`;
      }
      
      if (!isAirportActive && pickupDate < nextActivationDate) {
        formErrors.pickup = `Pick-up must be after ${nextActivationDate.toLocaleString()}`;
      }
      
      if (pickupDate <= now) {
        formErrors.pickup = 'Pick-up must be in the future';
      }
      
      // Compare dates directly
      const dropOffDateTime = new Date(dropOffDate.getTime());
      dropOffDateTime.setHours(dropOffTime.getHours(), dropOffTime.getMinutes());
      
      const pickupDateTime = new Date(pickupDate.getTime());
      pickupDateTime.setHours(pickupTime.getHours(), pickupTime.getMinutes());
      
      if (pickupDateTime < dropOffDateTime) {
        formErrors.pickupBeforeDropOff = 'Pick-up cannot be before Drop-off';
      }
    }

    // Store dates directly without any formatting or manipulation
    const Datetimeinfo = {
      dropOffDate: dropOffDate, 
      dropOffTime: dropOffTime,
      pickupDate: pickupDate,
      pickupTime: pickupTime,
      selectedAirport: selectedAirport,
      airports: airports
    } 

    sessionStorage.setItem('Datetimeinfo', JSON.stringify(Datetimeinfo));

    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      searchonclick();
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Find Airport Parking</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Airport Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Airport</label>
          <div className="relative">
            <select
              value={selectedAirport}
              onChange={(e) => {
                setSelectedAirport(e.target.value);
                setErrors({...errors, airport: ''});
                // Reset dates when airport changes
                setDropOffDate(null);
                setPickupDate(null);
              }}
              variant="bordered"
              className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="">Select an airport</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.Airport_name}>
                  {airport.Airport_name} {airport.Status === 'inactive' ? '(Inactive)' : ''}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {errors.airport && (
            <p className="mt-1 text-sm text-red-600">
              {errors.airport}
            </p>
          )}
        </div>
        {selectedAirport && !isAirportActive && nextActivationDate && (
            <div className="mt-4 p-3 bg-red-50 border border-indigo-100 rounded-lg">
              <p className="text-sm text-red-700 flex items-start">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-red-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <span>Note: {selectedAirport} next available time is {nextActivationDate.toLocaleString()}</span>
              </p>
            </div>
          )}

        {/* Drop-off Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                selected={dropOffDate}
                onChange={(date) => {
                  setDropOffDate(date);
                  setErrors({...errors, dropOff: ''});
                }}
                minDate={minDropOffDate}
                placeholderText="Select date"
                className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                filterDate={!isAirportActive ? (date) => date >= nextActivationDate : undefined}
                inputMode="none"
              />
            </div>
            <div>
              <DatePicker
                selected={dropOffTime}
                onChange={(time) => {
                  setDropOffTime(time);
                  setErrors({...errors, dropOff: ''});
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm" // 24-hour format
                timeFormat="HH:mm" 
                className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholderText="Select time"
                minTime={minTime}
                maxTime={maxTime}
                inputMode="none"
              />
            </div>
          </div>
          {errors.dropOff && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dropOff}
            </p>
          )}
        </div>

        {/* Pickup Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                selected={pickupDate}
                onChange={(date) => {
                  setPickupDate(date);
                  setErrors({...errors, pickup: '', pickupBeforeDropOff: ''});
                }}
                minDate={dropOffDate || minDropOffDate}
                placeholderText="Select date"
                className="w-full px-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                filterDate={!isAirportActive ? (date) => date >= nextActivationDate : undefined}
                inputMode="none"
              />
            </div>
            <div>
              <DatePicker
                selected={pickupTime}
                onChange={(time) => {
                  setPickupTime(time);
                  setErrors({...errors, pickup: ''});
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                className="w-full px-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholderText="Select time"
                dateFormat="HH:mm" // 24-hour format
                timeFormat="HH:mm" 
                minTime={minTime}
                maxTime={maxTime}
                inputMode="none"
              />
            </div>
          </div>
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
            <p className="text-sm text-indigo-700 flex items-start">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-indigo-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span>Note: Discount coupons can be applied at checkout</span>
            </p>
          </div>
          
          {(errors.pickup || errors.pickupBeforeDropOff) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.pickup || errors.pickupBeforeDropOff}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Search Parking
        </button>
      </form>
    </div>
  );  
}