"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
    id: string | number;
    label: string;
    subLabel?: string;
    searchValue: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    onSearchChange?: (search: string) => void;
    loading?: boolean;
    placeholder?: string;
    label?: string;
    className?: string;
    required?: boolean;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    onSearchChange,
    loading = false,
    placeholder = "Select an item",
    label,
    className = "",
    required = false
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = onSearchChange
        ? options
        : options.filter(opt =>
            opt.searchValue.toLowerCase().includes(search.toLowerCase())
        );

    const selectedOption = options.find(opt => opt.id == value);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        if (onSearchChange) {
            onSearchChange(val);
        }
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        onChange(option.id);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-[11px] font-black text-outline uppercase tracking-widest mb-1.5 block">
                    {label}
                </label>
            )}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all cursor-pointer flex justify-between items-center ${isOpen ? 'border-primary ring-1 ring-primary/20' : ''}`}
            >
                <span className={!selectedOption ? "text-outline" : "text-on-surface"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-outline-variant/30 bg-surface-container/50">
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-outline text-sm">search</span>
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search inventory..."
                                className="w-full bg-surface-container border border-outline-variant/50 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="max-h-[250px] overflow-y-auto custom-scrollbar relative">
                        {loading && (
                            <div className="absolute inset-0 bg-surface-container-lowest/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        )}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-primary/10 transition-colors flex flex-col gap-0.5 ${value == option.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                                >
                                    <span className={`font-medium ${value == option.id ? 'text-primary' : 'text-on-surface'}`}>
                                        {option.label}
                                    </span>
                                    {option.subLabel && (
                                        <span className="text-[10px] text-outline uppercase tracking-wider font-bold">
                                            {option.subLabel}
                                        </span>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <span className="material-symbols-outlined text-outline/30 text-4xl mb-2 block">inventory_2</span>
                                <p className="text-sm text-outline font-medium">No matching assets found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Real input for form validation if needed */}
            <input
                type="hidden"
                value={value}
                required={required}
                readOnly
            />
        </div>
    );
}
