"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    slug: "",
    isPublished: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({
        title: "",
        content: "",
        slug: "",
        isPublished: true,
      });
      fetchPosts();
    }
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({
        title: "",
        content: "",
        slug: "",
        isPublished: true,
      });
      setEditingId(null);
      fetchPosts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    const res = await fetch(`/api/blog/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchPosts();
    }
  };

  const startEditing = (post: BlogPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      slug: post.slug,
      isPublished: post.isPublished,
    });
    setEditingId(post._id);
  };

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_#39ff1310_0%,_transparent_50%)] animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="fixed inset-0 bg-[url(/grid.svg)] bg-center opacity-30" />
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_600px,_#39ff1305_0%,_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_600px,_#39ff1305_0%,_transparent_40%)]" />
      </div>

      <NavBar />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Create/Edit Form */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-[#39ff13]/10 mb-8">
              <h2 className="text-xl font-semibold text-[#39ff13] mb-6">
                {editingId ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full rounded-xl bg-black/40 border border-[#39ff13]/20 text-white px-4 py-2.5 focus:ring-2 focus:ring-[#39ff13]/50 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={8}
                      className="w-full rounded-xl bg-black/40 border border-[#39ff13]/20 text-white px-4 py-2.5 focus:ring-2 focus:ring-[#39ff13]/50 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="w-full rounded-xl bg-black/40 border border-[#39ff13]/20 text-white px-4 py-2.5 focus:ring-2 focus:ring-[#39ff13]/50 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPublished: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-[#39ff13]/20 text-[#39ff13] focus:ring-[#39ff13]/50"
                    />
                    <label className="ml-2 block text-sm text-gray-200">
                      Published
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  {editingId ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdate(editingId)}
                        className="px-6 py-2.5 bg-[#39ff13] text-black font-medium rounded-xl hover:bg-[#39ff13]/90 focus:outline-none focus:ring-2 focus:ring-[#39ff13]/50 focus:ring-offset-2 focus:ring-offset-black transition-colors"
                      >
                        Update Post
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            title: "",
                            content: "",
                            slug: "",
                            isPublished: true,
                          });
                        }}
                        className="px-6 py-2.5 bg-black/40 text-white font-medium rounded-xl hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#39ff13] text-black font-medium rounded-xl hover:bg-[#39ff13]/90 focus:outline-none focus:ring-2 focus:ring-[#39ff13]/50 focus:ring-offset-2 focus:ring-offset-black transition-colors"
                    >
                      Create Post
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Blog Posts List */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-[#39ff13]/10">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#39ff13] mb-6">
                  Existing Blog Posts
                </h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-[#39ff13]/20 border-t-[#39ff13] rounded-full animate-spin" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No blog posts found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <motion.div
                        key={post._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-[#39ff13]/10 hover:border-[#39ff13]/20 transition-colors"
                      >
                        <div>
                          <h3 className="text-white font-medium">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-lg ${
                              post.isPublished
                                ? "bg-[#39ff13]/10 text-[#39ff13]"
                                : "bg-yellow-400/10 text-yellow-400"
                            }`}
                          >
                            {post.isPublished ? "Published" : "Draft"}
                          </span>
                          <button
                            onClick={() => startEditing(post)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
