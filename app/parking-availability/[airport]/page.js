'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LoadingCard from '@/components/Loading';
import { useState, useEffect } from 'react';
import ParkingCard from '@/components/Cardscmp';



export default function ParkingAvailability() {
  const params = useParams();
  const selectedAirportRaw = params?.airport;
  const selectedAirport = decodeURIComponent(selectedAirportRaw || 'London Luton Airport');

  const [LocationsData, setLocationsData] = useState([]);
  const [ParkingslotData, setParkingslotData] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [searching, setSearching] = useState(true);
  const [duration, setDuration] = useState({ days: 0, hours: 0 });

  const fetchAllData = async () => {
    setSearching(true);
    try {
      const [locationsRes, parkingRes] = await Promise.all([
        fetch("/api/Locations"),
        fetch("/api/Parkingspace"),
      ]);

      if (!locationsRes.ok || !parkingRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const locationsData = await locationsRes.json();
      const parkingData = await parkingRes.json();

      setLocationsData(locationsData);
      setParkingslotData(parkingData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const filtered = ParkingslotData.filter(
      (slot) =>
        slot.Location?.toLowerCase().trim() === selectedAirport.toLowerCase().trim()
    );
    setFilteredSlots(filtered);
  }, [ParkingslotData, selectedAirport]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("parkingSearchData");
    if (storedData) {
      const { dropOffDate, dropOffTime, pickupDate, pickupTime } = JSON.parse(storedData);

      const dropOff = new Date(dropOffDate);
      dropOff.setHours(new Date(dropOffTime).getHours(), new Date(dropOffTime).getMinutes());

      const pickup = new Date(pickupDate);
      pickup.setHours(new Date(pickupTime).getHours(), new Date(pickupTime).getMinutes());

      const durationMs = pickup - dropOff;
      const totalHours = Math.ceil(durationMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;

      setDuration({ days, hours });
    }
  }, []);

  useEffect(() => {
    const filtered = ParkingslotData.filter(
      (slot) =>
        slot.Location?.toLowerCase().trim() === selectedAirport.toLowerCase().trim()
    );
    setFilteredSlots(filtered);
  }, [ParkingslotData, selectedAirport]);



  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-30">
        {/* Hero Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Available Parking at <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{selectedAirport}</span>
          </h1>
          <p className="text-lg text-gray-400">
            Select from our secure, affordable parking options
          </p>
        </motion.div>

        {/* Duration Info */}
        {duration.days > 0 || duration.hours > 0 ? (
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-indigo-600/20 rounded-lg mr-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Your Parking Duration</h3>
                <p className="text-xl font-bold text-white">
                  {duration.days > 0 ? `${duration.days} day${duration.days > 1 ? 's' : ''}` : ''}
                  {duration.days > 0 && duration.hours > 0 ? ' and ' : ''}
                  {duration.hours > 0 ? `${duration.hours} hour${duration.hours > 1 ? 's' : ''}` : ''}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Parking Cards */}
        {searching ? (
          <LoadingCard text="Finding Available Parking..." />
        ) : filteredSlots.length > 0 ? (
          <div className="space-y-6">
            {filteredSlots.map((slot, index) => (
              <ParkingCard
                key={slot.id}
                title={slot.ParkingName}
                details={slot.AvailableFacilities}
                price={slot.price_per_day}
                pricePerHour={slot.Price_per_hour}
                imageUrl={slot.Displaypicture}
                duration={duration}
                index={index}
                setSearching={setSearching}
                pricingTiers={slot.pricingTiers} 
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No Parking Available</h3>
            <p className="text-gray-400 mb-4">We couldn't find any parking slots for this location.</p>
            <motion.button
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Try Another Airport
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}