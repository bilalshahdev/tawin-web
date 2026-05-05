import LoginForm from "@/components/form/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function SignInPage() {
    return (
        <AuthLayout
            FormComponent={<LoginForm />}
        />
    );
}