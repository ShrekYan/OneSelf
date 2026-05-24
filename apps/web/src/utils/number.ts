export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function formatNumber(num: number): string {
  const [integerPart, decimalPart] = String(num).split('.');
  const sign = integerPart.startsWith('-') ? '-' : '';
  const unsignedInteger = sign ? integerPart.slice(1) : integerPart;
  const formattedInteger = unsignedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decimalPart === undefined
    ? `${sign}${formattedInteger}`
    : `${sign}${formattedInteger}.${decimalPart}`;
}
