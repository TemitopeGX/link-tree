"use client";

import { useState, useEffect, useRef } from "react";
import * as Fa from "react-icons/fa";
import * as Si from "react-icons/si";
import * as Bs from "react-icons/bs";
import "@/app/globals.css";
import { IconType } from "react-icons";

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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const SelectedIcon = selectedIcon ? iconComponents[selectedIcon] : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {SelectedIcon ? (
          <SelectedIcon className="w-5 h-5" />
        ) : (
          <span>Select Icon</span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          className="fixed z-10 w-64 p-2 mt-2 bg-gray-800 rounded-lg shadow-lg custom-scrollbar overflow-y-auto max-h-60"
        >
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(iconComponents).map(([name, Icon]) => (
              <button
                key={name}
                onClick={() => {
                  onSelect(name);
                  setIsOpen(false);
                }}
                className={`p-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  selectedIcon === name ? "bg-gray-700" : ""
                }`}
              >
                <Icon className="w-5 h-5 text-gray-200" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
