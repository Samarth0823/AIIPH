'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="text-center px-6 md:px-12 lg:px-24"
      >
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to AI Interview Prep Hub</h1>
        <p className="mt-4 text-lg text-gray-600">Prepare for your dream job interviews with AI-powered question generation, video analysis, and personalized feedback.</p>
        <button 
          onClick={() => router.push('/dashboard')} 
          className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Get Started
        </button>
      </motion.div>

      {/* How It Works */}
      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="mt-16 text-center max-w-4xl"
      >
        <h2 className="text-3xl font-semibold">How It Works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Enter Job Details', desc: 'Provide job title, description, and experience level.' },
            { step: '2', title: 'Answer AI Questions', desc: 'AI generates relevant questions, and you record video responses.' },
            { step: '3', title: 'Get AI Feedback', desc: 'AI evaluates your answer, voice, and body language.' },
          ].map((item, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="p-6 bg-gray-100 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-blue-600">Step {item.step}</h3>
              <p className="mt-2 font-medium">{item.title}</p>
              <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="mt-16 text-center max-w-5xl"
      >
        <h2 className="text-3xl font-semibold">Features</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            'AI-Powered Question Generation',
            'Video Analysis',
            'Voice & Body Language Feedback',
            'Track Past Mock Interviews',
          ].map((feature, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="p-6 bg-gray-100 rounded-xl shadow-md">
              <p className="font-medium">{feature}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-16 py-6 bg-gray-100 text-black w-full text-center">
        <p>&copy; {new Date().getFullYear()} AI Interview Prep Hub. All rights reserved.</p>
      </div>
    </div>
  );
}
