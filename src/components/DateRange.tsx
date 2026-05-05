"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export type FilterRange = "daily" | "weekly" | "monthly" | "yearly" | "all-time";

interface Props {
    value: FilterRange;
    onChange: (value: FilterRange) => void;
}

const DateRangeFilter = ({ value, onChange }: Props) => {
    const t = useTranslations("translation");

    const options: { label: string; value: FilterRange }[] = [
        { label: t("daily"),   value: "daily"   },
        { label: t("weekly"),  value: "weekly"  },
        { label: t("monthly"), value: "monthly" },
        // { label: t("yearly"), value: "yearly" },
        // { label: t("allTime"), value: "all-time" },
    ];

    const current = options.find((o) => o.value === value);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-600 gap-2 shrink-0">
                    {current?.label}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map((opt) => (
                    <DropdownMenuItem
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={value === opt.value ? "font-semibold text-primary" : ""}
                    >
                        {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DateRangeFilter;