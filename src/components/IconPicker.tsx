"use client";

import { useState, useEffect, useRef } from "react";
import * as Fa from "react-icons/fa";
import * as Si from "react-icons/si";
import * as Bs from "react-icons/bs";
import "@/app/globals.css";
import { IconType } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";

interface IconPickerProps {
  onSelect: (iconName: string) => void;
  iconComponents: Record<string, IconType>;
  selectedIcon?: string;
}

export default function IconPicker({
  onSelect,
  iconComponents,
  selectedIcon,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const filteredIcons = Object.entries(iconComponents).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SelectedIcon = selectedIcon ? iconComponents[selectedIcon] : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#39ff13]"
      >
        {SelectedIcon ? (
          <SelectedIcon className="w-5 h-5" />
        ) : (
          <span>Select Icon</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            />

            {/* Modal */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90vw] sm:max-w-2xl sm:h-auto max-h-[90vh] bg-gray-800 rounded-2xl shadow-xl z-[10000] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  Select an Icon
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39ff13] pl-10"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Icons Grid */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {filteredIcons.map(([name, Icon]) => (
                    <button
                      key={name}
                      onClick={() => {
                        onSelect(name);
                        handleClose();
                      }}
                      className={`p-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#39ff13] transition-colors group relative ${
                        selectedIcon === name
                          ? "bg-gray-700 ring-2 ring-[#39ff13]"
                          : ""
                      }`}
                    >
                      <Icon className="w-5 h-5 text-gray-200 group-hover:text-[#39ff13] transition-colors" />
                      <div className="absolute inset-x-0 bottom-0 p-1 bg-gray-900/90 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-gray-300 truncate text-center">
                          {name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
