export function formatDateToLocale(isoDateString: string) {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const monthNumber = date.getMonth() + 1;
  const dayNumber = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${String(monthNumber).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}
