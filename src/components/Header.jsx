import React from 'react';
import { Leaf, Flowchart } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">EcoFlow LCA</h1>
          <p className="text-xs text-gray-500 -mt-0.5 flex items-center gap-1">
            <Flowchart className="h-3.5 w-3.5" />
            Model product life cycles as interactive flowcharts
          </p>
        </div>
      </div>
    </header>
  );
}
