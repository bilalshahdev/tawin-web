"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

interface AuthHeaderProps {
    type: "signin" | "signup"
}

export function AuthHeader({ type }: AuthHeaderProps) {
    const t = useTranslations("translation");
    const isSignin = type === "signin"

    return (
        <div className="space-y-1">
            <h1 className="text-3xl font-medium tracking-tight text-foreground">
                {isSignin ? t("signin") : t("registerAccount")}
            </h1>
            <p className="text-sm text-muted-foreground">
                {isSignin ? t("dontHaveAccount") : t("alreadyHaveAccount")}{" "}
                <Link
                    href={isSignin ? "/auth/signup" : "/auth/signin"}
                    className="font-medium text-aqua hover:text-aqua/80 transition-colors"
                >
                    {isSignin ? t("register") : t("login")}
                </Link>
            </p>
        </div>
    )
}