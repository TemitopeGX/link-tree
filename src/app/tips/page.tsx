"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

interface Tip {
  _id: string;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    "Development",
    "Design",
    "Productivity",
    "Career",
    "Other",
  ];

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await fetch("/api/tips");
        if (res.ok) {
          const data = await res.json();
          setTips(data.filter((tip: Tip) => tip.isPublished));
        }
      } catch (error) {
        console.error("Failed to fetch tips:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, []);

  const filteredTips = tips.filter(
    (tip) => selectedCategory === "all" || tip.category === selectedCategory
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-black to-[#39ff13]/20">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <NavBar />

      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-[#39ff13] sm:text-5xl mb-8"
          >
            Tips & Tricks
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-[#39ff13] text-black"
                    : "bg-black/50 text-gray-300 hover:bg-black/70 hover:text-[#39ff13]"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-black/50 backdrop-blur-lg rounded-xl p-6 animate-pulse"
                >
                  <div className="h-8 bg-[#39ff13]/10 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-[#39ff13]/10 rounded w-1/4 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#39ff13]/10 rounded w-full"></div>
                    <div className="h-4 bg-[#39ff13]/10 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredTips.map((tip, index) => (
                <motion.article
                  key={tip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-[#39ff13]/20 hover:bg-black/70 transition-all group"
                >
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#39ff13]/10 text-[#39ff13] mb-4">
                    {tip.category}
                  </span>
                  <h2 className="text-xl font-semibold text-white group-hover:text-[#39ff13] transition-colors mb-2">
                    {tip.title}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    {new Date(tip.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-300">{tip.content}</p>
                </motion.article>
              ))}

              {filteredTips.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 md:col-span-2"
                >
                  <p className="text-gray-400 text-lg">
                    No tips available in this category yet.
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
