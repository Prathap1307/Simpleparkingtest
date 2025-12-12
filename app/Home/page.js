'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  // Scroll to search function (no animation for speed)
  const scrollToSearch = () => {
    const searchSection = document.getElementById('Searchfrom');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  };

  useEffect(() => {
    setHasMounted(true);
    const fetchAirports = async () => {
      try {
        const response = await fetch("/api/Locations", { method: 'GET', cache: 'no-store' });
        if (!response.ok) {
          setAirports([]);
          return;
        }
        const data = await response.json();
        setAirports(Array.isArray(data) ? data : []);
      } catch (error) {
        setAirports([]);
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

    const dropOffDateTime = dropOffDate && dropOffTime ? new Date(dropOffDate.getTime()) : null;
    if (dropOffDateTime && dropOffTime) {
      dropOffDateTime.setHours(dropOffTime.getHours(), dropOffTime.getMinutes(), 0, 0);
    }

    const pickupDateTime = pickupDate && pickupTime ? new Date(pickupDate.getTime()) : null;
    if (pickupDateTime && pickupTime) {
      pickupDateTime.setHours(pickupTime.getHours(), pickupTime.getMinutes(), 0, 0);
    }

    if (pickupDateTime && pickupDateTime <= now) errorsTemp.pickup = "Pick-up must be in the future.";
    if (pickupDateTime && dropOffDateTime && pickupDateTime < dropOffDateTime) {
      errorsTemp.pickupBeforeDropOff = "Pick-up cannot be before Drop-off.";
    }

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





  const FeatureCard = ({ icon, title, description }) => (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );

  return (
    <>

      <div className="w-full bg-white text-slate-900">
        <Navbarcmp onFindParkingClick={scrollToSearch} />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-4 py-2 text-sm font-semibold">
              Heathrow meet and greet parking
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
              Smooth forecourt drop-off with insured chauffeurs and Park Mark security
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Book Heathrow valet parking in under a minute. No shuttles, no queues — just safe, insured drivers and fast terminal access for T2–T5.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="badge-soft">24/7 CCTV</span>
              <span className="badge-soft">Free date change</span>
              <span className="badge-soft">Price match promise</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="pill-cta cta-primary" onClick={scrollToSearch}>Book meet & greet</Button>
              <Button className="pill-cta cta-secondary" onClick={scrollToSearch} variant="bordered">Check live availability</Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">5.0</span>
                Trusted by 5k+ Heathrow travellers
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">£</span>
                Save up to 70% vs drive-up
              </div>
            </div>
          </div>
          <div id="Searchfrom" className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-white/60 blur-3xl" aria-hidden></div>
            <div className="relative glass-panel border border-slate-200 rounded-3xl p-6 shadow-xl">
              {searching ? (
                <LoadingCard text="Searching for Parking..." />
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-4">
            <span className="text-sm font-semibold tracking-wide text-indigo-700">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Premium Heathrow valet parking</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">Fast forecourt drop-off, insured chauffeurs, and Park Mark security across Heathrow terminals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Meet & Greet VIP Service ⚡",
                description: "Drop your car and walk straight to check-in! No shuttles, no stress",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: "Book now and save 70% on secured parking 🎁",
                description: "Limited-time summer sale: Book now and save 70% on secured parking with 24/7 surveillance.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "24/7 Security",
                description: "All facilities feature advanced surveillance and round-the-clock patrols.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Free Cancellation",
                description: "Change your plans anytime with no penalty up to 48 hours before.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )
              },
              {
                title: "Valet Options",
                description: "Premium service where we park for you - just drop and go.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )
              },
              {
                title: "EV Charging",
                description: "Dedicated spaces with fast charging for electric vehicles.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Airports */}
      <section id='Airports' className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-4">
            <span className="text-sm font-semibold tracking-wide text-indigo-700">POPULAR AIRPORTS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Parking across leading UK airports</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">Transparent pricing and secure compounds near every terminal.</p>
          </div>

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
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl group border border-slate-200 bg-slate-50"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={airport.image}
                    alt={airport.name}
                    className="w-full h-full object-cover"
                    radius="none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between p-6 min-h-[300px] text-white">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold">{airport.name}</h3>
                        <p className="text-slate-100">{airport.code} Airport</p>
                      </div>
                      <div className="px-3 py-1 bg-white/90 text-indigo-700 text-sm font-semibold rounded-full">
                        {airport.discount}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold">{airport.price}</span>
                      <Button
                        className="bg-white text-slate-900 hover:bg-slate-100"
                        onClick={scrollToSearch}
                      >
                        View Parking
                      </Button>
                    </div>
                    <div className="text-sm text-slate-100 mt-2">
                      Starting from {airport.price}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-4">
            <span className="text-sm font-semibold tracking-wide text-indigo-700">CUSTOMER STORIES</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Trusted by thousands</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">Airport-grade security, professional chauffeurs, and transparent pricing our travellers rely on.</p>
          </div>

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
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-amber-500 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.author}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Ready for stress-free Heathrow parking?</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">Lock in a secure, chauffeur-led forecourt drop-off today. No animation, no slow scripts — just fast booking and trusted service.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="pill-cta cta-primary" onClick={scrollToSearch}>Book now</Button>
            <Button className="pill-cta cta-secondary" onClick={scrollToSearch} variant="bordered">View Heathrow options</Button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Homepage;