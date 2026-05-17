"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";

export default function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const email = searchParams.get("email") ?? "";

    return <ResetPasswordForm token={token} email={email} />;
}
