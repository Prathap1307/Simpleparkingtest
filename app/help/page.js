'use client';

import { useState, useRef , useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@heroui/react';
import Navbarcmp from '@/components/Navbar';
import Footer from '@/components/Footer';


const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 2000);
  };

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book airport parking?",
      answer: "Booking is simple! Just enter your airport, travel dates, and parking needs on our homepage. We'll show you all available options with prices and features. Select your preferred option and complete the booking process in just a few clicks."
    },
    {
      question: "Can I modify or cancel my booking?",
      answer: "Yes, most bookings can be modified or cancelled free of charge up to 24 hours before your parking start time. Simply log into your account or use the booking reference from your confirmation email to make changes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover. We also support Apple Pay and Google Pay for faster checkout."
    },
    {
      question: "How does the valet parking service work?",
      answer: "With our valet service, you simply drive to the designated valet area at the airport, leave your keys with our professional staff, and head to your terminal. Your car will be securely parked. When you return, your car will be waiting for you at the same location."
    },
    {
      question: "What COVID-19 safety measures are in place?",
      answer: "All our partner facilities follow strict cleaning protocols, with frequent disinfection of high-touch surfaces. Valet staff wear masks and gloves, and vehicles are sanitized before and after parking. Contactless payment options are available."
    }
  ];

  const contactMethods = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Call Us",
      description: "Speak directly with our support team",
      action: "Call +44 7386 469113",
      actionLink: "tel:+447386469113",
      bg: "from-blue-600 to-indigo-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Us",
      description: "Get a response within 24 hours",
      action: "support@simpleparking.com",
      actionLink: "mailto:support@simpleparking.com",
      bg: "from-purple-600 to-pink-600"
    },
  ];

  // Magnetic Button Component (Reusable)
  const MagneticButton = ({ children, onClick, className = '' }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hovering, setHovering] = useState(false);
  
    useEffect(() => {
      if (!ref.current) return;
      
      const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        setPosition({
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2
        });
      };
      
      const handleMouseEnter = () => setHovering(true);
      const handleMouseLeave = () => {
        setHovering(false);
        setPosition({ x: 0, y: 0 });
      };
      
      ref.current.addEventListener('mousemove', handleMouseMove);
      ref.current.addEventListener('mouseenter', handleMouseEnter);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        if (ref.current) {
          ref.current.removeEventListener('mousemove', handleMouseMove);
          ref.current.removeEventListener('mouseenter', handleMouseEnter);
          ref.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }, []);
  
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        className={`relative overflow-hidden px-6 py-3 rounded-full font-medium magnetic ${className}`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span 
          className="relative z-10 flex items-center justify-center gap-2"
          animate={{
            x: position.x * 0.2,
            y: position.y * 0.2
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, mass: 0.1 }}
        >
          {children}
        </motion.span>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full z-0"
          initial={{ scale: 1 }}
          animate={{ 
            scale: hovering ? 1.05 : 1,
            x: position.x * 0.4,
            y: position.y * 0.4
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, mass: 0.1 }}
        />
        {hovering && (
          <motion.div 
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 0.2, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: "radial-gradient(circle, rgba(124, 58, 237, 0.8) 0%, rgba(124, 58, 237, 0) 70%)"
            }}
          />
        )}
      </motion.button>
    );
  };

  // Magnetic Cursor Component
  const MagneticCursor = () => {
    const cursorRef = useRef(null);
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [trailPositions, setTrailPositions] = useState(Array(5).fill({ x: -100, y: -100 }));
  
    useEffect(() => {
      const moveCursor = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
        setTrailPositions(prev => {
          const newPositions = [...prev];
          newPositions.pop();
          return [{ x: e.clientX, y: e.clientY }, ...newPositions];
        });
      };
      
      const handleMouseDown = () => setClicking(true);
      const handleMouseUp = () => setClicking(false);
      
      window.addEventListener('mousemove', moveCursor);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Add hover detection
      const interactiveElements = [
        ...document.querySelectorAll('a, button, .magnetic, input, textarea, select'),
      ];
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => setHovering(true));
        el.addEventListener('mouseleave', () => setHovering(false));
      });
  
      return () => {
        window.removeEventListener('mousemove', moveCursor);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', () => setHovering(true));
          el.removeEventListener('mouseleave', () => setHovering(false));
        });
      };
    }, []);
  
    return (
      <>
        <motion.div
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
          animate={{
            x: position.x - 10,
            y: position.y - 10,
            scale: clicking ? 0.7 : hovering ? 1.8 : 1,
            opacity: hovering || clicking ? 1 : 0.8,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 800, 
            damping: 25, 
            mass: 0.5 
          }}
        >
          <div className={`w-4 h-4 rounded-full ${
            hovering ? 'bg-indigo-500' : clicking ? 'bg-purple-500' : 'bg-white'
          } transition-colors shadow-lg ${hovering ? 'shadow-indigo-500/30' : ''}`} />
        </motion.div>
        
        {trailPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
            animate={{
              x: pos.x - 8 + (Math.random() * 4 - 2),
              y: pos.y - 8 + (Math.random() * 4 - 2),
              scale: 1 - (i * 0.15),
              opacity: 0.6 - (i * 0.1)
            }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30, 
              mass: 0.3,
              delay: i * 0.01
            }}
          >
            <div className={`w-3 h-3 rounded-full ${
              hovering ? 'bg-indigo-400/50' : clicking ? 'bg-purple-400/50' : 'bg-white/50'
            } transition-colors`} />
          </motion.div>
        ))}
      </>
    );
  };

  return (
    <>
    <Navbarcmp />
      <MagneticCursor />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-950">
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <Image
            alt="Help Center Background"
            radius="none"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop"
          />
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">help you</span>?
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Get answers to your questions or contact our support team for personalized assistance.
            </motion.p>
            
            <motion.div
              className="mt-10 max-w-2xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full px-6 py-4 rounded-full bg-gray-900/70 backdrop-blur-sm border border-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white placeholder-gray-500 transition-all"
              />
              <button className="absolute right-2 top-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-0 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 filter blur-3xl"
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
      </div>

      {/* Main Content */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row border-b border-gray-800 mb-12">
            {[
              { id: 'faq', label: 'FAQs' },
              { id: 'contact', label: 'Contact Us' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-lg font-medium relative ${activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white mb-8">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Questions</span>
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-indigo-500 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <button
                      className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                      onClick={() => toggleQuestion(index)}
                    >
                      <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                      <motion.div
                        animate={{ rotate: expandedQuestion === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-4 flex-shrink-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </button>
                    
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: expandedQuestion === index ? 1 : 0,
                        height: expandedQuestion === index ? 'auto' : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-gray-300"
                    >
                      <p>{faq.answer}</p>
                      {index === 0 && (
                        <div className="mt-4">
                          <MagneticButton className="bg-indigo-600 text-white hover:bg-indigo-700">
                            Watch Booking Tutorial
                          </MagneticButton>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Still have questions?</h3>
                <p className="text-gray-300 mb-6">Our support team is available 24/7 to assist you with any questions or concerns.</p>
                <MagneticButton 
                  onClick={() => setActiveTab('contact')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  Contact Support
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* Contact Section */}
          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">
                  Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Support</span>
                </h2>
                
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-indigo-500 transition-all group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${method.bg} mr-4 group-hover:rotate-6 transition-transform`}>
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                          <p className="text-gray-400 mb-4">{method.description}</p>
                          <a 
                            href={method.actionLink} 
                            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center magnetic"
                          >
                            {method.action}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-white mb-4">Our Headquarters</h3>
                  <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                    <p className="text-gray-300 mb-2">595 Sipson Rd, Sipson, </p>
                    <p className="text-gray-300 mb-2">West Drayton UB7 0JD</p>
                    <p className="text-gray-300">United Kingdom</p>
                    
                    <div className="mt-6 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.592869257488!2d-0.450798323810565!3d51.483987012414026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487672386d264271%3A0x7c08c7a85cb13991!2s595%20Sipson%20Rd%2C%20Sipson%2C%20West%20Drayton%20UB7%200JD!5e0!3m2!1sen!2suk!4v1753982954713!5m2!1sen!2suk" 
                        width="100%" 
                        height="200" 
                        style={{ border: 0 }}
                        allowFullScreen="" 
                        loading="lazy"
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
                  <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
                  
                  {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-green-900/30 to-teal-900/30 p-6 rounded-xl border border-green-500/30 mb-6"
                    >
                      <div className="flex items-center">
                        <div className="bg-green-500/20 p-2 rounded-full mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-white">Message Sent Successfully!</h4>
                          <p className="text-gray-300">We'll get back to you within 24 hours.</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white placeholder-gray-500 transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white placeholder-gray-500 transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white placeholder-gray-500 transition-all"
                        >
                          <option value="">Select a subject</option>
                          <option value="Booking Help">Booking Help</option>
                          <option value="Payment Issue">Payment Issue</option>
                          <option value="Cancellation">Cancellation</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows="5"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white placeholder-gray-500 transition-all"
                          placeholder="How can we help you?"
                        ></textarea>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="consent"
                          name="consent"
                          required
                          className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
                        />
                        <label htmlFor="consent" className="ml-2 block text-sm text-gray-400">
                          I agree to the <a href="/PrivacyPolicy" className="text-indigo-400 hover:text-indigo-300">privacy policy</a>
                        </label>
                      </div>
                      
                      <div className="pt-2">
                        <MagneticButton
                          type="submit"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            "Send Message"
                          )}
                        </MagneticButton>
                      </div>
                    </form>
                  )}
                </div>
                
                <div className="mt-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/30">
                  <h3 className="text-xl font-bold text-white mb-4">Emergency Support</h3>
                  <p className="text-gray-300 mb-6">For urgent issues with your current parking reservation, please call our 24/7 support line immediately.</p>
                  <a 
                    href="tel:+447444277110" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 magnetic"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Emergency Support
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Guides Section */}
          {activeTab === 'guides' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">
                Helpful <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Guides</span>
              </h2>
              
              <div className="mt-12 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Can't find what you're looking for?</h3>
                <p className="text-gray-300 mb-6">Our comprehensive knowledge base has answers to hundreds of questions about our services.</p>
                <MagneticButton className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20">
                  Visit Knowledge Base
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;