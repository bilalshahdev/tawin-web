"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { useUpdateAdminProfile } from "@/hooks/useAuth";
import MyImage from "@/components/MyImage";

interface UserData {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    role?: string;
    profileImage?: string;
}

interface Props {
    data?: { data?: UserData } | UserData;
}

const ManagerProfileForm = ({ data }: Props) => {
    const t = useTranslations("translation");
    const user: UserData = (data as any)?.data ?? data ?? {};

    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
    });

    useEffect(() => {
        setForm({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
        });
    }, [user.firstName, user.lastName, user.username, user.email]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: updateProfile, isPending } = useUpdateAdminProfile();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        updateProfile(form, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleCancel = () => {
        setForm({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
        });
        setIsEditing(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        updateProfile(file);
    };

    return (
        <Card className="lg:col-span-2 border shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-800 shrink-0">{t("editProfile")}</h2>

                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                className="shrink-0 w-auto px-6"
                                onClick={handleSave}
                                disabled={isPending}
                            >
                                {isPending ? t("saving") : t("save")}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-400 shrink-0 w-auto px-6"
                                onClick={handleCancel}
                                disabled={isPending}
                            >
                                {t("cancel")}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-400 px-6"
                            onClick={() => setIsEditing(true)}
                        >
                            {t("edit")}
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 relative rounded-full overflow-hidden border-2 border-aqua/20">
                        <MyImage
                            src={user.profileImage || ""}
                            alt="Profile Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="profileImage"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <Button
                            variant="primary"
                            size="sm"
                            className="w-auto px-6"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isPending}
                        >
                            {t("uploadImage")}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                        <Label>{t("firstName")}</Label>
                        <Input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder={t("ahmed")}
                            className="rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t("lastName")}</Label>
                        <Input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder={t("complete")}
                            className="rounded-md"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>{t("username")}</Label>
                    <Input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="username"
                        className="rounded-md"
                    />
                </div>

                <div className="space-y-2">
                    <Label>{t("email")}</Label>
                    <Input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="email@example.com"
                        className="rounded-md"
                    />
                </div>

                <div className="space-y-2">
                    <Label>{t("role")}</Label>
                    <Input
                        value="Admin"
                        readOnly
                        disabled
                        className="rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ManagerProfileForm;