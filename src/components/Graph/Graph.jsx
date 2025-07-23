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
import CustomInput from '../CustomInput/CustomInput.jsx'


const Graph = (
  { useGraph,
    useNodes,
    useEdges,
    showButtons 
  }

) => {
  const [graph, setGraph] = useGraph;
  const [nodes, setNodes, onNodesChange] = useNodes;
  const [edges, setEdges, onEdgesChange] = useEdges;
  const [inputVisible, setInputVisible] = useState(false);
  const [inputConfig, setInputConfig] = useState({title: '', placeholder: '', onSubmit: () => {}, validateInput: () => true});
  

  const openInput = ({ title, placeholder, onSubmit, validateInput}) => {
    setInputConfig({ title: title, placeholder: placeholder, onSubmit: onSubmit, validateInput: validateInput });
    setInputVisible(true);
  };

  const closeInput = () => {
    setInputVisible(false);
    setInputConfig({ title: '', placeholder: '', onSubmit: () => {}, validateInput: () => true});
  };

  const addNode = () => {
    openInput({
      title: 'Agregar nodo',
      placeholder: 'Ej:A',
      onSubmit: (nodeLabel) => {
        if (!nodeLabel) return;

        if (graph.find((node) => node.label === nodeLabel)) return;
        
        const newNode = new Node(nodeLabel);
        const updatedGraph = [...graph, newNode];

        const newPlotNode = {
          id: nodeLabel,
          position: { x: Math.random() * 500, y: Math.random() * 500 },
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
        setInputVisible(false); 
      }
    });
  };


  const addEdge = ({ source, target }) => {
    openInput({
      title: 'Inresar peso a la arista',
      placeholder: 'Ej: 10',
      onSubmit: (inputValue) => {
        const weight = parseInt(inputValue);
        if (isNaN(weight)) return;

        const startNode = graph.find(n => n.label === source);
        const endNode = graph.find(n => n.label === target);
        if (!startNode || !endNode || startNode.findNode(endNode)) return;

        startNode.addEdge(new Edge(endNode, weight));
        endNode.addEdge(new Edge(startNode, weight));

        const newEdge = {
          id: `${source}-${target}`,
          source,
          target,
          animated: true,
          type: 'straight',
          label: weight.toString()
        };

        const updatedEdges = [...edges, newEdge];

        setEdges(updatedEdges);
        setGraph([...graph]); // importante para persistencia
        saveGraph(graph);
        savePlotEdges(updatedEdges);
        setInputVisible(false);
      },
      validateInput: (e) => /^[0-9]*$/.test(e.target.value)
    });
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      
      const nodeMap = new Map();
      const newEdges = [];
      const newGraph = [];

      // Crear nodos y aristas
      lines.forEach(line => {
        const [fromLabel, toLabel, weightStr] = line.split(',');
        const weight = parseInt(weightStr);

        if (!nodeMap.has(fromLabel)) {
          const fromNode = new Node(fromLabel);
          nodeMap.set(fromLabel, fromNode);
          newGraph.push(fromNode);
        }

        if (!nodeMap.has(toLabel)) {
          const toNode = new Node(toLabel);
          nodeMap.set(toLabel, toNode);
          newGraph.push(toNode);
        }

        const fromNode = nodeMap.get(fromLabel);
        const toNode = nodeMap.get(toLabel);

        if (!fromNode.findNode(toNode)) {
          fromNode.addEdge(new Edge(toNode, weight));
          toNode.addEdge(new Edge(fromNode, weight));

          newEdges.push({
            id: `${fromLabel}-${toLabel}`,
            source: fromLabel,
            target: toLabel,
            animated: true,
            type: 'straight',
            label: weight.toString()
          });
        }
      });

      const newNodes = Array.from(nodeMap.values()).map(node => ({
        id: node.label,
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        data: { label: node.label },
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
      }));

      // Guardar en estado y localStorage
      setGraph(newGraph);
      setNodes(newNodes);
      setEdges(newEdges);

      saveGraph(newGraph);
      savePlotNodes(newNodes);
      savePlotEdges(newEdges);
    };

    reader.readAsText(file);
  };

  const clearGraph = () => {
    setGraph([]);
    setNodes([]);
    setEdges([]);

    saveGraph([]);
    savePlotNodes([]);
    savePlotEdges([]);
  };

  return (
    <div className='graph'>
      <ul className={`buttons-list ${showButtons ? 'show': ''}`}>
          <li><Button text={'🟢 Agregar nodo'} color={'#002642'} textColor={'white'} onClick={addNode}/></li>
          <li><Button text={'📄 Cargar CSV'} color={'#007BFF'} textColor={'white'} onClick={() => document.getElementById('fileInput').click()} />
              <input
                type="file"
                accept=".csv,.txt"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
          </li>
          <li><Button text={'🗑️ Eliminar nodo'} color={'#E98A15'} textColor={'white'} onClick={removeNode}/></li>
          <li><Button text={'🗑️ Borrar grafo'} color={'#DD1C1A'} textColor={'white'} onClick={clearGraph}/></li>
          
      </ul>
      
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onConnect={addEdge}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        onNodeDragStop={showButtons ? onNodeDragStop : null}
      >
        <Background />
        <Controls />
      </ReactFlow>
      
      {inputVisible && (<CustomInput title={inputConfig.title} placeHolder={inputConfig.placeholder} onSubmit={inputConfig.onSubmit} onCancel={closeInput} validateInput={inputConfig.validateInput}/>)}
      

    </div>
  )
}

export default Graph
