// guards/AdminGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const { data, isLoading, error } = useUserProfile();
    
    const userProfile = data?.data;

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        if (!token) {
            router.replace("/auth/admin");
            return;
        }

        if (!isLoading) {
            if (error || !userProfile) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("token");
                router.replace("/auth/admin");
                return;
            }

            if (userProfile.role !== "admin" && userProfile.role !== "staff") {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("token");
                router.replace("/auth/admin");
                return;
            }

            setIsReady(true);
        }
    }, [userProfile, isLoading, error, router]);

    if (isLoading || !isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center mx-auto bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-green" />
            </div>
        );
    }

    return <>{children}</>;
}