import React, { useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';

let nodeId = 3;
let edgeId = 2;

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '1', position: { x: 50, y: 50 }, data: { label: 'Nodo A' }, type: 'default' },
    { id: '2', position: { x: 250, y: 150 }, data: { label: 'Nodo B' }, type: 'default' },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'e1-2', source: '1', target: '2', label: '10 km', type: 'default' },
  ]);

  const agregarNodo = () => {
    const nuevoId = `${nodeId++}`;
    const label = prompt('Etiqueta del nuevo nodo:', `Nodo ${nuevoId}`);
    const nuevoNodo = {
      id: nuevoId,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { label: label || `Nodo ${nuevoId}` },
      type: 'default'
    };
    setNodes((nds) => [...nds, nuevoNodo]);
  };

  const agregarArista = () => {
    const sourceId = prompt('ID del nodo de origen:');
    const targetId = prompt('ID del nodo de destino:');
    const peso = prompt('Peso o etiqueta de la arista:', '20 km');

    // Validación simple
    if (!nodes.find(n => n.id === sourceId) || !nodes.find(n => n.id === targetId)) {
      alert('Uno de los nodos no existe.');
      return;
    }

    const nuevaArista = {
      id: `e${edgeId++}`,
      source: sourceId,
      target: targetId,
      label: peso || '',
      type: 'default'
    };

    setEdges((eds) => [...eds, nuevaArista]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Botones */}
      <div style={{ position: 'absolute', zIndex: 10, top: 10, left: 10 }}>
        <button
          onClick={agregarNodo}
          style={buttonStyle}
        >
          + Agregar Nodo
        </button>

        <button
          onClick={agregarArista}
          style={{ ...buttonStyle, marginLeft: '10px', background: '#10b981' }}
        >
          + Agregar Arista
        </button>
      </div>

      {/* Grafo */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

// Estilo para botones
const buttonStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  background: '#4f46e5',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
};

export default App;
