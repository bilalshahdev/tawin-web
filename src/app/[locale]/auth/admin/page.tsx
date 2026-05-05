import AdminLoginForm from "@/components/form/AdminLoginForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function AdminSignInPage() {
    return (
        <AuthLayout
            FormComponent={<AdminLoginForm />}
        />
    );
}