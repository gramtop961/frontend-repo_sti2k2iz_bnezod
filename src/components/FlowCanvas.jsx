import React, { useRef, useState, useMemo } from 'react';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 70;

function NodeCard({ node, selected, onMouseDown, onClick }) {
  const colors = {
    process: 'bg-emerald-50 border-emerald-200',
    input: 'bg-sky-50 border-sky-200',
    output: 'bg-amber-50 border-amber-200',
  };
  const dot = {
    process: 'bg-emerald-500',
    input: 'bg-sky-500',
    output: 'bg-amber-500',
  };
  return (
    <div
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={`absolute rounded-xl border shadow-sm ${colors[node.type]} ${selected ? 'ring-2 ring-indigo-500' : ''}`}
      style={{ left: node.x, top: node.y, width: NODE_WIDTH, height: NODE_HEIGHT, cursor: 'grab', userSelect: 'none' }}
    >
      <div className="h-full w-full p-3">
        <div className="flex items-start gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dot[node.type]} mt-1`} />
          <div className="flex-1">
            <div className="text-sm font-medium truncate">{node.name}</div>
            <div className="text-xs text-gray-500 truncate">{node.type}</div>
          </div>
          {typeof node.impact === 'number' && (
            <div className="text-[11px] font-semibold text-gray-700 bg-white/70 px-2 py-1 rounded-md border border-gray-200">
              {node.impact.toFixed(2)} kg CO₂e
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlowCanvas({
  nodes,
  edges,
  selectedId,
  onSelect,
  onMoveNode,
  connectMode,
  pendingSourceId,
  onStartConnect,
  onFinishConnect,
}) {
  const svgRef = useRef(null);
  const [drag, setDrag] = useState(null);

  const handleMouseMove = (e) => {
    if (!drag) return;
    const rect = svgRef.current?.getBoundingClientRect();
    const x = e.clientX - rect.left - drag.offsetX;
    const y = e.clientY - rect.top - drag.offsetY;
    onMoveNode(drag.id, Math.max(0, x), Math.max(0, y));
  };

  const handleMouseUp = () => setDrag(null);

  const getNodeCenter = (node) => ({
    cx: node.x + NODE_WIDTH / 2,
    cy: node.y + NODE_HEIGHT / 2,
  });

  const lines = useMemo(() => {
    return edges.map((e) => {
      const s = nodes.find((n) => n.id === e.sourceId);
      const t = nodes.find((n) => n.id === e.targetId);
      if (!s || !t) return null;
      const { cx: x1, cy: y1 } = getNodeCenter(s);
      const { cx: x2, cy: y2 } = getNodeCenter(t);
      return { x1, y1, x2, y2, key: `${e.sourceId}-${e.targetId}` };
    }).filter(Boolean);
  }, [edges, nodes]);

  return (
    <div className="relative flex-1 min-h-[520px] bg-gradient-to-b from-white to-slate-50" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
          </marker>
        </defs>
        {lines.map((l) => (
          <line
            key={l.key}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#6366f1"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
        ))}
      </svg>

      {nodes.map((n) => (
        <NodeCard
          key={n.id}
          node={n}
          selected={selectedId === n.id}
          onClick={(e) => {
            e.stopPropagation();
            if (connectMode) {
              if (!pendingSourceId) {
                onStartConnect(n.id);
              } else if (pendingSourceId && pendingSourceId !== n.id) {
                onFinishConnect(n.id);
              }
            } else {
              onSelect(n.id);
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setDrag({ id: n.id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
          }}
        />
      ))}

      {!nodes.length && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center text-gray-500">
            <p className="font-medium">Start by adding nodes</p>
            <p className="text-sm">Use the buttons above to add Process, Input, or Output nodes</p>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0"
        onClick={() => onSelect(null)}
        aria-label="canvas-click-capture"
      />
    </div>
  );
}
