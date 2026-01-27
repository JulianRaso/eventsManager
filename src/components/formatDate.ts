export function formatDate(date: string) {
  const dateArr = date.split("-");
  const formatedDate = dateArr.reverse().join("/");
  return formatedDate;
}

/** Convierte YYYY-MM-DD (o con hora) a dd/mm/yyyy para mostrar en inputs. */
export function toDDMMYYYY(iso: string): string {
  if (!iso || !iso.includes("-")) return "";
  const datePart = iso.split("T")[0];
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return "";
  const day = d.padStart(2, "0");
  const month = m.padStart(2, "0");
  return `${day}/${month}/${y}`;
}

/** Parsea dd/mm/yyyy o d/m/yyyy a YYYY-MM-DD. Retorna null si es inválido. */
export function fromDDMMYYYY(value: string): string | null {
  const t = value.trim().replace(/\s/g, "");
  if (!t) return null;
  const parts = t.split("/");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map((p) => p.replace(/^0+/, "") || "0");
  const day = Number(d);
  const month = Number(m);
  const year = Number(y);
  if (!day || !month || !year || year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  const lastDay = new Date(year, month, 0).getDate();
  if (day < 1 || day > lastDay) return null;
  const yy = String(year);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function formatDateTime(date: string) {
  const dateArr = date.split("T");
  const formatedDate = dateArr[0].split("-").reverse().join("/");
  return formatedDate;
}

export function formatDateCharts(yearMonth: string) {
  const [yearStr, monthStr] = yearMonth.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const fecha = new Date(year, month - 1);
  let mes = fecha.toLocaleString("es-ES", { month: "long" });
  mes = mes.charAt(0).toUpperCase() + mes.slice(1);
  return `${mes} - ${year}`;
}
