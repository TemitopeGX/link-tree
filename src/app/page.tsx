"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import ParticleBackground from "@/components/ParticleBackground";
import MouseTrail from "@/components/MouseTrail";
import Image from "next/image";
import * as Fa from "react-icons/fa";
import * as Si from "react-icons/si";
import * as Bs from "react-icons/bs";

interface Link {
  _id: string;
  title: string;
  url: string;
  icon: string;
  clicks: number;
}

// Icon mapping object - same as admin page
const iconComponents = {
  // Social Media
  FaGithub: Fa.FaGithub,
  FaTwitter: Fa.FaTwitter,
  FaLinkedin: Fa.FaLinkedin,
  FaInstagram: Fa.FaInstagram,
  FaYoutube: Fa.FaYoutube,
  FaTwitch: Fa.FaTwitch,
  FaDiscord: Fa.FaDiscord,
  FaTiktok: Fa.FaTiktok,

  // Development
  FaCode: Fa.FaCode,
  SiGithub: Si.SiGithub,
  SiVercel: Si.SiVercel,
  SiNetlify: Si.SiNetlify,
  SiReact: Si.SiReact,
  SiNextdotjs: Si.SiNextdotjs,
  SiTypescript: Si.SiTypescript,
  SiJavascript: Si.SiJavascript,

  // General
  FaLink: Fa.FaLink,
  FaEnvelope: Fa.FaEnvelope,
  FaGlobe: Fa.FaGlobe,
  BsPersonFill: Bs.BsPersonFill,
  FaBook: Fa.FaBook,
  FaBlog: Fa.FaBlog,
};

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch("/api/links");
        console.log("API Response status:", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error("API Error:", errorData);
          throw new Error(
            `API returned ${res.status}: ${errorData.error || "Unknown error"}`
          );
        }

        const data = await res.json();
        console.log("Fetched links data:", data);
        setLinks(data);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      }
    };

    fetchLinks();
  }, []);

  const handleLinkClick = async (id: string, url: string) => {
    try {
      await fetch(`/api/links/${id}`, {
        method: "PATCH",
      });
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to update click count:", error);
      window.open(url, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <ParticleBackground />
      <MouseTrail />

      {/* Enhanced animated background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#39ff1310_0%,_transparent_50%)] animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <NavBar />

      <div className="relative">
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-6 sm:px-6 sm:pt-24 sm:pb-12 lg:px-8">
          <div className="max-w-2xl mx-auto mb-8 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Enhanced profile image with floating effect */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto mb-4 sm:mb-8"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#39ff13] to-[#39ff13]/30 animate-[pulse_4s_ease-in-out_infinite] blur-xl opacity-50" />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative rounded-full border-2 border-[#39ff13] overflow-hidden"
                >
                  <Image
                    src="/profile.jpg"
                    alt="TemitopeGX"
                    width={160}
                    height={160}
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Enhanced title with glowing effect */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 relative"
              >
                <span className="text-white">Temitope</span>
                <span className="text-[#39ff13] relative">
                  GX
                  <span className="absolute inset-0 blur-lg text-[#39ff13] opacity-50">
                    GX
                  </span>
                </span>
              </motion.h1>

              {/* Enhanced bio card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 backdrop-blur-xl rounded-xl p-4 mb-6 border border-[#39ff13]/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#39ff13]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-sm sm:text-base text-gray-300">
                  Hi, I'm TemitopeGX, a professional graphic designer, web
                  designer, and live event streamer.
                </p>
              </motion.div>

              {/* Enhanced action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center justify-center gap-3 sm:gap-4"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://temitopegx1.vercel.app/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 text-sm sm:text-base rounded-full bg-[#39ff13] text-black font-medium hover:bg-[#39ff13]/90 transition-colors relative group"
                >
                  <span className="relative z-10">Contact Me</span>
                  <div className="absolute inset-0 rounded-full bg-[#39ff13] blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="px-6 py-2.5 text-sm sm:text-base rounded-full bg-black/40 backdrop-blur-xl border border-[#39ff13]/20 text-white font-medium hover:bg-black/60 transition-colors relative group"
                >
                  <span className="relative z-10">Download CV</span>
                  <div className="absolute inset-0 rounded-full bg-[#39ff13]/10 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced links section */}
          <div className="space-y-3 max-w-lg mx-auto px-0 sm:px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl font-bold text-white mb-4 relative inline-block"
            >
              Links & Resources
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#39ff13]/0 via-[#39ff13] to-[#39ff13]/0" />
            </motion.h2>

            {/* Enhanced link cards */}
            {links.map((link, index) => {
              const IconComponent =
                iconComponents[link.icon as keyof typeof iconComponents] ||
                Fa.FaLink;
              return (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    rotateX: 2,
                    rotateY: 2,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLinkClick(link._id, link.url)}
                  className="group relative bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-[#39ff13]/10 cursor-pointer overflow-hidden transform perspective-1000"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#39ff13]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#39ff13]/0 via-[#39ff13]/5 to-[#39ff13]/0" />
                  </div>
                  <div className="flex items-center space-x-4 relative">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-[#39ff13]/5 text-[#39ff13] group-hover:bg-[#39ff13]/10 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#39ff13] transition-colors">
                        {link.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">
                        {link.url}
                      </p>
                    </div>
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ x: 4 }}
                      animate={{
                        x: [0, 4, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-[#39ff13] transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
