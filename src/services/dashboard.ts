import { getIncomePerMonth } from "./charts";
import { supabase } from "./supabase";

export type MonthKey =
  | "Enero"
  | "Febrero"
  | "Marzo"
  | "Abril"
  | "Mayo"
  | "Junio"
  | "Julio"
  | "Agosto"
  | "Septiembre"
  | "Octubre"
  | "Noviembre"
  | "Diciembre";

export type MonthlyFinanceRow = {
  month: MonthKey;
  income: number;
  costs: number;
};

const MONTHS_ES: MonthKey[] = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function clampMoney(n: unknown): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  // Evita -0 por temas de float
  return Object.is(v, -0) ? 0 : v;
}

export async function getEventCostsPerMonth(year = new Date().getFullYear()) {
  const { data, error } = await supabase
    .from("booking_personal")
    .select("days, rate, booking!inner(event_date, booking_status)");
  if (error) throw new Error("Error al cargar costos (personal) por mes.");

  const acc = new Map<MonthKey, number>();
  for (const m of MONTHS_ES) acc.set(m, 0);

  (data ?? []).forEach((row) => {
    const booking = (row as unknown as { booking?: { event_date: string; booking_status: string } | null })
      .booking;
    if (!booking) return;
    if (booking.booking_status === "cancel") return;

    const d = new Date(booking.event_date);
    if (Number.isNaN(d.getTime())) return;
    if (d.getFullYear() !== year) return;
    const m = MONTHS_ES[d.getMonth()];
    const days = (row as unknown as { days?: number }).days ?? 0;
    const rate = (row as unknown as { rate?: number }).rate ?? 0;
    acc.set(m, (acc.get(m) ?? 0) + days * rate);
  });

  return MONTHS_ES.map((m) => ({ month: m, costs: clampMoney(acc.get(m)) }));
}

export async function getFinancePerMonth(
  year = new Date().getFullYear()
): Promise<MonthlyFinanceRow[]> {
  const [incomeRows, costRows] = await Promise.all([
    getIncomePerMonth(),
    getEventCostsPerMonth(year),
  ]);

  const incomeMap = new Map<string, number>();
  (incomeRows ?? []).forEach((r: { month: string; income: number }) => {
    incomeMap.set(r.month, clampMoney(r.income));
  });

  const costsMap = new Map<MonthKey, number>();
  costRows.forEach((r) => costsMap.set(r.month, clampMoney(r.costs)));

  return MONTHS_ES.map((m) => {
    const income = clampMoney(incomeMap.get(m));
    const costs = clampMoney(costsMap.get(m));
    return { month: m, income, costs };
  });
}

export async function getCurrentMonthCostsSummary(year = new Date().getFullYear()) {
  const now = new Date();
  const monthIdx = now.getMonth();
  const month = MONTHS_ES[monthIdx];

  const [financeRows, costsRows, incomeRows] = await Promise.all([
    getFinancePerMonth(year),
    getEventCostsPerMonth(year),
    getIncomePerMonth(),
  ]);

  const costs = costsRows.find((r) => r.month === month)?.costs ?? 0;
  const finance = financeRows.find((r) => r.month === month);
  const income =
    (incomeRows ?? []).find((r: { month: string }) => r.month === month)?.income ?? 0;

  return {
    year,
    month,
    income: clampMoney(income),
    costs: clampMoney(costs),
    // útil para el KPI aunque no se muestre como “ganancia”
    result: clampMoney((finance?.income ?? income) - costs),
  };
}
