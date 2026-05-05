"use client"
import ManagerProfileForm from "@/components/form/ManagerProfileForm";
import ManagerChangePasswordForm from "@/components/form/ManagerChangePasswordForm";
import ManagerSkeleton from "@/components/skeletons/ManagerSkeleton";
import { useUserProfile } from "@/hooks/useAuth";

const Manager = () => {
    const { data, isLoading } = useUserProfile();
    
    if (isLoading) {
        return <ManagerSkeleton />;
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
            <ManagerProfileForm data={data} />
            <ManagerChangePasswordForm />
        </div>
    );
};

export default Manager;