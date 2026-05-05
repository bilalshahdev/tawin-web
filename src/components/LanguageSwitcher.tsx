"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
];

export default function LanguageSwitcher({ isMain }: { isMain?: boolean }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLocale: string) => {
        const segments = pathname.split("/").filter(Boolean);
        const pathWithoutLocale =
            segments.length > 1 ? "/" + segments.slice(1).join("/") : "";
        const newPath = `/${newLocale}${pathWithoutLocale}`;
        router.push(newPath);
        router.refresh();
    };

    const currentLanguage = languages.find((lang) => lang.code === locale);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 text-xs sm:text-sm text-inherit cursor-pointer outline-none ${isMain ? "text-white" : ""}`}>
                    {currentLanguage?.name}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`cursor-pointer ${locale === language.code ? "bg-accent" : ""}`}
                    >
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}