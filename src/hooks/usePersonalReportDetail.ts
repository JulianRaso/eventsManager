import { useQuery } from "@tanstack/react-query";
import { fetchPersonalReportDetail } from "../services/personalReport";

export default function usePersonalReportDetail(personalId: number | undefined) {
  return useQuery({
    queryKey: ["personalReportDetail", personalId],
    queryFn: () => fetchPersonalReportDetail(personalId!),
    enabled: personalId != null && personalId > 0 && !Number.isNaN(personalId),
  });
}
