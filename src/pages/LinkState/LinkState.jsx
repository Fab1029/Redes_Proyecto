import React, { useState } from 'react'
import { Node } from '../../model/node.js'
import { Edge } from '../../model/edge.js'
import { LinkState as LinkStateAlgorithm} from '../../algorithms/link_state.js'
import './LinkState.css'
import SideBar from '../../components/SideBar/SideBar'
import Graph from '../../components/Graph/Graph'

import {
    useNodesState,
    useEdgesState
} from 'reactflow';
import Button from '../../components/Button/Button';


const LinkState = () => {
  const [graph, setGraph] = useState([]);
  const [links, setLinks] = useState([]);
  const [startRouter, setStartRouter] = useState('');
  const linkStateAlgorithm = new LinkStateAlgorithm();
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [selectedTableIndex, setSelectedTableIndex] = useState(null);

  const handleAddTable = () => {
    if (!startRouter.trim()) return;

    let startNode = graph.find((node) => node.label === startRouter.trim());

    if (!startNode) {
        const newNode = new Node(startRouter.trim()); 
        setGraph(prev => [...prev, newNode]);
        startNode = newNode;
    }

    links.forEach(link => {
        let endNode = graph.find((node) => node.label === link.to.trim());
        if (!endNode) {
            const newNode = new Node(link.to.trim()); 
            setGraph(prev => [...prev, newNode]);
            endNode = newNode;
        }
        startNode.addEdge(new Edge(endNode, parseInt(link.weight.trim())));
        endNode.addEdge(new Edge(startNode, parseInt(link.weight.trim())));
    });

    setLinks([]);
    setStartRouter('');
    
  };

  const handleGetNetwork = () => {
    const nodesPlot = linkStateAlgorithm.getPlotNodes(graph);
    const edgesPlot = linkStateAlgorithm.getEdgesPlot(graph);

    setNodes(nodesPlot);
    setEdges(edgesPlot);
  };

  const handleDeleteTables = () => {
    setGraph([]);
    setNodes([]);
    setEdges([]);
  };

  const handleDeleteTable = () => {
    const selectedNode = graph[selectedTableIndex];

    const updatedGraph = graph
        .filter((node) => node !== selectedNode)
        .map((node) => {
        const newNode = new Node(node.label);
        newNode.edges = node.edges.filter(edge => edge.node !== selectedNode);
        return newNode;
        });

    setGraph(updatedGraph);
    const nodesPlot = linkStateAlgorithm.getPlotNodes(updatedGraph);
    const edgesPlot = linkStateAlgorithm.getEdgesPlot(updatedGraph);
    setNodes(nodesPlot);
    setEdges(edgesPlot);
  };

  return (
    <div className='link-state-page'>
        <SideBar />
        <div className='link-state-left-container'>
            <ul className='options-link-state-list'>
                <li><Button text={'🗑️ Eliminar tabla'} color={'#E98A15'} textColor={'white'} onClick={handleDeleteTable}/></li>
                <li><Button text={'🗑️ Eliminar tablas'} color={'#DD1C1A'} textColor={'white'} onClick={handleDeleteTables}/></li>
                <li><Button text={'🟢 Obtener topología'} color={'#002642'} textColor={'white'} onClick={handleGetNetwork}/></li>
            </ul>

            <div className='add-table-container'>
                <h1>Gestionar tabla</h1>
                <div className='form-container'>
                    <div className='form-header-container'>
                        <h3>Router incial</h3>
                        <input 
                            className='input'
                            placeholder='Agregar nombre de router'
                            value={startRouter}
                            onChange={(e) => {setStartRouter(e.target.value)}}
                        />
                        <Button 
                            text={'➕ Agregar enlace'} 
                            color={'gray'} 
                            textColor={'white'} 
                            onClick={() => {
                                    const newLink = { to: '', weight: '' };
                                    setLinks(prev => [...prev, newLink]);
                                }
                            }
                        />
                        <Button 
                            text={'Guardar tabla'} 
                            color={'#002642'} 
                            textColor={'white'} 
                            onClick={handleAddTable}
                        />        
          
                    </div>
                    <div className='form-body-container'>
                        <h2>Enlaces</h2>
                        <ul className='links-list'>
                            {links.map((link, index) => (
                                <li key={index} className='link-item'>
                                    <h3>Router destino</h3>
                                    <input 
                                        className='input' 
                                        placeholder='Agregar nombre del router' 
                                        value={link.to}
                                        onChange={(e) => {
                                            const newLinks = [...links];
                                            newLinks[index].to = e.target.value;
                                            setLinks(newLinks);
                                        }}      
                                    />
                                    <h3>Peso</h3>
                                    <input 
                                        className='input' 
                                        placeholder='Ingresar peso del enlace' 
                                        value={link.weight}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                           
                                            if (/^\d*$/.test(value)) {
                                                const newLinks = [...links];
                                                newLinks[index].weight = value;
                                                setLinks(newLinks);
                                            }
                                        }}
                                    />
                                    <Button 
                                        text={'🗑️ Eliminar enlace'} 
                                        color={'#DD1C1A'} 
                                        textColor={'white'} 
                                        onClick={() => {setLinks(prevLinks => prevLinks.filter((_, i) => i !== index))}}
                                    />
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
                
            </div>

            <div className='network-topology-container'>
                <h1>Estado del enlace</h1>
                <div className='tables-links-container'>

                    {graph.map((node, index) => (
                        <table 
                            key={index} 
                            className="link-state-table" 
                            onClick={() => {setSelectedTableIndex(index)}} 
                            style={
                                {   borderCollapse: 'collapse', 
                                    width: '100%',
                                    backgroundColor: selectedTableIndex === index ? '#e98a1591' : 'white', 
                                }
                            }
                        >
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Router inicial</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>{node.label}</th>
                                </tr>
                                <tr>
                                    <th style={{ border: '1px solid black', padding: '8px' }} >Destino</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }} >Peso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {node.edges.map((edge, idx) => (
                                <tr key={idx} style={{ border: '1px solid black', padding: '8px' }} >
                                    <td style={{ border: '1px solid black', padding: '8px' }} >{edge.node.label}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }} >{edge.weight}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    ))}
                        
                </div>
            </div>

        </div>
        <div className='link-state-right-container'>
            <Graph useGraph={[null, null]} useNodes={[nodes, setNodes, onNodesChange]} useEdges={[edges, setEdges, onEdgesChange]} showButtons={false}/>
        </div>
      
    </div>
  )
}

export default LinkState
