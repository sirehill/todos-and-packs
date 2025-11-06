'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import { nanoid } from 'nanoid';
import { Todo } from '@/types';
import { load, save } from '@/lib/storage';
import { addEnergyForCompletion, getEnergy, onEnergy } from '@/lib/energy';

const KEY = 'pal.todos';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => (typeof window === 'undefined' ? [] : load<Todo[]>(KEY, [])));
  const [draft, setDraft] = useState('');
  const [perEnergy, setPerEnergy] = useState<number>(10);
  const [mounted, setMounted] = useState(false);

  // Load/save
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      save(KEY, todos);
    } else {
      didMount.current = true;
    }
  }, [todos]);

  // Read per-completion energy once on mount
  useEffect(() => {
    try { setPerEnergy(getEnergy().perCompletion); } catch {}
  }, []);
  useEffect(() => { setMounted(true); }, []);
const add = () => {
    const title = draft.trim();
    if (!title) return;
    setTodos((t) => [{ id: nanoid(), title, done: false, createdAt: Date.now() }, ...t]);
    setDraft('');
  };

  const toggle = (id: string) => {
  // Determine if this action is completing a task BEFORE updating state
  const isCompleting = !!todos.find(t => t.id === id && !t.done);
  if (isCompleting) {
    // Award energy exactly once per user action (outside of setState updater to avoid StrictMode double-call)
    addEnergyForCompletion();
  }
  setTodos(prev => prev.map(t => (
    t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : undefined } : t
  )));
};

  const remove = (id: string) => setTodos((t) => t.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2"
          placeholder="Add a to-do…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button onClick={add} className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {mounted && todos.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <div className={t.done ? 'flex-1 line-through opacity-60' : 'flex-1'}>{t.title}</div>
            <span className="text-xs opacity-70">+{perEnergy} ⚡</span>
            <button onClick={() => remove(t.id)} className="text-sm opacity-70 hover:opacity-100">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
