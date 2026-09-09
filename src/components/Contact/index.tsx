"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { MessageSquare, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields before sending.");
      return;
    }

    setIsSubmitted(true);
    toast.success("Thank you! Your message has been received. We will reply within 1–6 hours.");
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 sm:px-6">
      <div className="max-w-[1040px] mx-auto">
        {/* Page Header (Exact 2S Store replica) */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight mb-3">
            Contact Gloria Times
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl mx-auto">
            Your satisfaction is our priority. We reply within 1–6 hours.
          </p>
        </div>

        {/* 3 Contact Support Cards (Exact 2S Store Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Card 1: WhatsApp Support */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition duration-200">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <svg
                className="w-7 h-7 text-black fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <circle cx="8.5" cy="10" r="1" fill="currentColor" />
                <circle cx="12" cy="10" r="1" fill="currentColor" />
                <circle cx="15.5" cy="10" r="1" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-950 mb-4">
              WhatsApp Support
            </h3>
            <a
              href="https://wa.me/923257982233?text=Assalam%20o%20Alaikum%20Gloria%20Times%2C%20I%20have%20an%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-2.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm tracking-wide transition duration-200 shadow-sm"
            >
              Chat Now
            </a>
          </div>

          {/* Card 2: Email Support */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition duration-200">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <svg
                className="w-7 h-7 text-gray-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                <circle cx="12" cy="11" r="2" fill="#ef4444" stroke="none" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-950 mb-1">
              Email Support
            </h3>
            <a
              href="mailto:support@gloriatimes.com"
              className="text-xs sm:text-sm text-gray-600 hover:text-black hover:underline transition font-medium mt-1"
            >
              support@gloriatimes.com
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition duration-200">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <svg
                className="w-7 h-7 text-red-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-950 mb-1">
              Location
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
              Near UMT, PIA Road, Johar Town, Lahore, Pakistan
            </p>
          </div>
        </div>

        {/* Send Us A Message Form (Exact 2S Store Layout) */}
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 text-center mb-8 tracking-tight">
            Send us a message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full px-4 py-3.5 rounded-lg border border-gray-200 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black bg-white transition shadow-sm"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="w-full px-4 py-3.5 rounded-lg border border-gray-200 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black bg-white transition shadow-sm"
              />
            </div>

            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                rows={5}
                required
                className="w-full px-4 py-3.5 rounded-lg border border-gray-200 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black bg-white resize-none transition shadow-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-3.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-sm tracking-wide transition duration-200 shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>

          {isSubmitted && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-semibold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been sent successfully. We will reply to your email shortly.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
