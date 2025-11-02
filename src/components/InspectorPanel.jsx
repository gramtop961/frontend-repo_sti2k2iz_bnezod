import React from 'react';
import { Trash2 } from 'lucide-react';

export default function InspectorPanel({ selected, onChange, onDelete, totalImpact }) {
  if (!selected) {
    return (
      <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white/60">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Inspector</h3>
          <p className="text-sm text-gray-500">Select a node to edit its details. Impact is expressed in kg CO₂e.</p>
          <div className="mt-6 p-3 rounded-md bg-emerald-50 text-emerald-800 text-sm border border-emerald-200">
            Total model impact: <span className="font-semibold">{totalImpact.toFixed(2)} kg CO₂e</span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Node details</h3>
          <button
            onClick={() => onDelete(selected.id)}
            className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
        <div className="grid gap-3">
          <label className="text-xs font-medium text-gray-600">Type</label>
          <div className="text-sm px-2.5 py-1.5 rounded-md border bg-gray-50 text-gray-700 inline-block w-fit capitalize">
            {selected.type}
          </div>
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-gray-600">Name</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selected.name}
            onChange={(e) => onChange(selected.id, { name: e.target.value })}
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-gray-600">Impact (kg CO₂e)</label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selected.impact ?? 0}
            onChange={(e) => onChange(selected.id, { impact: Number(e.target.value) })}
          />
          <p className="text-xs text-gray-500">Assign the greenhouse gas impact for this node.</p>
        </div>
        <div className="pt-2 border-t">
          <div className="text-sm text-gray-600">Total model impact</div>
          <div className="text-lg font-semibold">{totalImpact.toFixed(2)} kg CO₂e</div>
        </div>
      </div>
    </aside>
  );
}
