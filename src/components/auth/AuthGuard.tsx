"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function AuthGuard({
    children,
    requireAdmin = false
}: AuthGuardProps) {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    const { data, isLoading: isProfileLoading, error } = useUserProfile();
    const userProfile = data?.data

    useEffect(() => {
        const token = localStorage.getItem("token");
        const adminToken = localStorage.getItem("admin_token");

        // Helper to clear and redirect
        const handleLogout = (type: 'admin' | 'user') => {
            localStorage.removeItem("token");
            localStorage.removeItem("admin_token");
            if (type === 'admin') {
                router.replace("/auth/admin"); // Specific admin login
            } else {
                router.replace("/auth/signin"); // Specific user login
            }
        };

        // 2. Logic for No Tokens
        if (!token && !adminToken) {
            handleLogout(requireAdmin ? 'admin' : 'user');
            return;
        }

        // 3. Logic for Admin Requirement
        if (requireAdmin && !adminToken) {
            handleLogout('admin');
            return;
        }

        // 4. Validate with Profile Data
        if (!isProfileLoading) {
            if (error || !userProfile) {
                handleLogout(requireAdmin ? 'admin' : 'user');
                return;
            }

            // If route requires admin but the logged-in user is NOT an admin
            if (requireAdmin && userProfile.role !== "admin") {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("token");

                router.replace("/auth/admin");
                return;
            }

            setIsReady(true);
        }
    }, [userProfile, isProfileLoading, error, requireAdmin, router]);

    if (isProfileLoading || !isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center mx-auto bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-green" />
            </div>
        );
    }

    return <>{children}</>;
}