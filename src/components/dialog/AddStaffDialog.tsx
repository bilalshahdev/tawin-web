"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateStaff, useUpdateStaff } from "@/hooks/useStaff";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Backend Types
type Operation = 'get' | 'post' | 'patch' | 'put' | 'delete';
type StaffModule =
    | 'dashboard' | 'orders' | 'users' | 'staff' | 'products'
    | 'construction-basket' | 'reviews' | 'suppliers' | 'coupon codes'
    | 'financial transfers' | 'brand' | 'stock' | 'categories';

interface IPermission {
    module: StaffModule;
    operations: Operation[];
}

interface IStaff {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    password?: string;
    phone?: string;
    profileImage?: string;
    lastLogout?: Date;
    permissions: IPermission[];
    createdAt?: Date;
    updatedAt?: Date;
}

const CreateStaffSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    permissions: z.array(z.object({
        module: z.enum(["dashboard", "orders", "users", "staff", "products", "construction-basket", "reviews", "suppliers", "coupon codes", "financial transfers", "brand", "stock"]),
        operations: z.array(z.enum(["get", "post", "patch", "put", "delete"]))
    })).optional(),
});

const EditStaffSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    password: z.union([z.string().length(0), z.string().min(6, "Password must be at least 6 characters")]).optional(),
    permissions: z.array(z.object({
        module: z.enum(["dashboard", "orders", "users", "staff", "products", "construction-basket", "categories", "reviews", "suppliers", "coupon codes", "financial transfers", "brand", "stock"]),
        operations: z.array(z.enum(["get", "post", "patch", "put", "delete"]))
    })).optional(),
});

type StaffFormData = z.infer<typeof CreateStaffSchema> | z.infer<typeof EditStaffSchema>;

interface AddStaffDialogProps {
    open: boolean;
    onOpenChange: (val: boolean) => void;
    staff?: IStaff;
}

const PERMISSIONS = [
    { id: "dashboard", name: "dashboard", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "orders", name: "orders", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "users", name: "users", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "categories", name: "categories", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "products", name: "products", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "construction-basket", name: "constructionBasket", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "reviews", name: "reviews", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "suppliers", name: "suppliers", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "coupon codes", name: "couponCodes", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "financial transfers", name: "financialTransfers", operations: ["get", "post", "patch", "delete"] as Operation[] },
    { id: "brand", name: "brand", operations: ["get", "post", "patch", "delete"] as Operation[] },
];

export default function AddStaffDialog({ open, onOpenChange, staff }: AddStaffDialogProps) {
    const t = useTranslations("translation");
    const [showPassword, setShowPassword] = useState(false);
    const isEditing = !!staff;

    const { mutate: createStaff, isPending: isCreating } = useCreateStaff();
    const { mutate: updateStaff, isPending: isUpdating } = useUpdateStaff();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<StaffFormData>({
        resolver: zodResolver(isEditing ? EditStaffSchema : CreateStaffSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            permissions: [],
        },
    });

    const selectedPermissions = watch("permissions") as IPermission[] || [];

    useEffect(() => {
        if (staff && open) {
            setValue("firstName", staff.firstName || "");
            setValue("lastName", staff.lastName || "");
            setValue("email", staff.email || "");
            setValue("phone", staff.phone || "");
            setValue("permissions", staff.permissions || []);
            // Clear password when editing to avoid validation errors
            setValue("password", "");
        } else if (open) {
            reset();
        }
    }, [staff, open, setValue, reset]);

    const onSubmit = (data: StaffFormData) => {
        const staffData: Omit<IStaff, '_id' | 'isActive' | 'phone' | 'profileImage' | 'lastLogout' | 'createdAt' | 'updatedAt'> & { password?: string; phone?: string } = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            permissions: data.permissions || [],
        };

        // Include phone if provided
        if (data.phone) {
            staffData.phone = data.phone;
        }

        // Only include password if it has a value (new staff or password change)
        if (data.password) {
            staffData.password = data.password;
        }

        if (isEditing) {
            updateStaff({ id: staff?._id, staffData }, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            createStaff(staffData, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
    };

    const handlePermissionChange = (permissionId: string, operation: Operation, checked: boolean) => {
        const currentPermissions = selectedPermissions || [];
        const existingPermissionIndex = currentPermissions.findIndex(p => p.module === permissionId);

        if (existingPermissionIndex >= 0) {
            const existingPermission = currentPermissions[existingPermissionIndex];
            const operationsArray = existingPermission.operations;

            if (checked) {
                if (!operationsArray.includes(operation)) {
                    operationsArray.push(operation);
                }
            } else {
                const index = operationsArray.indexOf(operation);
                if (index > -1) {
                    operationsArray.splice(index, 1);
                }
            }

            if (operationsArray.length === 0) {
                currentPermissions.splice(existingPermissionIndex, 1);
            }
        } else if (checked) {
            currentPermissions.push({
                module: permissionId as StaffModule,
                operations: [operation]
            });
        }

        setValue("permissions", currentPermissions);
    };

    const isPermissionChecked = (permissionId: string, operation: Operation) => {
        const permission = selectedPermissions.find(p => p.module === permissionId);
        if (!permission) return false;
        return permission.operations.includes(operation);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#004d40]">
                        {isEditing ? t("editStaff") : t("addStaff")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit, (err) => console.error(err))}>
                        {/* First Name */}
                        <div className="space-y-1.5">
                            <Label>{t("firstName")}</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder={t("firstName")}
                                className="rounded-md border border-gray-200"
                                error={!!errors.firstName}
                                errorMessage={errors.firstName?.message}
                                {...register("firstName")}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-1.5">
                            <Label>{t("lastName")}</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder={t("lastName")}
                                className="rounded-md border border-gray-200"
                                error={!!errors.lastName}
                                errorMessage={errors.lastName?.message}
                                {...register("lastName")}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label>{t("emailLabel")}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t("emailLabel")}
                                className="rounded-md border border-gray-200"
                                error={!!errors.email}
                                errorMessage={errors.email?.message}
                                {...register("email")}
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label>{t("phone")}</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder={t("phone")}
                                className="rounded-md border border-gray-200"
                                error={!!errors.phone}
                                errorMessage={errors.phone?.message}
                                {...register("phone")}
                            />
                        </div>

                        {/* Password - Only show for new staff */}
                        {!isEditing && (
                            <div className="space-y-1.5">
                                <Label>{t("password")}</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t("password")}
                                        className="rounded-md border border-gray-200"
                                        error={!!errors.password}
                                        errorMessage={errors.password?.message}
                                        {...register("password")}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 text-muted-foreground z-10 border-0 h-full px-3"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Permissions */}
                        <div className="space-y-3">
                            <Label>{t("permissions")}</Label>
                            <div className="space-y-3 border rounded-md p-3">
                                {PERMISSIONS.map((permission) => (
                                    <div key={permission.id} className="space-y-2">
                                        <div className="font-medium text-sm">{t(permission.name)}</div>
                                        <div className="flex flex-wrap gap-3">
                                            {permission.operations.map((operation) => (
                                                <div key={operation} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`${permission.id}-${operation}`}
                                                        checked={isPermissionChecked(permission.id, operation)}
                                                        onCheckedChange={(checked) =>
                                                            handlePermissionChange(permission.id, operation, checked as boolean)
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`${permission.id}-${operation}`}
                                                        className="text-xs cursor-pointer capitalize"
                                                    >
                                                        {t(operation)}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-32 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md"
                                onClick={handleClose}
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                className="w-32 rounded-md"
                                disabled={isCreating || isUpdating}
                            >
                                {isCreating || isUpdating ? (
                                    <SpinnerLoader />
                                ) : (
                                    isEditing ? t("update") : t("addStaff")
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
