import React, { use, useEffect, useRef, useState } from 'react'
import './Dijkstra.css'
import { loadGraph, loadPloatNodes, loadPlotEdges} from '../../data/data.js'
import { Dijkstra as DijkstraAlgorithm } from '../../algorithms/dijkstra.js'
import SideBar from '../../components/SideBar/SideBar'
import Graph from '../../components/Graph/Graph'
import Button from '../../components/Button/Button'

import {
    useNodesState,
    useEdgesState
} from 'reactflow';


const Dijkstra = () => {
  const [graph, setGraph] = useState(loadGraph());
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadPlotEdges());
  const [nodes, setNodes, onNodesChange] = useNodesState(loadPloatNodes());

  const selectorNodeEnd = useRef(); 
  const selectorNodeStart = useRef();  
  const [route, setRoute] = useState(null);
  const dijkstra = new DijkstraAlgorithm();
  const [weightRoute, setWeightRoute] = useState(null);
  const [dijkstraMatrix, setDijkstraMatrix] = useState(null);
  const [dijkstraTranslateMatrix, setDijkstraTranslateMatrix] = useState(null);
  
  useEffect(() => {
    console.log('ENTRO POR QUE CAMBIO GRAPH');
    setRoute(null);
    setWeightRoute(null);
    setDijkstraMatrix(null);
    setDijkstraTranslateMatrix(null);
    

  }, [graph]);

  const handleCalcuteButton = () => {
    const endNodeLabel = selectorNodeEnd.current.value;
    const startNodeLabel = selectorNodeStart.current.value;
    
    const endNode = graph.filter((node) => node.label === endNodeLabel)[0];
    const startNode = graph.filter((node) => node.label === startNodeLabel)[0];
    
    const rawDijkstraMatrix = dijkstra.buildDijkstraMatrix(graph, startNode);
    const translateDijkstraMatrix = dijkstra.translateDijkstraMatrix(rawDijkstraMatrix);
    const pathRoute = dijkstra.getPath(rawDijkstraMatrix, graph, startNode, endNode);
    const weight = dijkstra.getPathWeight(rawDijkstraMatrix, graph, endNode);
    
    setRoute(pathRoute);
    setWeightRoute(weight);
    setDijkstraMatrix(rawDijkstraMatrix);
    setDijkstraTranslateMatrix(translateDijkstraMatrix)
  };

  return (
    <div className='dijkstra-page'>
        <SideBar/>
        <div className='left-graph-container'>
            <Graph useGraph={[graph, setGraph]} useNodes={[nodes, setNodes, onNodesChange]} useEdges={[edges, setEdges, onEdgesChange]} showButtons={true}/>
        </div>
        
        <div className='right-dijkstra-container'>

            <div className='selecter-nodes-container'>
                <div className='text-container'>
                    <h1>Nodo Inicial</h1>
                    <select className='custom-select' ref={selectorNodeStart}>
                        {graph.map((node, index) => (
                            <option key={index} value={node.label}>{node.label}</option>  
                        ))}

                    </select>
                </div>

                <div className='text-container'>
                    <h1>Nodo Final</h1>
                    <select className='custom-select' ref={selectorNodeEnd}>
                        {graph.map((node, index) => (
                            <option key={index} value={node.label}>{node.label}</option>  
                        ))};

                    </select>
                </div>
                <div className='button-selector-container'>
                    <Button 
                        text={'Calcular'} 
                        color={'#002642'} 
                        textColor={'white'}
                        onClick={handleCalcuteButton}
                    />
                </div>
                

            </div>
            {graph.length > 0 && dijkstraMatrix && dijkstraTranslateMatrix && (
                <>
                <div className='text-container-route'>
                    <h2>Ruta seleccionada</h2>
                    <p className='output-text'>{route}</p>
                </div>
                        
                <div className='text-container-route'>
                    <h2>Peso</h2>
                    <p className='output-text'>{weightRoute}</p>
                </div>

                <div className='dijkstra-table-container'>
                    <h2>Matriz Dijkstra</h2>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th></th>
                                {dijkstraMatrix[0].map((_, colIdx) => (
                                    <th key={`${colIdx}`}>
                                    {colIdx + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dijkstraTranslateMatrix.map((row, rowIdx) => (
                            <tr key={`row-${rowIdx}`}>
                                <th>
                                    {graph[rowIdx].label}
                                </th>
                                {row.map((cell, colIdx) => (
                                    dijkstraMatrix[rowIdx][colIdx] !== null &&
                                    dijkstraMatrix[rowIdx][colIdx] !== undefined &&
                                    dijkstraMatrix[rowIdx][colIdx]['isDefinitive'] === true ? (
                                        <td key={`${rowIdx}-${colIdx}`} style={{ background: '#002642', color: 'white'}}>
                                            {cell}
                                        </td>
                                    ) : (
                                        <td key={`${rowIdx}-${colIdx}`}>
                                            {cell}
                                        </td>
                                    )
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                
                </div>
                </>
            )}
        </div>
    </div>
  )
}



export default Dijkstra
