"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useAuth";

interface UserGuardProps {
    children: React.ReactNode;
}

export default function UserGuard({ children }: UserGuardProps) {
    const router = useRouter();
    const { error } = useUserProfile();
    
    const userError = error as any;

    useEffect(() => {
        if (userError?.response?.status === 401 || userError?.status === 401) {
            localStorage.removeItem("token");
            router.replace("/auth/signin");
        }
    }, [userError, router]);

    return <>{children}</>;
}