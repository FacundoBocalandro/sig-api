export const isInLastYear = (date: Date) => {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  return date >= startDate;
}

export const isBetweenDates = (date: Date, initialDate: Date, endDate: Date) => {
  return date >= initialDate && date <= endDate;
}
