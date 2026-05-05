import { getAdminSummary } from "@/services/admin";
import { useQuery } from "@tanstack/react-query";

export const useGetAdminSummary = (period: string) => {
  return useQuery({
    queryKey: ["admin-summary", period],
    queryFn: () => getAdminSummary(period),
  });
};
