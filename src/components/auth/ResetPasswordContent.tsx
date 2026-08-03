"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";

export default function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const email = searchParams.get("email") ?? "";
    const phone = searchParams.get("phone") ?? "";

    return <ResetPasswordForm token={token} email={email} phone={phone} />;
}
