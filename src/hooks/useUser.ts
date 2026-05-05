import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/services/user";

export const useUserStats = (period : { period : string }) => {
  return useQuery({
    queryKey: ["userStats", period],
    queryFn: () => getUserStats(period),
    staleTime: 5 * 60 * 1000,
  });
};