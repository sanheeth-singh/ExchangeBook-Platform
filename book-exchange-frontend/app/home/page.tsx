"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import Link from "next/link";
// ✅ Import icons for the logged-in state
import { LayoutDashboard, LogOut } from "lucide-react"; 



export default function Home() {
  // ✅ 1. Add Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false); // Prevents Next.js hydration mismatch

  // ✅ 2. Check for token on load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ 3. Handle Logout directly from Home
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col overflow-hidden text-zinc-50">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-200 h-100 bg-zinc-800/30 blur-[120px] rounded-full pointer-events-none" />

      {/* --- START: UPDATED NAVBAR --- */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg font-bold text-xl">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Swappy
          </span>
        </div>

        {/* Dynamic Auth Buttons */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {mounted && (
            isLoggedIn ? (
              <>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>
      </nav>
      {/* --- END: UPDATED NAVBAR --- */}

      {/* Main Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Join the local reading community
            </span>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white">
              Read. Swap. <span className="text-zinc-500">Repeat.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed">
              Trade the books you’ve finished for the ones you want to read next. <br />
              B-Swappy is a sustainable, peer-to-peer library built for readers, by readers.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* If logged in, point CTA to dashboard, otherwise to register */}
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
            >
              {isLoggedIn ? "Go to Dashboard" : "Start Swapping"}
            </Link>
            <Link
              href="/home"
              className="w-full sm:w-auto bg-transparent border border-zinc-700 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-zinc-900 transition-colors"
            >
              Browse Books
            </Link>
          </motion.div>

        </motion.div>

        {/* ... (Keep the rest of your floating book animation code here) ... */}
        {/* Floating Animation Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-20 relative w-full max-w-md h-48 flex items-center justify-center"
        >
          {/* Left Book Card */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute left-10 md:left-20 w-32 h-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl z-10 flex flex-col justify-between p-3"
          >
            <div className="w-full h-20 bg-zinc-700 rounded-md" />
            <div className="space-y-2">
              <div className="w-3/4 h-2 bg-zinc-600 rounded" />
              <div className="w-1/2 h-2 bg-zinc-600 rounded" />
            </div>
          </motion.div>

          {/* Center Swap Icon */}
          <div className="absolute z-20 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
          </div>

          {/* Right Book Card */}
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-10 md:right-20 w-32 h-44 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-0 flex flex-col justify-between p-3 opacity-80"
          >
             <div className="w-full h-20 bg-zinc-800 rounded-md" />
            <div className="space-y-2">
              <div className="w-3/4 h-2 bg-zinc-700 rounded" />
              <div className="w-1/2 h-2 bg-zinc-700 rounded" />
            </div>
          </motion.div>
        </motion.div>

      </main>

      {/* --- START: HOW IT WORKS SECTION --- */}
      <section className="relative z-10 w-full bg-zinc-950 py-24 sm:py-32 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How B-Swappy Works
            </h2>
            <p className="text-zinc-400 text-lg">
              A simple, secure, and community-driven way to refresh your bookshelf without spending a dime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="text-5xl font-black text-zinc-800 absolute -top-4 -right-2 select-none group-hover:text-zinc-700 transition-colors">1</div>
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M12 8v6"/><path d="M9 11h6"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">List Your Books</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                 Add the books you&apos;ve already read to your public digital library.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="text-5xl font-black text-zinc-800 absolute -top-4 -right-2 select-none group-hover:text-zinc-700 transition-colors">2</div>
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Discover & Request</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Browse the local community&apos;s listings. When you find your next read, send an exchange request to the owner.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="text-5xl font-black text-zinc-800 absolute -top-4 -right-2 select-none group-hover:text-zinc-700 transition-colors">3</div>
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect & Chat</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Once they accept your request, a secure chat opens up so you can coordinate the details of the exchange.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="text-5xl font-black text-zinc-800 absolute -top-4 -right-2 select-none group-hover:text-zinc-700 transition-colors">4</div>
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9-3 3 3 3"/><path d="M14 4.5l4 4 4-4"/><path d="M18 8.5v11"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Swap & Read</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Meet up locally or arrange shipping. Hand over your old book, grab your new one, and start reading!
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* --- END: HOW IT WORKS SECTION --- */}

      {/* --- START: FEATURES BENTO BOX --- */}
      <section className="relative z-10 w-full bg-zinc-950 py-24 sm:py-32 border-t border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to swap seamlessly
            </h2>
            <p className="text-zinc-400 text-lg">
              We&apos;ve built the tools to make exchanging books as easy as handing them to a friend.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            
            {/* Feature 1: Smart Exchange Tracking (Spans 2 columns on desktop) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="relative z-10 md:w-3/5">
                <h3 className="text-2xl font-bold text-white mb-3">Smart Exchange Tracking</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Never wonder where your request stands. Watch your swap move from Pending, to Accepted, to Completed in real-time.
                </p>
              </div>
              
              {/* Decorative UI Mockup */}
              <div className="absolute -right-4 -bottom-4 w-full md:w-1/2 h-full flex items-end justify-end p-6 pointer-events-none">
                <div className="bg-zinc-950 border border-zinc-800 rounded-tl-xl p-5 w-full shadow-2xl transform translate-x-4 translate-y-4 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                      <span className="text-sm font-medium text-white">The Midnight Library</span>
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-800 opacity-60">
                      <span className="text-sm font-medium text-white">Atomic Habits</span>
                      <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">Accepted</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Integrated Chat */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3">Secure Chat</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Coordinate your meetup securely without giving out your personal phone number.
                </p>
              </div>
              
              {/* Decorative Chat Mockup */}
              <div className="mt-6 flex flex-col gap-3">
                <div className="self-start bg-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                  Hey! I accepted your request for Dune.
                </div>
                <div className="self-end bg-white text-black text-xs px-3 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                  Awesome! Meet at the campus library at 3?
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Library Management */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden hover:border-zinc-700 transition-colors"
            >
              <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-white mb-4 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M12 8v6"/><path d="M9 11h6"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Library Management</h3>
                <p className="text-zinc-400 text-sm">Easily add, edit, or remove books from your public profile in seconds.</p>
              </div>
            </motion.div>

            {/* Feature 4: Community Focus (Spans 2 columns) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 bg-linear-to-br from-zinc-900/80 to-zinc-900/20 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden hover:border-zinc-700 transition-colors"
            >
              {/* Optional: You can replace this SVG pattern with a transparent background image if you want a texture */}
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              
              <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold text-white mb-3">A Network of Readers</h3>
                <p className="text-zinc-400">
                  Built to connect students, budget readers, and local communities. Turn the books gathering dust on your shelf into your next great adventure.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      {/* --- END: FEATURES BENTO BOX --- */}

      {/* --- START: TECH STACK SECTION (Portfolio Flex) --- */}
      <section className="relative z-10 w-full bg-zinc-950 py-16 border-t border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-zinc-500 tracking-widest uppercase mb-8">
            Engineered for performance & security
          </p>
          
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto opacity-80">
            {[
              "Next.js 14", 
              "TypeScript", 
              "Framer Motion", 
              "FastAPI", 
              "Python", 
              "PostgreSQL", 
              "SQLAlchemy", 
              "JWT Auth"
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* --- END: TECH STACK SECTION --- */}

      {/* --- START: FINAL CTA SECTION --- */}
      <section className="relative z-10 w-full bg-zinc-950 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 sm:p-16 text-center"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-zinc-800/40 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Ready to refresh your bookshelf?
              </h2>
              <p className="text-xl text-zinc-400">
                Join B-Swappy today. Turn the books gathering dust on your shelf into your next great adventure.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-zinc-200 transition-transform active:scale-95"
                >
                  Create an Account
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto bg-transparent border border-zinc-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-zinc-800 transition-colors"
                >
                  Browse Library
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Simple Footer */}
        <footer className="mt-24 text-center border-t border-zinc-900 pt-8 pb-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} B-Swappy. Built by Bunny. All rights reserved.
          </p>
        </footer>
      </section>
      {/* --- END: FINAL CTA SECTION --- */}
      


    </div>

  


  );
}