"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import * as Fa from "react-icons/fa";
import * as Si from "react-icons/si";
import * as Bs from "react-icons/bs";
import dynamic from "next/dynamic";
import "@/app/globals.css";

const IconPicker = dynamic(() => import("@/components/IconPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-10 bg-black/40 rounded-xl animate-pulse" />
  ),
});

interface Link {
  _id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

// Icon mapping object
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
  FaFacebook: Fa.FaFacebook,
  FaWhatsapp: Fa.FaWhatsapp,
  FaTelegram: Fa.FaTelegram,
  FaSnapchat: Fa.FaSnapchat,
  FaPinterest: Fa.FaPinterest,
  FaReddit: Fa.FaReddit,
  FaMedium: Fa.FaMedium,
  FaSpotify: Fa.FaSpotify,
  FaSoundcloud: Fa.FaSoundcloud,
  FaPatreon: Fa.FaPatreon,
  FaEtsy: Fa.FaEtsy,

  // Development
  FaCode: Fa.FaCode,
  SiGithub: Si.SiGithub,
  SiVercel: Si.SiVercel,
  SiNetlify: Si.SiNetlify,
  SiReact: Si.SiReact,
  SiNextdotjs: Si.SiNextdotjs,
  SiTypescript: Si.SiTypescript,
  SiJavascript: Si.SiJavascript,
  SiPython: Si.SiPython,
  SiPhp: Si.SiPhp,
  SiRuby: Si.SiRuby,
  SiCplusplus: Si.SiCplusplus,
  FaTerminal: Fa.FaTerminal,
  SiSwift: Si.SiSwift,
  SiKotlin: Si.SiKotlin,
  SiRust: Si.SiRust,
  SiGo: Si.SiGo,
  SiDart: Si.SiDart,
  SiFlutter: Si.SiFlutter,
  SiAngular: Si.SiAngular,
  SiVuedotjs: Si.SiVuedotjs,
  SiTailwindcss: Si.SiTailwindcss,
  SiBootstrap: Si.SiBootstrap,
  SiSass: Si.SiSass,
  SiMongodb: Si.SiMongodb,
  SiPostgresql: Si.SiPostgresql,
  SiMysql: Si.SiMysql,
  SiRedis: Si.SiRedis,
  SiDocker: Si.SiDocker,
  SiKubernetes: Si.SiKubernetes,
  SiAmazon: Si.SiAmazon,
  SiGooglecloud: Si.SiGooglecloud,
  FaCloudUploadAlt: Fa.FaCloudUploadAlt,
  SiFirebase: Si.SiFirebase,
  SiHeroku: Si.SiHeroku,
  SiDigitalocean: Si.SiDigitalocean,

  // General
  FaLink: Fa.FaLink,
  FaEnvelope: Fa.FaEnvelope,
  FaGlobe: Fa.FaGlobe,
  BsPersonFill: Bs.BsPersonFill,
  FaBook: Fa.FaBook,
  FaBlog: Fa.FaBlog,
  FaGamepad: Fa.FaGamepad,
  FaMusic: Fa.FaMusic,
  FaVideo: Fa.FaVideo,
  FaCamera: Fa.FaCamera,
  FaPalette: Fa.FaPalette,
  FaPencilAlt: Fa.FaPencilAlt,
  FaShoppingCart: Fa.FaShoppingCart,
  FaStore: Fa.FaStore,
  FaWallet: Fa.FaWallet,
  FaChartLine: Fa.FaChartLine,
  FaNewspaper: Fa.FaNewspaper,
  FaCalendar: Fa.FaCalendar,
  FaMapMarker: Fa.FaMapMarker,
  FaPhone: Fa.FaPhone,
  FaHeadphones: Fa.FaHeadphones,
  FaMicrophone: Fa.FaMicrophone,
  FaDesktop: Fa.FaDesktop,
  FaMobile: Fa.FaMobile,
  FaTablet: Fa.FaTablet,
  FaCloud: Fa.FaCloud,
  FaServer: Fa.FaServer,
  FaDatabase: Fa.FaDatabase,
  FaCog: Fa.FaCog,
  FaTools: Fa.FaTools,
  FaLock: Fa.FaLock,
  FaShieldAlt: Fa.FaShieldAlt,
  FaStar: Fa.FaStar,
  FaHeart: Fa.FaHeart,
  FaThumbsUp: Fa.FaThumbsUp,
  FaComment: Fa.FaComment,
  FaShare: Fa.FaShare,
  FaDownload: Fa.FaDownload,
  FaUpload: Fa.FaUpload,
  FaSync: Fa.FaSync,
  FaSearch: Fa.FaSearch,
  FaFilter: Fa.FaFilter,
  FaSort: Fa.FaSort,
  FaPlus: Fa.FaPlus,
  FaMinus: Fa.FaMinus,
  FaTimes: Fa.FaTimes,
  FaCheck: Fa.FaCheck,
  FaInfo: Fa.FaInfo,
  FaQuestion: Fa.FaQuestion,
  FaExclamation: Fa.FaExclamation,
};

export default function AdminLinksContent() {
  const [links, setLinks] = useState<Link[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    icon: "FaLink",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await handleUpdate(editingId);
      } else {
        const res = await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setFormData({
            title: "",
            url: "",
            icon: "FaLink",
          });
          fetchLinks();
        } else {
          console.error("Failed to create link:", await res.text());
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      console.log("Sending update with data:", formData);
      const res = await fetch(`/api/links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Failed to update link:", errorData);
        throw new Error(`Failed to update link: ${errorData}`);
      }

      const updatedLink = await res.json();
      console.log("Link updated successfully:", updatedLink);

      setFormData({
        title: "",
        url: "",
        icon: "FaLink",
      });
      setEditingId(null);
      fetchLinks();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchLinks();
      } else {
        console.error("Failed to delete link:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const startEditing = (link: Link) => {
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon || "FaLink",
    });
    setEditingId(link._id);
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
                {editingId ? "Edit Link" : "Create New Link"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      className="w-full rounded-xl bg-black/40 border border-[#39ff13]/20 text-white px-4 py-2.5 focus:ring-2 focus:ring-[#39ff13]/50 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Icon
                    </label>
                    <IconPicker
                      onSelect={(iconName) => {
                        setFormData({ ...formData, icon: iconName });
                      }}
                      iconComponents={iconComponents}
                      selectedIcon={formData.icon}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  {editingId ? (
                    <>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#39ff13] text-black font-medium rounded-xl hover:bg-[#39ff13]/90 focus:outline-none focus:ring-2 focus:ring-[#39ff13]/50 focus:ring-offset-2 focus:ring-offset-black transition-colors"
                      >
                        Update Link
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            title: "",
                            url: "",
                            icon: "FaLink",
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
                      Create Link
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Links List */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-[#39ff13]/10">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#39ff13] mb-6">
                  Existing Links
                </h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-[#39ff13]/20 border-t-[#39ff13] rounded-full animate-spin" />
                  </div>
                ) : links.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No links found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {links.map((link) => {
                      const LinkIcon =
                        iconComponents[
                          link.icon as keyof typeof iconComponents
                        ] || Fa.FaLink;
                      return (
                        <motion.div
                          key={link._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-[#39ff13]/10 hover:border-[#39ff13]/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-[#39ff13] w-8 h-8 flex items-center justify-center rounded-lg bg-[#39ff13]/10">
                              <LinkIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">
                                {link.title}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-400">
                                  {new Date(
                                    link.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-[#39ff13]">
                                  {link.clicks} clicks
                                </span>
                              </div>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 mt-1 block"
                              >
                                {link.url}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditing(link)}
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
                              onClick={() => handleDelete(link._id)}
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
                      );
                    })}
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
