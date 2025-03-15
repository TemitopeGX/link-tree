"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.filter((post: BlogPost) => post.isPublished));
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
            className="text-4xl font-bold tracking-tight text-[#39ff13] sm:text-5xl mb-12"
          >
            Blog Posts
          </motion.h1>

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
            <div className="space-y-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-[#39ff13]/20 hover:bg-black/70 transition-all group"
                >
                  <h2 className="text-2xl font-semibold text-white group-hover:text-[#39ff13] transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <motion.a
                    href={`/blog/${post.slug}`}
                    whileHover={{ x: 4 }}
                    className="inline-flex items-center text-[#39ff13] hover:text-[#39ff13]/80"
                  >
                    Read more
                    <svg
                      className="w-4 h-4 ml-2"
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
                  </motion.a>
                </motion.article>
              ))}

              {posts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-400 text-lg">
                    No blog posts available yet.
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
