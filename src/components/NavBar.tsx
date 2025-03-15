"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import * as Fa from "react-icons/fa";

export default function NavBar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });

    return () => unsubscribe();
  }, []);

  const publicNavItems = [
    { name: "Home", path: "/", icon: <Fa.FaHome className="w-5 h-5" /> },
    { name: "Blog", path: "/blog", icon: <Fa.FaBlog className="w-5 h-5" /> },
    {
      name: "Tips",
      path: "/tips",
      icon: <Fa.FaLightbulb className="w-5 h-5" />,
    },
    {
      name: "News",
      path: "/news",
      icon: <Fa.FaNewspaper className="w-5 h-5" />,
    },
  ];

  const adminNavItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <Fa.FaChartBar className="w-5 h-5" />,
    },
    {
      name: "Links",
      path: "/admin/links",
      icon: <Fa.FaLink className="w-5 h-5" />,
    },
    {
      name: "Blog Posts",
      path: "/admin/blog",
      icon: <Fa.FaBlog className="w-5 h-5" />,
    },
    {
      name: "Tips",
      path: "/admin/tips",
      icon: <Fa.FaLightbulb className="w-5 h-5" />,
    },
    {
      name: "News",
      path: "/admin/news",
      icon: <Fa.FaNewspaper className="w-5 h-5" />,
    },
  ];

  // Use admin items if we're in the admin section, otherwise use public items
  const isAdminSection = pathname.startsWith("/admin");
  const navItems = isAdminSection ? adminNavItems : publicNavItems;

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden sm:block ${
          isAdminSection
            ? "w-[95%] max-w-7xl bg-black/40 backdrop-blur-xl border border-[#39ff13]/10"
            : "bg-black/20 backdrop-blur-xl border border-white/10"
        } rounded-2xl px-4`}
      >
        <div className="flex items-center h-16 justify-between">
          <Link
            href="/"
            className="relative px-4 py-1.5 text-base font-medium hover:opacity-80 transition-colors"
          >
            <span className="text-white">Temitope</span>
            <span className="text-[#39ff13]">GX</span>
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-4 py-2 rounded-xl transition-all ${
                    isAdminSection ? "hover:bg-white/5" : ""
                  }`}
                >
                  <span
                    className={`relative z-10 text-sm font-medium ${
                      isActive
                        ? isAdminSection
                          ? "text-[#39ff13]"
                          : "text-black"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && !isAdminSection && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-[#39ff13] rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {isActive && isAdminSection && (
                    <motion.div
                      layoutId="navbar-active-admin"
                      className="absolute inset-0 bg-[#39ff13]/10 rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            {!isAdminSection && (
              <Link
                href="https://github.com/yourusername/yourrepo"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 hover:bg-black/40 border border-[#39ff13]/20 hover:border-[#39ff13]/40 transition-all"
                aria-label="View project source code on GitHub"
              >
                <svg
                  className="w-5 h-5 text-[#39ff13]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                <span className="text-sm font-medium text-[#39ff13] group-hover:text-[#39ff13]">
                  Source
                </span>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/80 border border-[#39ff13]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <p className="text-xs text-white whitespace-nowrap">
                    View project on GitHub
                  </p>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-black/80 border-t border-l border-[#39ff13]/20"></div>
                </div>
              </Link>
            )}
            {isAdmin && (
              <>
                {!isAdminSection && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 rounded-xl bg-black/20 hover:bg-black/40 border border-[#39ff13]/20 hover:border-[#39ff13]/40 transition-all"
                  >
                    <span className="text-sm font-medium text-[#39ff13]">
                      Dashboard
                    </span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-black/20 hover:bg-black/40 border border-red-500/20 hover:border-red-500/40 transition-all"
                >
                  <span className="text-sm font-medium text-red-500">
                    Logout
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed bottom-0 left-0 right-0 z-50 ${
          isAdminSection
            ? "bg-black/40 border-[#39ff13]/10"
            : "bg-black/20 border-white/10"
        } backdrop-blur-xl border-t sm:hidden`}
      >
        <div className="flex items-center h-16 justify-between px-4">
          <Link
            href="/"
            className="relative text-base font-medium hover:opacity-80 transition-colors"
          >
            <span className="text-white">T</span>
            <span className="text-[#39ff13]">GX</span>
          </Link>
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-3 py-2 rounded-xl transition-all ${
                    isAdminSection ? "hover:bg-white/5" : ""
                  }`}
                >
                  <span
                    className={`relative z-10 text-sm font-medium ${
                      isActive
                        ? isAdminSection
                          ? "text-[#39ff13]"
                          : "text-black"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && !isAdminSection && (
                    <motion.div
                      layoutId="navbar-active-mobile"
                      className="absolute inset-0 bg-[#39ff13] rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {isActive && isAdminSection && (
                    <motion.div
                      layoutId="navbar-active-mobile-admin"
                      className="absolute inset-0 bg-[#39ff13]/10 rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center">
            {!isAdminSection && (
              <Link
                href="https://github.com/yourusername/yourrepo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#39ff13] hover:opacity-80 transition-all"
                aria-label="View project source code on GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="p-2 text-red-500 hover:opacity-80 transition-all"
              >
                <Fa.FaSignOutAlt className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.nav>
    </>
  );
}
