import SignupForm from "@/components/form/SignupForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function SignupPage() {
    return (
        <AuthLayout
            FormComponent={<SignupForm />}
        />
    );
}