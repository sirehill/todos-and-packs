import { EnergyState } from '@/types';
import { load, save } from './storage';

const KEY = 'pal.energy';

const DEFAULTS: EnergyState = { value: 0, threshold: 50, perCompletion: 20 };

export const getEnergy = (): EnergyState => {
  const cur = load<EnergyState>(KEY, DEFAULTS);
  // One-time migration: upgrade old default 10 -> 20
  if (typeof cur.perCompletion !== 'number' || cur.perCompletion < DEFAULTS.perCompletion) {
    const updated = { ...DEFAULTS, ...cur, perCompletion: DEFAULTS.perCompletion };
    setEnergy(updated);
    return updated;
  }
  return cur;
};

export const setEnergy = (state: EnergyState) => { save(KEY, state); emitEnergy(); };

export const addEnergyForCompletion = () => {
  const e = getEnergy();
  e.value += e.perCompletion;
  setEnergy(e);
  return e;
};

export const canOpenPack = () => {
  const e = getEnergy();
  return e.value >= e.threshold;
};

export const consumeForPack = () => {
  const e = getEnergy();
  if (e.value >= e.threshold) {
    e.value -= e.threshold;
    setEnergy(e);
    return true;
  }
  return false;
};


const ENERGY_EVENT = 'pal:energy';

function emitEnergy() {
  try {
    const detail = getEnergy();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(ENERGY_EVENT, { detail }));
    }
  } catch {}
}

export function onEnergy(listener: (state: EnergyState) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: any) => {
    try { listener(e.detail as EnergyState); } catch {}
  };
  window.addEventListener(ENERGY_EVENT, handler as EventListener);
  return () => window.removeEventListener(ENERGY_EVENT, handler as EventListener);
}
