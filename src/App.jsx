import React, { useMemo, useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Toolbar from './components/Toolbar.jsx';
import FlowCanvas from './components/FlowCanvas.jsx';
import InspectorPanel from './components/InspectorPanel.jsx';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [connectMode, setConnectMode] = useState(false);
  const [pendingSourceId, setPendingSourceId] = useState(null);

  // Load/Save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ecoflow-lca');
    if (saved) {
      try {
        const { nodes: n, edges: e } = JSON.parse(saved);
        setNodes(Array.isArray(n) ? n : []);
        setEdges(Array.isArray(e) ? e : []);
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('ecoflow-lca', JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  const addNode = (type) => {
    const x = 60 + nodes.length * 24;
    const y = 80 + nodes.length * 18;
    const newNode = {
      id: uid(),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.filter(n => n.type === type).length + 1}`,
      x,
      y,
      impact: 0,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedId(newNode.id);
  };

  const moveNode = (id, x, y) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const updateNode = (id, patch) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const removeNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.sourceId !== id && e.targetId !== id));
    setSelectedId(null);
  };

  const startConnect = (id) => {
    setPendingSourceId(id);
  };

  const finishConnect = (targetId) => {
    if (!pendingSourceId || pendingSourceId === targetId) return;
    const exists = edges.some((e) => e.sourceId === pendingSourceId && e.targetId === targetId);
    if (!exists) setEdges((prev) => [...prev, { sourceId: pendingSourceId, targetId }]);
    setPendingSourceId(null);
    setConnectMode(false);
  };

  const totalImpact = useMemo(() => nodes.reduce((sum, n) => sum + (Number(n.impact) || 0), 0), [nodes]);

  const handleExport = () => {
    const data = { nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lca-model.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (data) => {
    if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      alert('Invalid model file');
      return;
    }
    setNodes(data.nodes);
    setEdges(data.edges);
    setSelectedId(null);
  };

  const handleClear = () => {
    if (confirm('Clear all nodes and connections?')) {
      setNodes([]);
      setEdges([]);
      setSelectedId(null);
    }
  };

  const selected = nodes.find((n) => n.id === selectedId) || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <Toolbar
        onAddNode={addNode}
        connectMode={connectMode}
        onToggleConnect={() => {
          setConnectMode((v) => !v);
          setPendingSourceId(null);
        }}
        onExport={handleExport}
        onImport={handleImport}
        onClear={handleClear}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col lg:flex-row bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onMoveNode={moveNode}
              connectMode={connectMode}
              pendingSourceId={pendingSourceId}
              onStartConnect={startConnect}
              onFinishConnect={finishConnect}
            />
            <InspectorPanel
              selected={selected}
              onChange={updateNode}
              onDelete={removeNode}
              totalImpact={totalImpact}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-gray-500 flex items-center justify-between">
          <span>Total model impact: <span className="font-semibold text-gray-700">{totalImpact.toFixed(2)} kg CO₂e</span></span>
          <span className="hidden sm:inline">Drag nodes to arrange. Use Connect to link them.</span>
        </div>
      </footer>
    </div>
  );
}
