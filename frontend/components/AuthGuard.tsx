"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoading from "./PageLoading";
import { auth } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const user = auth.getCurrentUser();
        if (!user) {
            router.replace("/");
        } else {
            setChecked(true);
        }
    }, []);

    if (!checked) return <PageLoading />;

    return <>{children}</>;
}