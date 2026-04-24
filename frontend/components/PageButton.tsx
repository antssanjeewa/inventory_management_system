"use client";

interface PageButtonProps {
    label?: string | number;
    icon?: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export default function PageButton({ label, icon, active, disabled, onClick }: PageButtonProps) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm font-bold transition-all
            ${active ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' :
                    disabled ? 'border-outline-variant text-outline-variant opacity-30 cursor-not-allowed' :
                        'border-outline-variant text-outline hover:bg-surface-bright hover:text-on-surface'}`}
        >
            {icon ? <span className="material-symbols-outlined text-lg">{icon}</span> : label}
        </button>
    );
}
