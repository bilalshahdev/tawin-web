"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchInput from "@/components/ui/searchInput";
import Image from "@/components/MyImage";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const TopCategories = ({data, currencySymbol}: {data: any, currencySymbol?: string}) => {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";
  
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Card className="h-full border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{t("topCategories")}</CardTitle>
        <Link
        href="/admin/product-list"
         className="text-xs text-purple-600 cursor-pointer">{t("allCategories")}
         </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        <SearchInput 
          placeholder={t("searchPlaceholder")} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="divide-y">
          {data
            .filter((item: any) => 
              item.name[locale]?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .length > 0 ? (
              data
                .filter((item: any) => 
                  item.name[locale]?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.name[locale]}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold">{item.name[locale]}</span>
                  </div>

                  <span className="font-bold text-sm shrink-0">{currencySymbol}{item.value}</span>
                </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-gray-500 text-sm">{t("noDataFound")}</span>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCategories;