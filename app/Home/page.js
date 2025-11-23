'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbarcmp from '@/components/Navbar';
import Parkingsearchcmp from '@/components/parkingsearch';
import LoadingCard from '@/components/Loading';
import { Button, Image } from '@heroui/react';
import Footer from '@/components/Footer';


const Homepage = () => {
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState('');
  const [dropOffDate, setDropOffDate] = useState(null);
  const [dropOffTime, setDropOffTime] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [searching, setSearching] = useState(false);
  const [errors, setErrors] = useState({
    airport: '',
    dropOff: '',
    pickup: '',
    pickupBeforeDropOff: ''
  });

  const router = useRouter();

  // Scroll to search function
  const scrollToSearch = () => {
    const searchSection = document.getElementById('Searchfrom');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setHasMounted(true);
    const fetchAirports = async () => {
      try {
        const response = await fetch("/api/Locations");
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('Error fetching airports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAirports();
  }, []);

  const searchclick = () => {
    const now = new Date();
    const errorsTemp = {};

    if (!selectedAirport) errorsTemp.airport = "Please select an airport.";
    if (!dropOffDate || !dropOffTime) errorsTemp.dropOff = "Please fill Drop-off Date and Time.";
    if (!pickupDate || !pickupTime) errorsTemp.pickup = "Please fill Pick-up Date and Time.";
    if (pickupDate <= now) errorsTemp.pickup = "Pick-up must be in the future.";
    if (pickupDate < dropOffDate) errorsTemp.pickupBeforeDropOff = "Pick-up cannot be before Drop-off.";

    setErrors(errorsTemp);
    if (Object.keys(errorsTemp).length > 0) return;

    setSearching(true);
    
    const searchData = {
      airport: selectedAirport,
      dropOffDate,
      dropOffTime,
      pickupDate,
      pickupTime,
    };

    sessionStorage.setItem('parkingSearchData', JSON.stringify(searchData));

    setTimeout(() => {
      router.push(`/parking-availability/${selectedAirport}`);
    }, 1500);
  };





  const GlowingCard = ({ icon, title, description, index }) => {
    return (
      <motion.div
        className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-indigo-500 transition-all group"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -10 }}
      >
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </motion.div>
    );
  };

  return (
    <>

      <div className='w-full'>
        <Navbarcmp onFindParkingClick={scrollToSearch} />
      </div>

      {/* Hero Section with Parallax */}
      <div className="relative lg:overflow-hidden md:overflow-hidden h-screen" >

          <Image
            alt="Hero"
            radius='none'
            className="w-full h-full object-cover filter brightness-75"
            src="https://images.unsplash.com/photo-1629238727881-cdc61062fba1?q=80&w=2670&auto=format&fit=crop"
          />

        <div id='Searchfrom' className="absolute top-0 left-0 w-full h-full flex items-center justify-center px-4 z-10">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="w-full md:w-1/2 text-center md:text-left pt-48">

              <motion.p 
                className="text-white text-2xl lg:text-4xl font-semibold cursor-pointer mt-20 lg:-mt-20 md:-mt-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onClick={scrollToSearch}
              >
                Find the parking that suits you best
                <br />
                <span className="text-base lg:text-3xl text-yellow-400">Starting from £19</span>
              </motion.p>
            </div>
            <div className="w-full md:w-1/2 bg-transparent mb-20 z-100 lg:mt-32 md:mt-32">
              {searching ? (
                <LoadingCard text="Searching for Parking..." />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Parkingsearchcmp
                    airports={airports}
                    selectedAirport={selectedAirport}
                    setSelectedAirport={setSelectedAirport}
                    dropOffDate={dropOffDate}
                    setDropOffDate={setDropOffDate}
                    dropOffTime={dropOffTime}
                    setDropOffTime={setDropOffTime}
                    pickupDate={pickupDate}
                    setPickupDate={setPickupDate}
                    pickupTime={pickupTime}
                    setPickupTime={setPickupTime}
                    loading={loading}
                    hasMounted={hasMounted}
                    errors={errors}
                    setErrors={setErrors}
                    searchonclick={searchclick}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>      
      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-950 to-gray-900 -z-100 ">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold tracking-wider text-indigo-400 mb-4 inline-block">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
               70%<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">OFF Airport Parking! </span> ✈️
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We're revolutionizing airport parking with cutting-edge technology 
              and customer-first service.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Meet & Greet VIP Service ⚡",
                description: "Drop your car and walk straight to check-in! No shuttles, no stress",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: "Book now and save 70% on secured parking 🎁",
                description: "Limited-time summer sale: Book now and save 70% on secured parking with 24/7 surveillance.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "24/7 Security",
                description: "All facilities feature advanced surveillance and round-the-clock patrols.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Free Cancellation",
                description: "Change your plans anytime with no penalty up to 48 hours before.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )
              },
              {
                title: "Valet Options",
                description: "Premium service where we park for you - just drop and go.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )
              },
              {
                title: "EV Charging",
                description: "Dedicated spaces with fast charging for electric vehicles.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <GlowingCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Airports */}
      <section id='Airports' className="py-24 px-6 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="grid-dots"></div>
          </div>
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-900/20 filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-900/20 filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold tracking-wider text-indigo-400 mb-4 inline-block">
              POPULAR AIRPORTS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Parking Solutions at <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Major Airports</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We partner with parking facilities at all major airports to bring you the best options.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: "Heathrow", 
                code: "LHR", 
                discount: "30% OFF", 
                price: "£12/day",
                image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=2670&auto=format&fit=crop"
              },
              { 
                name: "Gatwick", 
                code: "LGW", 
                discount: "25% OFF", 
                price: "£10/day",
                image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2670&auto=format&fit=crop"
              },
              { 
                name: "Manchester", 
                code: "MAN", 
                discount: "20% OFF", 
                price: "£8/day",
                image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2670&auto=format&fit=crop"
              },
              { 
                name: "Stansted", 
                code: "STN", 
                discount: "15% OFF", 
                price: "£9/day",
                image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=2574&auto=format&fit=crop"
              }
            ].map((airport, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden rounded-2xl group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={airport.image}
                    alt={airport.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    radius="none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                </div>
                
                <div className="relative z-10 h-full flex flex-col justify-between p-6 min-h-[300px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{airport.name}</h3>
                        <p className="text-gray-300">{airport.code} Airport</p>
                      </div>
                      <div className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                        {airport.discount}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-white">{airport.price}</span>
                      <Button 
                        className="bg-white text-gray-900 hover:bg-gray-100"
                        onClick={scrollToSearch}
                      >
                        View Parking
                      </Button>
                    </div>
                    <div className="text-sm text-gray-300 mt-2">
                      Starting from {airport.price}
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-gray-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold tracking-wider text-indigo-400 mb-4 inline-block">
              CUSTOMER STORIES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Thousands</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Don't just take our word for it - hear what our customers have to say.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Simple parking saved me over £50 on my last trip. The app is so intuitive and the parking facility was excellent - well lit and secure.",
                author: "Sarah Johnson",
                role: "Frequent Traveler",
                rating: 5
              },
              {
                quote: "As a business traveler, I need reliability. Simple parking has never let me down, even with last-minute bookings during peak seasons.",
                author: "Michael Chen",
                role: "Business Traveler",
                rating: 5
              },
              {
                quote: "The valet service is worth every penny when traveling with kids. No more dragging luggage through parking lots in the rain!",
                author: "Emma Rodriguez",
                role: "Family Traveler",
                rating: 4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-indigo-500 transition-all group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Stress-Free</span> Parking?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of travelers who trust Simple parking for their airport parking needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20"
                onClick={scrollToSearch}
              >
                Find Your Parking Now
              </Button>
              <Button className="bg-transparent border border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div 
            className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Homepage;