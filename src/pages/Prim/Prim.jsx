import React, { useEffect, useState } from 'react'
import './Prim.css'
import { PRIM } from '../../algorithms/prim.js'
import { loadGraph, loadPloatNodes, loadPlotEdges} from '../../data/data.js'
import Graph from '../../components/Graph/Graph';
import SideBar from '../../components/SideBar/SideBar.jsx';

import {
    useNodesState,
    useEdgesState
} from 'reactflow';

const Prim = () => {
  const prim = new PRIM();
  const [primTree, setPrimTree] = useState([]);
  const [graph, setGraph] = useState(loadGraph());
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadPlotEdges());
  const [nodes, setNodes, onNodesChange] = useNodesState(loadPloatNodes());
  const [nodesPrim, setNodesPrim, onNodesPrimChange] = useNodesState([]);
  const [edgesPrim, setEdgesPrim, onEdgesPrimChange] = useEdgesState([]);

  
  useEffect(() => {
    if (graph.length) {
      let tree = prim.getTree(graph);
      setPrimTree(tree);
    }

  }, [graph]);

  useEffect(() => {
    if (primTree.length) {
      translatePrimToGraph();
    }
  }, [primTree]);

  const translatePrimToGraph = () => {
    let edgesPlot = [];
    
    primTree.forEach((edge) => {
      const newEdge = {
        id: `${edge.from}-${edge.to}`,
        source:edge.from,
        target:edge.to,
        animated: true,
        type: 'straight',
        label: edge.weight.toString()
      };

      edgesPlot.push(newEdge);
      
    });

    setNodesPrim(nodes);
    setEdgesPrim(edgesPlot);

  };


  return (
    <div className='prim-page'>
        <SideBar/>
      <div className='left-prim-container'>
          <Graph useGraph={[graph, setGraph]} useNodes={[nodes, setNodes, onNodesChange]} useEdges={[edges, setEdges, onEdgesChange]} showButtons={true}/>
      </div>
      <div className='right-prim-container'>
        <h1 className='title-graph-prim'>Arbol Prim</h1>
          {graph.length > 0 && (
            <Graph useGraph={[graph, setGraph]} useNodes={[nodesPrim, setNodesPrim, onNodesPrimChange]} useEdges={[edgesPrim, setEdgesPrim, onEdgesPrimChange]} showButtons={false}/>
          )}
          </div>
    </div>
  )
}

export default Prim
