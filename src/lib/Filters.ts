export function parseFilters(filters: any, dateBarrier: any) {
  const parsedFilters: any = {};
  for (const key in filters) {
    if (
      typeof filters[key].value === "string" &&
      filters[key].strict === false
    ) {
      const regexValue = new RegExp(filters[key].value, "i");
      parsedFilters[key] = regexValue;
    } else {
      parsedFilters[key] = filters[key].value;
    }
  }
  if (dateBarrier?.use) {
    dateBarrier.after === true
      ? (parsedFilters.createdAt = { $gte: dateBarrier.value })
      : (parsedFilters.createdAt = { $lte: dateBarrier.value });
  }
  return parsedFilters;
}
