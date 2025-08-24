export function formatDate(date: string) {
  const dateArr = date.split("-");
  const formatedDate = dateArr.reverse().join("/");
  return formatedDate;
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
