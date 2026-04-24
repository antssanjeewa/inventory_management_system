"use client";
import Link from 'next/link';
import React from 'react';

interface BreadcrumbProps {
    pageTitle: string;
    items: { label: string; active?: boolean }[];
}

export default function Breadcrumb({ pageTitle, items }: BreadcrumbProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
            <nav className="flex mt-1 items-center text-outline text-[10px] tracking-widest uppercase font-bold">
                <Link href="/">Home</Link>
                <span className="material-symbols-outlined text-[12px] mx-1">chevron_right</span>
                {items.map((item, index) => (
                    <React.Fragment key={item.label}>
                        <span className={item.active ? 'text-primary' : ''}>{item.label}</span>
                        {index < items.length - 1 && (
                            <span className="material-symbols-outlined text-[12px] mx-1">chevron_right</span>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </div>
    );
}
