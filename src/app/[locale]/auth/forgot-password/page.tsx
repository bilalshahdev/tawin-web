import ForgotPasswordForm from "@/components/form/ForgotPasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            FormComponent={<ForgotPasswordForm />}
        />
    );
}
