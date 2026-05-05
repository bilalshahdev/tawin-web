"use client";

import { ReactNode } from "react";
import Image from "../MyImage";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { Skeleton } from "../ui/skeleton";

export default function AuthLayout({ FormComponent }: { FormComponent: ReactNode }) {
    const { data: settings, isLoading } = useSettings();
    return (
        <div className="flex min-h-screen w-full bg-background">

            {FormComponent}

            <section className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                <Image
                    src="/auth-bg.png"
                    alt="Construction site"
                    fill
                    priority
                    className="object-cover object-[center_45%]"
                />

                <div className="absolute inset-0 bg-navy/70" />

                {isLoading ? (
                    <Skeleton className="w-[180px] h-[180px] rounded-full" />
                ) : (
                    <Link
                        href="/"
                        className="relative z-10 w-[220px] h-[220px]">
                        <Image
                            src={settings?.logo || ""}
                            alt="Logo"
                            width={220}
                            height={220}
                        />
                    </Link>
                )}
            </section>
        </div>
    );
}