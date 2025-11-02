import React, { useRef } from 'react';
import { Plus, Link2, Save, Upload, Trash2, Box, PackageOpen } from 'lucide-react';

export default function Toolbar({ onAddNode, connectMode, onToggleConnect, onExport, onImport, onClear }) {
  const fileRef = useRef(null);

  const handleImportClick = () => fileRef.current?.click();

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddNode('process')}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-3 py-2 text-sm shadow hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> Process
          </button>
          <button
            onClick={() => onAddNode('input')}
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 text-white px-3 py-2 text-sm shadow hover:bg-sky-700"
          >
            <Box className="h-4 w-4" /> Input
          </button>
          <button
            onClick={() => onAddNode('output')}
            className="inline-flex items-center gap-2 rounded-md bg-amber-600 text-white px-3 py-2 text-sm shadow hover:bg-amber-700"
          >
            <PackageOpen className="h-4 w-4" /> Output
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <button
          onClick={onToggleConnect}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm shadow border ${connectMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
        >
          <Link2 className="h-4 w-4" /> {connectMode ? 'Connecting…' : 'Connect nodes'}
        </button>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm shadow border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Save className="h-4 w-4" /> Export JSON
        </button>
        <button
          onClick={handleImportClick}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm shadow border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Upload className="h-4 w-4" /> Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const data = JSON.parse(String(reader.result));
                onImport?.(data);
              } catch (err) {
                alert('Invalid JSON file');
              }
            };
            reader.readAsText(file);
            e.currentTarget.value = '';
          }}
        />

        <div className="ml-auto" />
        
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm shadow border border-red-300 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>
    </div>
  );
}
