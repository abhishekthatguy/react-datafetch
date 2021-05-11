export const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

export const matchQuery = (str, query) => {
  query = query?.toLowerCase().replaceAll(/\s/g, "");
  str = str?.toLowerCase().replaceAll(/\s/g, "");
  return str.includes(query);
};

export const duplicateCheck = (a, b) => {
  return a?.id === b?.id;
};
