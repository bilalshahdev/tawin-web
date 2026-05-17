import { Suspense } from "react";
import ResetPasswordContent from "@/components/auth/ResetPasswordContent";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            FormComponent={
                <Suspense>
                    <ResetPasswordContent />
                </Suspense>
            }
        />
    );
}
