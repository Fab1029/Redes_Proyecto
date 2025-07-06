import React, { useEffect, useState } from 'react'
import './Graph.css'
import { Node } from '../../model/node.js'
import { Edge } from '../../model/edge.js'
import { saveGraph, savePlotNodes, savePlotEdges } from '../../data/data.js'


import ReactFlow, {
    Controls,
    Background
} from 'reactflow';

import 'reactflow/dist/style.css';
import Button from '../Button/Button.jsx'


const Graph = (
  { useGraph,
    useNodes,
    useEdges,
    showButtons 
  }

) => {
  const [graph, setGraph] = useGraph;
  const [nodes, setNodes, onNodesChange] = useNodes;;
  const [edges, setEdges, onEdgesChange] = useEdges;
  
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

    // Si ya existe una conexion existente
    if (!startNode || !endNode || startNode.findNode(endNode)) return;

    startNode.addEdge(new Edge(endNode, weight));
    endNode.addEdge(new Edge(startNode, weight));

    const newEdge = {
      id: `${source}-${target}`,
      source:source,
      target:target,
      animated: true,
      type: 'straight',
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
    let nodeSelected = null;
    // Obtener el nodo a eliminar
    for (let nodeIter of nodes) {
      
      if (nodeIter.selected) {

        nodeSelected = nodeIter;
        break;
      }

    };
    
    if(nodeSelected === null) return;
    
    const selectedNodeId = nodeSelected.id;
  
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

    saveGraph(updatedGraph);
    savePlotNodes(updatedNodes);
    savePlotEdges(updatedEdges);
  };

 
  const onNodeDragStop = (event, node) => {
    // Actualiza la posición del nodo en el estado
    const updatedNodes = nodes.map(n => {
      if (n.id === node.id) {
        return { ...n, position: node.position };
      }
      return n;
    });

    setNodes(updatedNodes);
    savePlotNodes(updatedNodes);

    // También puedes actualizar el grafo lógico si manejas posición ahí
    const updatedGraph = graph.map(n => {
      if (n.label === node.id) {
        n.position = node.position;
      }
      return n;
    });

    setGraph(updatedGraph);
    saveGraph(updatedGraph);
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
        onNodeDragStop={onNodeDragStop}
      >
        <Background />
        <Controls />
      </ReactFlow>

    </div>
  )
}

export default Graph
