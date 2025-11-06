// Helper to pick the right image map for a given list name and item name
import { AnimalImages } from "./animalImages";
import { CountryImages } from "./countryImages";

const toKey = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "_");

export function getAnimalImg(name: string) {
  const k = toKey(name) as keyof typeof AnimalImages;
  return (AnimalImages as any)[k];
}
export function getCountryImg(name: string) {
  const k = toKey(name) as keyof typeof CountryImages;
  return (CountryImages as any)[k];
}
export function getImgForList(listName: string | null | undefined, itemName: string) {
  const n = (listName || "").toLowerCase();
  if (n.includes("animal")) return getAnimalImg(itemName);
  if (n.includes("countr")) return getCountryImg(itemName);
  return null;
}

export function getAnyImg(itemName: string) {
  const k = toKey(itemName);
  const a = (AnimalImages as any)[k];
  if (a) return a;
  const c = (CountryImages as any)[k];
  if (c) return c;
  return null;
}
