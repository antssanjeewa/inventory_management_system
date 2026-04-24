"use client";

import Breadcrumb from '@/components/Breadcrumb';
import InventoryForm from '../components/InventoryForm';

export default function CreateInventoryPage() {
    return (
        <div className="bg-background min-h-screen">
            <div className="mb-8">
                <Breadcrumb
                    pageTitle="Register New Item"
                    items={[
                        { label: "Inventory", href: "/inventory" },
                        { label: "Create", active: true }
                    ]}
                />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <InventoryForm />
            </div>
        </div>
    );
}
