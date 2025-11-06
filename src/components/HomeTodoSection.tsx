'use client';
import EnergyBar from './EnergyBar';
import TodoList from './TodoList';

export default function HomeTodoSection() {
  return (
    <section className="my-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Stay on track</h2>
        <p className="text-sm opacity-70">
          Complete tasks to build momentum. (Packs unlock via energy in a later update.)
        </p>
      </div>
      <EnergyBar />
      <TodoList />
    </section>
  );
}
