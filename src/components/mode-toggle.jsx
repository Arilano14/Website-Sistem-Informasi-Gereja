import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-[#F7F9FC] dark:hover:bg-[#262626] transition-colors relative"
                aria-label="Toggle theme"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#475569] dark:text-white dark:text-opacity-70" />
                <Moon className="absolute top-2 left-2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#475569] dark:text-white dark:text-opacity-70" />
                <span className="sr-only">Toggle theme</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-[#1E1E1E] rounded-lg shadow-lg border border-[#E5E9F0] dark:border-[#404040] py-2 z-50">
                    <button
                        onClick={() => {
                            setTheme("light");
                            setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors text-left ${theme === "light"
                                ? "bg-gray-100 dark:bg-[#2A2A2A] text-[#1F2937] dark:text-white"
                                : "text-[#475569] dark:text-white dark:text-opacity-70 hover:bg-[#F7F9FC] dark:hover:bg-[#262626]"
                            }`}
                    >
                        Light
                    </button>
                    <button
                        onClick={() => {
                            setTheme("dark");
                            setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors text-left ${theme === "dark"
                                ? "bg-gray-100 dark:bg-[#2A2A2A] text-[#1F2937] dark:text-white"
                                : "text-[#475569] dark:text-white dark:text-opacity-70 hover:bg-[#F7F9FC] dark:hover:bg-[#262626]"
                            }`}
                    >
                        Dark
                    </button>
                    <button
                        onClick={() => {
                            setTheme("system");
                            setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors text-left ${theme === "system"
                                ? "bg-gray-100 dark:bg-[#2A2A2A] text-[#1F2937] dark:text-white"
                                : "text-[#475569] dark:text-white dark:text-opacity-70 hover:bg-[#F7F9FC] dark:hover:bg-[#262626]"
                            }`}
                    >
                        System
                    </button>
                </div>
            )}
            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
