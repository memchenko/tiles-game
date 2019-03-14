export const roundTo = (precision) => (num) => {
  // 2 is for symbols "0" and "." ("0.".length === 2)
  const maxSymbols = precision+2;
  const numStringified = String(num);

  return numStringified.length <= maxSymbols ?
    Number(numStringified) :
    Number(numStringified.slice(0, maxSymbols));
};
