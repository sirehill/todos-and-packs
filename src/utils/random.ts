export type Rarity = 'COMMON'|'UNCOMMON'|'RARE'|'EPIC'|'LEGENDARY';

export function pickByWeights<T extends { weight?: number }>(arr: T[]): T {
  const total = arr.reduce((s, a) => s + (a.weight ?? 1), 0);
  let r = Math.random() * total;
  for (const a of arr) {
    r -= (a.weight ?? 1);
    if (r <= 0) return a;
  }
  return arr[arr.length - 1];
}

export function pickRarity(dropTable: { rarity: Rarity; prob: number }[]): Rarity {
  const total = dropTable.reduce((s, d) => s + d.prob, 0);
  let r = Math.random() * total;
  for (const d of dropTable) {
    r -= d.prob;
    if (r <= 0) return d.rarity;
  }
  return dropTable[0].rarity;
}
