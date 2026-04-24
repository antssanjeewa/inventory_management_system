"use client";
import Link from 'next/link';
import React from 'react';

interface BreadcrumbProps {
    pageTitle: string;
    items: { label: string; href?: string; active?: boolean }[];
}

export default function Breadcrumb({ pageTitle, items }: BreadcrumbProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
            <nav className="flex mt-1 items-center text-outline text-[10px] tracking-widest uppercase font-bold">
                <Link href="/dashboard">Home</Link>
                {items.map((item, index) => (

                    <React.Fragment key={item.label}>
                        <span className="material-symbols-outlined text-[12px] mx-1">chevron_right</span>
                        <Link href={item.href || '#'}>
                            <span className={item.active ? 'text-primary' : ''}>{item.label}</span>
                        </Link>
                    </React.Fragment>
                ))}

            </nav>
        </div>
    );
}
