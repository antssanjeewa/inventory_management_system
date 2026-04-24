"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import InventoryForm from '../../components/InventoryForm';
import { InventoryItem, getInventoryItem } from '@/services/InventoryService';
import { TableLoading } from '@/components/TableLoading';
import { showError } from '@/lib/alert';

export default function EditInventoryPage() {
    const params = useParams();
    const [item, setItem] = useState<InventoryItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadItem(parseInt(params.id as string));
        }
    }, [params.id]);

    const loadItem = async (id: number) => {
        try {
            setLoading(true);
            const data = await getInventoryItem(id);
            setItem(data);
        } catch (error: any) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20">Loading...</div>;

    return (
        <div className="bg-background min-h-screen">
            <div className="mb-8">
                <Breadcrumb
                    pageTitle="Edit Item Configuration"
                    items={[
                        { label: "Inventory", href: "/inventory" },
                        { label: "Edit Registry", active: true }
                    ]}
                />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <InventoryForm initialData={item} />
            </div>
        </div>
    );
}
