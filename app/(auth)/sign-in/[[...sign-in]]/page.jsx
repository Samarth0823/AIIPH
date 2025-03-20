'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useCallback } from 'react';

export default function AuthPage() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          particles: {
            number: { value: 100, density: { enable: true, area: 800 } },
            color: { value: ["#3B82F6", "#2563EB", "#1E40AF"] }, // Deeper blue shades
            shape: { type: "circle" },
            opacity: { 
              value: 0.7, // Increased from 0.4 to 0.7
              random: true, 
              anim: { enable: true, speed: 0.3, opacity_min: 0.2, sync: false } 
            },
            size: { 
              value: 5, // Slightly larger
              random: true, 
              anim: { enable: true, speed: 2, size_min: 0.4, sync: false } 
            },
            move: { enable: true, speed: 0.7, direction: "none", random: false, straight: false, outModes: "out" },
            links: { 
              enable: true, 
              distance: 140, 
              color: "#2563EB", 
              opacity: 0.5, // Increased from 0.2 to 0.5
              width: 1.2 // Slightly thicker
            },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" } },
            modes: { repulse: { distance: 130, duration: 0.5 }, push: { quantity: 5 } },
          }
        }}
        className="absolute inset-0 w-full h-full"
      />

      {/* Main Content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-lg w-full bg-white/50 backdrop-blur-lg shadow-xl rounded-2xl p-8 sm:p-12 border border-gray-200">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <svg className="h-12 w-12 text-blue-600" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="12" r="10" fill="currentColor" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl text-center">
          Welcome to AI Interview Prep Hub
        </h1>
        <p className="mt-4 text-gray-600 text-center">
          Practice and refine your interview skills with AI-powered insights.
        </p>

        {/* Sign-In Component */}
        <div className="mt-8">
          <SignIn className="w-full" />
        </div>
      </motion.div>
    </section>
  );
}
