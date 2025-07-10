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
                <h2>Gestionar tabla</h2>
                <div className='form-container'>
                    <div className='form-header-container'>
                        <h4>Router incial</h4>
                        <input 
                            className='input'
                            placeholder='Agregar nombre de router'
                            value={startRouter}
                            onChange={(e) => {setStartRouter(e.target.value)}}
                        />
                        <Button 
                            text={'➕ Agregar enlace'} 
                            color={'#7E7F83'} 
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
                        <h3>Enlaces</h3>
                        <ul className='links-list'>
                            {links.map((link, index) => (
                                <li key={index} className='link-item'>
                                    <h4>Router destino</h4>
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
                                    <h4>Peso</h4>
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
                <h2>Estado del enlace</h2>
                <div className='tables-links-container'>

                    {graph.map((node, index) => (
                        <table 
                            key={index} 
                            className="table link-state-table" 
                            onClick={() => {setSelectedTableIndex(index)}} 
                            style={{ backgroundColor: selectedTableIndex === index ? '#e98a1591' : 'white'}}
                        >
                            <thead>
                                <tr>
                                    <th>Router inicial</th>
                                    <th>{node.label}</th>
                                </tr>
                                <tr>
                                    <th>Destino</th>
                                    <th>Peso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {node.edges.map((edge, idx) => (
                                <tr key={idx}>
                                    <td>{edge.node.label}</td>
                                    <td>{edge.weight}</td>
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
