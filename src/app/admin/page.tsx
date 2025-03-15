"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Stats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
}

interface Link {
  _id: string;
  title: string;
  url: string;
  icon: string;
  clicks: number;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
  });
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      fetchData(user);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchData = async (user: any) => {
    try {
      const token = await user.getIdToken();
      const [statsRes, linksRes] = await Promise.all([
        fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/links", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (statsRes.ok && linksRes.ok) {
        const [statsData, linksData] = await Promise.all([
          statsRes.json(),
          linksRes.json(),
        ]);
        setStats(statsData);
        setLinks(linksData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewLink = () => {
    router.push("/admin/links/");
  };

  const handleEditLink = (linkId: string) => {
    router.push(`/admin/links/edit/${linkId}`);
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) {
      return;
    }

    setIsDeleting(linkId);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setLinks((prevLinks) =>
          prevLinks.filter((link) => link._id !== linkId)
        );
        setStats((prevStats) => ({
          ...prevStats,
          totalLinks: prevStats.totalLinks - 1,
          activeLinks:
            prevStats.activeLinks -
            (links.find((l) => l._id === linkId)?.isPublished ? 1 : 0),
        }));
      } else {
        alert("Failed to delete link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("Failed to delete link");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleTogglePublish = async (
    linkId: string,
    currentStatus: boolean
  ) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/links/${linkId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (res.ok) {
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link._id === linkId
              ? { ...link, isPublished: !currentStatus }
              : link
          )
        );
        setStats((prevStats) => ({
          ...prevStats,
          activeLinks: prevStats.activeLinks + (currentStatus ? -1 : 1),
        }));
      }
    } catch (error) {
      console.error("Error toggling link status:", error);
      alert("Failed to update link status");
    }
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
            className="mb-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-[#39ff13]/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400">Total Links</h3>
                  <span className="text-[#39ff13] text-2xl font-bold">
                    {stats.totalLinks}
                  </span>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-[#39ff13]/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400">Total Clicks</h3>
                  <span className="text-[#39ff13] text-2xl font-bold">
                    {stats.totalClicks}
                  </span>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-[#39ff13]/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400">Active Links</h3>
                  <span className="text-[#39ff13] text-2xl font-bold">
                    {stats.activeLinks}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Links</h2>
              <button
                onClick={handleAddNewLink}
                className="px-4 py-2 rounded-lg bg-[#39ff13] text-black font-medium hover:bg-[#39ff13]/90 transition-colors"
              >
                Add New Link
              </button>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-[#39ff13]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#39ff13]/10">
                      <th className="text-left p-4 text-gray-400 font-medium">
                        Title
                      </th>
                      <th className="text-left p-4 text-gray-400 font-medium">
                        URL
                      </th>
                      <th className="text-left p-4 text-gray-400 font-medium">
                        Clicks
                      </th>
                      <th className="text-left p-4 text-gray-400 font-medium">
                        Status
                      </th>
                      <th className="text-left p-4 text-gray-400 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-400"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : links.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-400"
                        >
                          No links found
                        </td>
                      </tr>
                    ) : (
                      links.map((link) => (
                        <tr
                          key={link._id}
                          className="border-b border-[#39ff13]/10"
                        >
                          <td className="p-4 text-white">{link.title}</td>
                          <td className="p-4 text-gray-400 truncate max-w-xs">
                            {link.url}
                          </td>
                          <td className="p-4 text-[#39ff13]">{link.clicks}</td>
                          <td className="p-4">
                            <button
                              onClick={() =>
                                handleTogglePublish(link._id, link.isPublished)
                              }
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                link.isPublished
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              } transition-colors`}
                            >
                              {link.isPublished ? "Active" : "Draft"}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditLink(link._id)}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                <svg
                                  className="w-5 h-5 text-gray-400 hover:text-white"
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
                                onClick={() => handleDeleteLink(link._id)}
                                disabled={isDeleting === link._id}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                              >
                                {isDeleting === link._id ? (
                                  <div className="w-5 h-5 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                                ) : (
                                  <svg
                                    className="w-5 h-5 text-gray-400 hover:text-red-500"
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
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
