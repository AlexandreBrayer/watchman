export function parseFilters(
  filters: filters,
  excFilters: filters,
  dateBarrier?: dateBarrier
) {
  const parsedFilters: mongoFilters = {};
  for (const key in filters) {
    if (filters[key as keyof filters]?.strict === false) {
      const regexValues = filters[key as keyof filters]?.value.map(
        (value: any) => {
          value = value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          return new RegExp(value, "i");
        }
      );
      parsedFilters[key as keyof mongoFilters] = { $in: regexValues };
    } else {
      parsedFilters[key as keyof mongoFilters] = {
        $in: filters[key as keyof filters]?.value,
      };
    }
  }
  for (const key in excFilters) {
    if (excFilters[key as keyof filters]?.strict === false) {
      const regexValues = excFilters[key as keyof filters]?.value.map(
        (value: any) => {
          value = value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          return new RegExp(value, "i");
        }
      );
      parsedFilters[key as keyof mongoFilters] = {
        ...parsedFilters[key as keyof mongoFilters],
        $nin: regexValues,
      };
    } else {
      parsedFilters[key as keyof mongoFilters] = {
        ...parsedFilters[key as keyof mongoFilters],
        $nin: excFilters[key as keyof filters]?.value,
      };
    }
  }
  if (dateBarrier) {
    dateBarrier.after === true
      ? (parsedFilters.createdAt = { $gte: dateBarrier.value })
      : (parsedFilters.createdAt = { $lte: dateBarrier.value });
  }
  return parsedFilters;
}
