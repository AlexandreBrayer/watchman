export function parseFilters(filters: any, excFilters: any, dateBarrier: any) {
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
  for (const key in excFilters) {
    if (
      Array.isArray(excFilters[key].value) &&
      excFilters[key].strict === false
    ) {
      const regexValues = excFilters[key].value.map((value: any) => {
        return new RegExp(value, "i");
      });
      parsedFilters[key] = {...parsedFilters[key], $nin: regexValues}
    } else {
      parsedFilters[key] = {...parsedFilters[key], $nin: excFilters[key].value}
    }
  }
  if (dateBarrier) {
    dateBarrier.after === true
      ? (parsedFilters.createdAt = { $gte: dateBarrier.value })
      : (parsedFilters.createdAt = { $lte: dateBarrier.value });
  }
  return parsedFilters;
}
