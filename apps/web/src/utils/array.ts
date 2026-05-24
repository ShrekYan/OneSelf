export function unique<T>(arr: readonly T[]): T[] {
  return Array.from(new Set(arr));
}

export function sort<T extends number | string>(arr: readonly T[]): T[] {
  return [...arr].sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    return String(a).localeCompare(String(b));
  });
}

export function filter<T>(arr: readonly T[], fn: (item: T) => boolean): T[] {
  return arr.filter(fn);
}
