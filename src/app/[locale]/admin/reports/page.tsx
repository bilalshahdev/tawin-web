"use client";

import { useState } from "react";
import { useGetAdminReport, useDeleteAdminReport } from "@/hooks/useContact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Pagination } from "@/components/Pagination";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";

type Report = {
  _id: string;
  id: string;
  message: string;
  user: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function AdminReportsPage() {
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");
  const { data, isLoading, error } = useGetAdminReport();
  const { mutate: deleteReport, isPending: isDeleting } = useDeleteAdminReport();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const reportData: Report[] = data?.data ?? [];

  const totalDocs = data?.meta?.totalDocs ?? reportData.length;
  const totalPages = Math.ceil(totalDocs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = reportData.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-aqua" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-600">{t("noDataFound")}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-aqua" />
        <h1 className="text-3xl font-bold text-gray-900">{t("reports")}</h1>
      </div>

      {reportData.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t("noReportsAvailable")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedReports.map((report, index) => (
            <Card
              key={report._id}
              className="hover:shadow-lg transition-shadow border"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-aqua shrink-0" />
                    {t("report")} #{startIndex + index + 1}
                  </CardTitle>

                  <ConfirmDialog
                    title={tConfirm("delete.title", { value: t("report") })}
                    description={tConfirm("delete.description", { value: t("report") })}
                    variant="destructive"
                    loading={isDeleting}
                    onConfirm={(closeDialog) => {
                      deleteReport(report._id, {
                        onSuccess: () => closeDialog(),
                      });
                    }}
                    asChild
                  >
                    <button
                      className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50 cursor-pointer shrink-0"
                      title={t("delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </ConfirmDialog>
                </div>
                <p className="text-sm text-gray-500">{report.user.email}</p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 leading-relaxed capitalize">
                    {report.message}
                  </p>
                </div>

                <p className="text-xs text-gray-400">
                  {new Date(report.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          pagination={{
            total: totalDocs,
            page: currentPage,
            limit: itemsPerPage,
          }}
          changePage={setCurrentPage}
        />
      )}
    </div>
  );
}
