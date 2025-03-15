"use client";

import { useState, useEffect, useRef } from "react";
import * as Fa from "react-icons/fa";
import * as Si from "react-icons/si";
import * as Bs from "react-icons/bs";
import "@/app/globals.css";
import { IconType } from "react-icons";

interface IconPickerProps {
  onSelect: (icon: IconType) => void;
  iconComponents: Record<string, any>;
  selectedIcon?: IconType;
}

export default function IconPicker({
  onSelect,
  iconComponents,
  selectedIcon,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (pickerRef.current && isOpen) {
        const rect = pickerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 300; // Approximate height of dropdown

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          // Position above if not enough space below
          setPosition({ top: -dropdownHeight - 10, left: 0 });
        } else {
          // Position below
          setPosition({ top: rect.height + 10, left: 0 });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    if (isOpen) {
      updatePosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const filteredIcons = Object.entries(iconComponents).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SelectedIcon = selectedIcon
    ? iconComponents[selectedIcon.toString()]
    : null;

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-black/40 hover:bg-black/50 rounded-xl flex items-center gap-2 text-white/80 border border-[#39ff13]/20"
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="w-5 h-5" />
            <span>{selectedIcon?.toString()}</span>
          </>
        ) : (
          "Select an icon"
        )}
      </button>

      {isOpen && (
        <div
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          className="fixed z-[9999] w-[calc(100%-2rem)] md:w-96 p-4 bg-black/95 backdrop-blur-xl rounded-xl border border-[#39ff13]/20 shadow-lg transform transition-all duration-200"
        >
          <div className="sticky top-0 bg-black/95 backdrop-blur-xl pb-4">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 rounded-lg text-white/80 placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#39ff13]/50 border border-[#39ff13]/20"
              autoFocus
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-4 gap-2">
              {filteredIcons.map(([name, Icon]) => (
                <button
                  key={name}
                  onClick={() => {
                    onSelect(Icon as IconType);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-lg hover:bg-[#39ff13]/10 flex items-center justify-center transition-colors ${
                    selectedIcon?.toString() === name ? "bg-[#39ff13]/20" : ""
                  }`}
                >
                  <Icon className="w-5 h-5 text-white/80" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
