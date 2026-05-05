"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoryTable from "@/components/tables/CategoryTable";
import { useGetCategories } from "@/hooks/useCategories";
import CategoryFormDialog from "@/components/dialog/CategoryFormDialog";
import { useTranslations } from "next-intl";

const Categories = () => {
  const t = useTranslations("translation");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  
  const { data, isLoading } = useGetCategories({ page: currentPage, limit, isAdmin: true });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const pagination = data?.data?.pagination;
  const categories = data?.data?.categories || [];

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('categoryDetails')}</h1>
        <Button
          variant="primary"
          className="w-32"
          onClick={() => setIsAddDialogOpen(true)}
          size="sm">
          <Plus className="h-4 w-4 mr-2" /> {t('addCategory')}
        </Button>
      </div>

      <CategoryTable
        data={categories}
        isLoading={isLoading}
        pagination={{
          total: pagination?.total,
          page: pagination?.page,
          limit: pagination?.limit,
          setPage: setCurrentPage
        }}
      />

      {/* Dialog for Adding New Category */}
      <CategoryFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
};

export default Categories;