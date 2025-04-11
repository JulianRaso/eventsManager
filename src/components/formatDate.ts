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
