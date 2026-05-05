import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TableSkeletonProps = {
  /** Number of rows to show (default: 5) */
  rows?: number;
  /** Number of columns to show (default: 6) */
  cols?: number;
  /** Match the headerClassName you pass to DataTable */
  headerClassName?: string;
  /** Custom column widths — length should match `cols`. e.g. ["w-16", "w-40", ...] */
  colWidths?: string[];
  /** Show a pagination skeleton below the table (default: true) */
  showPagination?: boolean;
  className?: string;
};

const TableSkeleton = ({
  rows = 5,
  cols = 6,
  headerClassName,
  colWidths,
  showPagination = true,
  className,
}: TableSkeletonProps) => {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-8 h-full", className)}>
      <Table>
        {/* Header */}
        <TableHeader className={cn(headerClassName)}>
          <TableRow>
            {Array.from({ length: cols }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton
                  className={cn("h-4 rounded-md", colWidths?.[i] ?? "w-24")}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: cols }).map((_, colIdx) => (
                <TableCell key={colIdx}>
                  <Skeleton
                    className={cn(
                      "h-4 rounded-md",
                      colWidths?.[colIdx] ?? "w-24"
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSkeleton;