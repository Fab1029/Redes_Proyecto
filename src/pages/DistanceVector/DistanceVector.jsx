import React, { use, useEffect, useState } from 'react'
import './DistanceVector.css'
import SideBar from '../../components/SideBar/SideBar'
import Graph from '../../components/Graph/Graph'
import { DistanceVector as DistanceVectorAlgorithm } from '../../algorithms/distance_vector.js'
import { loadGraph, loadPloatNodes, loadPlotEdges} from '../../data/data.js'

import {
    useNodesState,
    useEdgesState
} from 'reactflow';
import Button from '../../components/Button/Button'

const DistanceVector = () => {
    const [iteration, setIteration] = useState(1);
    const [graph, setGraph] = useState(loadGraph());
    const [iterations, setIterations] = useState(null);
    const distanceVector = new DistanceVectorAlgorithm();
    const [edges, setEdges, onEdgesChange] = useEdgesState(loadPlotEdges());
    const [nodes, setNodes, onNodesChange] = useNodesState(loadPloatNodes());
    
    
    useEffect(() => {
        if (graph.length > 0 && iterations === null) {
            const initialIterations = distanceVector.initIterationsDistanceVector(graph);
            setIterations(initialIterations);
        }

        if (graph.length === 0) { 
            setIteration(1);
            setIterations(null);
        }

    }, [graph]);
    
    useEffect(() => {
        if (iterations && iterations[1] === undefined) {
            const next = distanceVector.getNextIterationDistanceVector(graph, iterations, 1);
            setIterations(next);
        }
    }, [iterations]);
    
    const handleNextIteration = () => {
        if (iterations[iteration + 1] === undefined) {
            const nextIteration = distanceVector.getNextIterationDistanceVector(graph, iterations, iteration + 1);
            setIterations(nextIteration);
        }

        setIteration(iteration + 1);
    };

    const handlePreviewIteration = () => {
        if (iteration > 1) {
            setIteration(iteration - 1);
        }
    };

    return (
    <div className='distance-vector-page'>
      <SideBar/>
      <div className='left-graph-container'>
        <Graph useGraph={[graph, setGraph]} useNodes={[nodes, setNodes, onNodesChange]} useEdges={[edges, setEdges, onEdgesChange]} showButtons={false}/>
      </div>
      {graph.length > 0 && iterations && iterations[iteration] && (
        <div className='right-distance-vector-container'>
            <div className='distance-vector-iteration-container'>
                <h1>Información vector distancia iteración {iteration}</h1>
                {Object.entries(iterations[iteration]).map(([nodeLabel, tableDistanceVector]) => (
                    <div className='distance-vector-info-container' key={nodeLabel}>
                        <h2>Nodo {nodeLabel}</h2>
                        <div className='distance-vector-table-container'> 
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>{/*ESPACIO*/}</th>
                                        {graph.find((node) => node.label === nodeLabel).edges.map((edge) => (<th>{edge.node.label}</th>))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(iterations[iteration]).map((label, index) => (
                                        <tr>
                                            <th>{label}</th>
                                            {graph.find((node) => node.label === nodeLabel).edges.map((edge) => (
                                                <td>
                                                    {iterations[iteration - 1][edge.node.label][index][0]
                                                        === Infinity ? '∞' : iterations[iteration][edge.node.label][index][0]}
                                                </td>
                                            ))}
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className='table'>
                                <thead>
                                    <tr><th>{nodeLabel}</th></tr>
                                </thead>
                                <tbody>
                                    {tableDistanceVector.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row[0] === Infinity ? '∞' : row[0]}</td>
                                            <td>{row[1]}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                        
                    </div>
                        
                ))}
            </div>
            <div className='buttons-step-container'>
                <Button
                    text={'🡸 Anterior'}
                    color={iteration > 1 ? '#002642' : 'gray'}
                    textColor={'white'}
                    onClick={handlePreviewIteration}

                />

                <Button
                    text={'🡺 Siguiente'}
                    color={'#002642'}
                    textColor={'white'}
                    onClick={handleNextIteration}
                />

            </div>
        </div>
      )}
      

    </div>
  )
}

export default DistanceVector
