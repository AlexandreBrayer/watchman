export function parseFilters(filters: any, dateBarrier: any) {
  const parsedFilters: any = {};
  for (const key in filters) {
    if (Array.isArray(filters[key].value) && filters[key].strict === false) {
      const regexValues = filters[key].value.map((value: any) => {
        return new RegExp(value, "i");
      });
      parsedFilters[key] = { $in: regexValues };
    } else {
      parsedFilters[key] = { $in: filters[key].value };
    }
  }
  if (dateBarrier) {
    dateBarrier.after === true
      ? (parsedFilters.createdAt = { $gte: dateBarrier.value })
      : (parsedFilters.createdAt = { $lte: dateBarrier.value });
  }
  return parsedFilters;
}
