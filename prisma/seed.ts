import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Rarity = 'COMMON'|'UNCOMMON'|'RARE'|'EPIC'|'LEGENDARY';

async function main() {
  const animals = await prisma.list.upsert({
    where: { slug: 'animals' },
    update: {},
    create: { slug: 'animals', name: 'Animals', description: 'Collect animals by rarity.' },
  });
  const countries = await prisma.list.upsert({
    where: { slug: 'countries' },
    update: {},
    create: { slug: 'countries', name: 'Countries', description: 'Collect countries by rarity.' },
  });

  const addItems = async (listId: string, entries: { name: string; rarity: Rarity; weight?: number }[]) => {
    for (const e of entries) {
      const existing = await prisma.item.findFirst({ where: { listId, name: e.name } });
      if (!existing) await prisma.item.create({ data: { listId, name: e.name, rarity: e.rarity, weight: e.weight ?? 1 } });
    }
  };

  await addItems(animals.id, [
    { name: 'Cat', rarity: 'COMMON' },
    { name: 'Dog', rarity: 'COMMON' },
    { name: 'Deer', rarity: 'UNCOMMON' },
    { name: 'Wolf', rarity: 'UNCOMMON' },
    { name: 'Panda', rarity: 'RARE' },
    { name: 'Snow Leopard', rarity: 'EPIC' },
    { name: 'Phoenix', rarity: 'LEGENDARY' },
  ]);

  await addItems(countries.id, [
    { name: 'France', rarity: 'COMMON' },
    { name: 'Canada', rarity: 'COMMON' },
    { name: 'Sweden', rarity: 'UNCOMMON' },
    { name: 'Norway', rarity: 'UNCOMMON' },
    { name: 'Japan', rarity: 'RARE' },
    { name: 'New Zealand', rarity: 'EPIC' },
    { name: 'Bhutan', rarity: 'LEGENDARY' },
  ]);

  async function mkPack(listId: string, name: string) {
    const pack = await prisma.packType.create({
      data: { listId, name, cardsPerPack: 4, pitySteps: JSON.stringify({ RARE: 10, EPIC: 40, LEGENDARY: 120 }) }
    });
    const drops = [
      { rarity: 'COMMON', baseProb: 0.2 },
      { rarity: 'UNCOMMON', baseProb: 0.2 },
      { rarity: 'RARE', baseProb: 0.2 },
      { rarity: 'EPIC', baseProb: 0.2 },
      { rarity: 'LEGENDARY', baseProb: 0.2 },
    ] as const;
    for (const d of drops) {
      await prisma.dropTable.create({ data: { packTypeId: pack.id, rarity: d.rarity, baseProb: d.baseProb.toString() } });
    }
    return pack;
  }

  await mkPack(animals.id, 'Standard Pack');
  await mkPack(countries.id, 'Standard Pack');

  console.log('Seed complete.');
}

main().finally(() => prisma.$disconnect());
