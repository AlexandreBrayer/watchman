export function parseFilters(filters: filters, excFilters: filters, dateBarrier?: dateBarrier) {
  const parsedFilters: any = {};
  for (const key in filters) {
    if (Array.isArray(filters[key as keyof typeof filters]?.value) && filters[key as keyof typeof filters]?.strict === false) {
      const regexValues = filters[key as keyof typeof filters]?.value.map((value: any) => {
        return new RegExp(value, "i");
      });
      parsedFilters[key] = { $in: regexValues };
    } else {
      parsedFilters[key] = { $in: filters[key as keyof typeof filters]?.value };
    }
  }
  for (const key in excFilters) {
    if (
      Array.isArray(excFilters[key as keyof typeof filters]?.value) &&
      excFilters[key as keyof typeof filters]?.strict === false
    ) {
      const regexValues = excFilters[key as keyof typeof filters]?.value.map((value: any) => {
        return new RegExp(value, "i");
      });
      parsedFilters[key] = {...parsedFilters[key], $nin: regexValues}
    } else {
      parsedFilters[key] = {...parsedFilters[key], $nin: excFilters[key as keyof typeof filters]?.value}
    }
  }
  if (dateBarrier) {
    dateBarrier.after === true
      ? (parsedFilters.createdAt = { $gte: dateBarrier.value })
      : (parsedFilters.createdAt = { $lte: dateBarrier.value });
  }
  console.log(parsedFilters)
  return parsedFilters;
}
