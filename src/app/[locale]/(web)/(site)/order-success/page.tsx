"use client";

import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderSuccessSimple() {
  const t = useTranslations("translation");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="h-20 w-20 bg-aqua/10 rounded-full flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10 text-aqua" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("orderSuccess")}
        </h1>
      </div>

      <Button
        variant="primary"
        className="mt-2 px-8 rounded-full gap-2 w-38"
        asChild
      >
        <Link href="/my-account?tab=orders">
          <ShoppingBag size={18} />
          {t("viewOrder")}
        </Link>
      </Button>
    </div>
  );
}