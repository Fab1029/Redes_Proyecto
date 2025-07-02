import React from 'react'
import './Graph.css'

import ReactFlow, {
    Controls,
    Background,
    MiniMap,
    ReactFlowProvider,
  } from 'reactflow';
  import 'reactflow/dist/style.css';


const nodes = [
    {
      id: '1',
      position: { x: 100, y: 100 },
      data: { label: 'Nodo 1' },
      type: 'default',
    },
    {
      id: '2',
      position: { x: 300, y: 100 },
      data: { label: 'Nodo 2' },
      type: 'default',
    },
  ];
  
  const edges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'default',
    },
  ];


const Graph = ({buttons}) => {
  return (
    <div className='graph'>
      <ul className={`buttons-list ${buttons ? 'show': ''}`}>
          {buttons.map((button, index) => (<li key={index}>{button}</li>))}
      </ul>
      
      <ReactFlow nodes={nodes} edges={edges}>
        
        <Background />
        <Controls />
      </ReactFlow>

    </div>
  )
}

export default Graph
