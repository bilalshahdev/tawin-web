"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/searchInput";
import {
  FileText,
  MoreHorizontal,
  ArrowUpDown,
  Filter,
  RefreshCcw,
  CirclePlus,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import AddSupplierDialog from "@/components/dialog/AddSupplierDialog";
import AddBrandDialog from "@/components/dialog/AddBrandDialog";
import AddUserDialog from "./dialog/AddUserDialog";
import AddStaffDialog from "./dialog/AddStaffDialog";
import { exportReport } from "@/utils/reportExport";

interface FilterSectionProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
  data: any[];
  type?: "order" | "user" | "supplier" | "lowStock" | "brand" | "review" | "coupon" | "constructionBasket" | "staff";
  search?: string;
  setSearch?: (val: string) => void;
  isReversed?: boolean;
  setIsReversed?: (val: boolean) => void;
  onRefetch?: () => void;
  isFetching?: boolean;
  // Review specific
  ratingFilter?: number | null;
  setRatingFilter?: (val: number | null) => void;
  reviewsTotal?: number;
  canPost?: boolean;
  reportTitle?: string;
}

const FilterSection = ({
  activeTab,
  setActiveTab,
  data,
  type = "order",
  search,
  setSearch,
  isReversed,
  setIsReversed,
  onRefetch,
  isFetching,
  ratingFilter,
  setRatingFilter,
  reviewsTotal = 0,
  canPost = true,
  reportTitle,
}: FilterSectionProps) => {
  const t = useTranslations("translation");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getTabs = () => {
    if (type === "coupon") return [
      { id: "All Coupons", label: t("allCoupons") },
      { id: "Active", label: t("active") },
      { id: "Used", label: t("used") },
      { id: "Cancelled", label: t("cancelled") },
    ];
    return [
      { id: "All Orders", label: t("allOrders") },
      { id: "pending", label: t("pending") },
      { id: "Processing", label: t("processing") },
      { id: "Shipped", label: t("shipped") }, // Added Shipped as it's common in orders
      { id: "Delivered", label: t("delivered") },
      { id: "Cancelled", label: t("cancelled") },
    ];
  };

  const tabs = getTabs();

  const actions = [
    {
      icon: <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />,
      color: "text-gray-500",
      onClick: onRefetch
    },
    // { icon: <Filter className="h-4 w-4" />, color: "text-gray-500" },
    {
      icon: <ArrowUpDown className="h-4 w-4" />,
      color: isReversed ? "text-aqua font-bold" : "text-gray-500",
      onClick: () => setIsReversed?.(!isReversed)
    },
    // { icon: <MoreHorizontal className="h-4 w-4" />, color: "text-gray-500" },
    {
      icon: <FileText className="h-4 w-4" />,
      color: "text-red-500",
      onClick: () => exportReport(reportTitle || getTitle() || t("report"), data || [])
    },
  ];

  const getTitle = () => {
    if (type === "user") return t("usersList");
    if (type === "supplier") return t("suppliersList");
    if (type === "brand") return t("brandsList");
    if (type === "constructionBasket") return t("constructionBasket");
    if (type === "staff") return t("staffList");
    return "";
  };

  const isTitleType = type === "user" || type === "supplier" || type === "brand" || type === "constructionBasket" || type === "staff";
  const isTabType = type === "order" || type === "lowStock" || type === "coupon";
  const hasAddButton = !["order", "lowStock", "review", "coupon", "constructionBasket"].includes(type)

  return (
    <>
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between w-full gap-4">

        {/* Left Side: Tabs or Title */}
        <div className={cn(
          "w-full xl:w-auto overflow-x-auto scrollbar-hide",
          "pb-1 md:pb-0"
        )}>
          {type === "review" ? (
            <div className="flex items-center gap-1 bg-emerald-50/40 p-1 rounded-lg border border-gray-100 min-w-max">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRatingFilter?.(null)}
                className={cn(
                  "h-8 px-3 text-xs font-medium transition-all",
                  ratingFilter === null
                    ? "bg-white shadow-sm text-gray-900 border border-gray-100 hover:bg-white"
                    : "text-muted-foreground hover:bg-aqua/10"
                )}
              >
                {t("allReviews")}
                <span className="ms-1 text-aqua font-bold">({reviewsTotal})</span>
              </Button>
              {[1,2,3,4,5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => setRatingFilter?.(star)}
                  className={cn(
                    "h-8 px-3 text-xs font-medium transition-all gap-1",
                    ratingFilter === star
                      ? "bg-white shadow-sm text-gray-900 border border-gray-100 hover:bg-white"
                      : "text-muted-foreground hover:bg-aqua/10"
                  )}
                >
                  <Star size={11} className="fill-black text-black" />
                  {t("rating")} {star}
                </Button>
              ))}
            </div>
          ) : isTabType ? (
            <div className="flex items-center gap-1 bg-emerald-50/40 p-1 rounded-lg border border-gray-100 min-w-max">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "h-8 px-4 text-xs font-medium transition-all shrink-0",
                    activeTab === tab.id
                      ? "bg-white shadow-sm text-gray-900 border border-gray-100 hover:bg-white"
                      : "text-muted-foreground hover:bg-aqua/10"
                  )}
                >
                  {tab.label}
                  {/* {isAllTabId(tab.id) && (
                    <span className="ml-1 text-aqua font-bold">({data?.length})</span>
                  )} */}
                </Button>
              ))}
            </div>
          ) : isTitleType ? (
            <h1 className="text-lg font-bold text-gray-800 px-1 overflow-hidden whitespace-nowrap">{getTitle()}</h1>
          ) : null}
        </div>

        {/* Right Side: Search, Actions, and Add Button */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 flex-1">
            <SearchInput
              value={search}
              onChange={(e) => setSearch?.(e.target.value)}
              placeholder={`${t("search")}...`}
              className="flex-1 md:w-[200px] lg:w-[240px]"
            />

            <div className="flex items-center gap-1 shrink-0">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="icon"
                  onClick={action.onClick}
                  className={cn("h-9 w-9 border-gray-200 bg-white shrink-0", action.color)}
                >
                  {action.icon}
                </Button>
              ))}
            </div>
          </div>

          {hasAddButton && canPost && (
            <Button
              variant="primary"
              size="sm"
              className="w-full lg:w-auto gap-2 shrink-0 h-9"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <span className="truncate">
                {type === "user"
                  ? t("addUser")
                  : type === "supplier"
                    ? t("addSupplier")
                    : type === "brand"
                      ? t("addBrand")
                      : type === "staff"
                        ? t("addStaff")
                        : t("addApplication")}
              </span>
              <CirclePlus className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {isAddDialogOpen && (
        <>
          {type === "user" && <AddUserDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />}
          {type === "supplier" && <AddSupplierDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />}
          {type === "brand" && <AddBrandDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />}
          {type === "staff" && <AddStaffDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />}
        </>
      )}
    </>
  );
};

export default FilterSection;
