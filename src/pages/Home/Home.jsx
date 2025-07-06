import React, { useEffect, useState } from 'react'
import './Home.css'
import { loadGraph, loadPloatNodes, loadPlotEdges } from '../../data/data.js'
import SideBar from '../../components/SideBar/SideBar'
import Graph from '../../components/Graph/Graph'

import {
    useNodesState,
    useEdgesState
} from 'reactflow';

const Home = () => {
  const [graph, setGraph] = useState(loadGraph());
  const [nodes, setNodes, onNodesChange] = useNodesState(loadPloatNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadPlotEdges());

  return (
    <div className='home-page'>
      <SideBar />
      <Graph useGraph={[graph, setGraph]} useNodes={[nodes, setNodes, onNodesChange]} useEdges={[edges, setEdges, onEdgesChange]} showButtons={true}/>
    </div>
  )
}

export default Home
