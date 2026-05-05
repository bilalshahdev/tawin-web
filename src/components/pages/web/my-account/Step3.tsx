"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { useGetOrders } from "@/hooks/useOrder";
import { useSettings } from "@/hooks/useSettings";

export default function OrderHistory() {
  const t = useTranslations("translation");

  // Integrating API
  const { data: settings } = useSettings();
  const { data: response, isLoading } = useGetOrders();
  const orders = response?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-lg font-semibold text-gray-900">{t("orderHistory")}</h2>

      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-none">
              <TableHead className="py-4">{t("orderCode")}</TableHead>
              <TableHead className="py-4">{t("date")}</TableHead>
              <TableHead className="py-4">{t("status")}</TableHead>
              <TableHead className="text-right py-4">{t("price")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Simple Loading State
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                  {t("loading")}...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                  {t("noOrdersFound")}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow key={order._id} className="border-gray-50">
                  <TableCell className="text-sm font-medium py-4">
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm py-4">
                    <span className="capitalize">{order.status}</span>
                  </TableCell>
                  <TableCell className="text-sm font-semibold py-4">
                    {settings?.currencySymbol}{order.finalAmount}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}