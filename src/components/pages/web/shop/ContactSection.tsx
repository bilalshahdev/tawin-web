"use client"

import Image from "@/components/MyImage"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { useSubmitAdminReport } from "@/hooks/useContact"

export default function ContactSection() {
    const t = useTranslations("translation");
    const [message, setMessage] = useState("")
    const { mutate: submitReport, isPending } = useSubmitAdminReport();

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    submitReport({message});

    setMessage("");
};

    return (
        <section className="relative w-full overflow-hidden">
            <Image
                src="/banner.png"
                alt={t("contactBgAlt")}
                fill
                className="object-cover"
                sizes="100vw"
                priority
            />

            <div className="relative z-10 mx-auto flex min-h-[340px] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("unavailableContactText")}
                </p>

                <form onSubmit={handleSubmit} className="mt-10 w-full">
                    <div className="flex items-center border-b border-border pb-1">
                        <Input
                            placeholder={t("requestPlaceholder")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="h-auto flex-1 border-0 bg-transparent p-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
                        />
                        <div className="mx-4 h-4 w-px bg-border" />

                        <Button
                            type="submit"
                            disabled={isPending}
                            variant="ghost"
                            className="h-auto p-0 text-sm font-normal text-foreground hover:bg-transparent hover:text-foreground"
                        >
                            {isPending ? "..." : t("send")}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}