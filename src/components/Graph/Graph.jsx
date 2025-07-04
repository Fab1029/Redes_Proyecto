import React, { useState } from 'react'
import './Graph.css'
import { Node } from '../../model/node.js'
import { Edge } from '../../model/edge.js'
import { 
  loadGraph, saveGraph, 
  loadPloatNodes, savePlotNodes,
  loadPlotEdges, savePlotEdges
} from '../../data/data.js'

import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState
} from 'reactflow';

import 'reactflow/dist/style.css';
import Button from '../Button/Button.jsx'

let NODES = loadPloatNodes();
let EDGES = loadPlotEdges();

const Graph = ({ showButtons }) => {
  const [graph, setGraph] = useState(loadGraph());
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(EDGES);
  
  const addNode = () => {
    const nodeLabel = prompt('Ingrese nombre del nodo:');
    if (!nodeLabel) return;

    if (graph.find((node) => node.label === nodeLabel)) return;
    
    const newNode = new Node(nodeLabel);
    const updatedGraph = [...graph, newNode];

    const newPlotNode = {
      id: nodeLabel,
      position: { x: Math.random() * 500 + 100, y: Math.random() * 500 + 100 },
      data: { label: nodeLabel },
      style: {
        width: '5rem',
        height: '5rem',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10rem',
        justifyContent: 'center',
        backgroundColor: 'white',
        border: '0.3px solid black'
      },  
      selectable: true
    };

    const updatedNodes = [...nodes, newPlotNode];
    setGraph(updatedGraph);
    setNodes(updatedNodes);
    saveGraph(updatedGraph);
    savePlotNodes(updatedNodes);
  };


  const addEdge = ({ source, target }) => {
    const weight = parseInt(prompt('Ingresa peso de arista:'));
    if (isNaN(weight)) return;

    const startNode = graph.find(n => n.label === source);
    const endNode = graph.find(n => n.label === target);

    if (!startNode || !endNode || startNode.findNode(endNode)) return;

    startNode.addEdge(new Edge(endNode, weight));
    endNode.addEdge(new Edge(startNode, weight));

    const newEdge = {
      id: `${source}-${target}`,
      source:source,
      target:target,
      animated: true,
      label: weight.toString()
    };

    const updatedGraph = [...graph];
    const updatedEdges = [...edges, newEdge];

    setGraph(updatedGraph);
    setEdges(updatedEdges);

    saveGraph(updatedGraph);
    savePlotEdges(updatedEdges);
  };

  const removeNode = () => {
    if (!selectedNodeId) return;

    const nodeToRemove = graph.find(n => n.label === selectedNodeId);
    if (!nodeToRemove) return;

    // Quitar aristas del grafo
    nodeToRemove.edges.forEach(edge => {
      edge.node.deleteEdge(nodeToRemove);
    });

    const updatedGraph = graph.filter(n => n.label !== selectedNodeId);
    const updatedNodes = nodes.filter(n => n.id !== selectedNodeId);
    const updatedEdges = edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId);

    setGraph(updatedGraph);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNodeId(null);

    saveGraph(updatedGraph);
    savePlotNodes(updatedNodes);
    savePlotEdges(updatedEdges);
  };


  return (
    <div className='graph'>
      <ul className={`buttons-list ${showButtons ? 'show': ''}`}>
          <li><Button text={'🟢 Agregar nodo'} color={'#002642'} textColor={'white'} onClick={addNode}/></li>
          <li><Button text={'🗑️ Eliminar nodo'} color={'#DD1C1A'} textColor={'white'} onClick={removeNode}/></li>
      </ul>
      
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onConnect={addEdge}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => {setSelectedNodeId(node.id)}}
        onNodeDragStop={(event, node) => {
                    const updatedNodes = nodes.map(n => 
                      n.id === node.id ? { ...n, position: node.position } : n
                    );
                    setNodes(updatedNodes);
                    savePlotNodes(updatedNodes);
                  }}
      >
        <Background />
        <Controls />
      </ReactFlow>

    </div>
  )
}

export default Graph
