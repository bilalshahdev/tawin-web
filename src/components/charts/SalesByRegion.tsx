"use client";

import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const SalesByRegion = ({ data }: { data: any[] }) => {
  const router = useRouter();
  const t = useTranslations("translation");

  const totalSales = (data || []).reduce((sum, r) => sum + (r.totalSales || 0), 0);

  return (
    <Card className="w-full border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-purple-500">
            {t("activeUsersLastHour")}
          </CardTitle>
          <div className="text-2xl font-bold">
            {totalSales >= 1000 ? `${(totalSales / 1000).toFixed(1)}K` : totalSales}
          </div>
        </div>
        <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t("usersPerMinute")}</p>
          <div className="flex items-end gap-1 h-12">
            {[40, 70, 45, 90, 65, 30, 80, 50, 60].map((h, i) => (
              <div key={i} className="bg-aqua w-full rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div> */}

        <div className="flex justify-between text-sm font-semibold">
          <span>{t("salesByRegion")}</span>
          <span>{t("sales")}</span>
        </div>

        <div className="space-y-4">
          {(data || []).map((region, idx) => {
            const percentage = totalSales > 0
              ? Math.round((region.totalSales / totalSales) * 100)
              : 0;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {region.totalSales >= 1000
                        ? `${(region.totalSales / 1000).toFixed(1)}k`
                        : region.totalSales}
                    </span>
                    <span className="text-muted-foreground capitalize">{region.city}</span>
                  </div>
                  <span className="text-aqua">▲ {percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2 bg-blue-100" />
              </div>
            );
          })}
        </div>

        <Button onClick={() => router.push("/admin/users")} className="w-full">{t("viewDetails")}</Button>
      </CardContent>
    </Card>
  );
};

export default SalesByRegion;