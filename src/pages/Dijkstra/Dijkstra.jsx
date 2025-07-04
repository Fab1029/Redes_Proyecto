import React, { useRef, useState } from 'react'
import './Dijkstra.css'
import { loadGraph } from '../../data/data.js'
import { Dijkstra as DijkstraAlgorithm } from '../../algorithms/dijkstra.js'
import SideBar from '../../components/SideBar/SideBar'
import Graph from '../../components/Graph/Graph'
import Button from '../../components/Button/Button'


const Dijkstra = () => {
  const graph = loadGraph();  
  const selectorNodeEnd = useRef(); 
  const selectorNodeStart = useRef();  
  const [route, setRoute] = useState(null);
  const dijkstra = new DijkstraAlgorithm();
  const [dijkstraMatrix, setDijkstraMatrix] = useState(null);
  const [dijkstraTranslateMatrix, setDijkstraTranslateMatrix] = useState(null);
  
  const handleCalcuteButton = () => {
    const endNodeLabel = selectorNodeEnd.current.value;
    const startNodeLabel = selectorNodeStart.current.value;
    
    const endNode = graph.filter((node) => node.label === endNodeLabel)[0];
    const startNode = graph.filter((node) => node.label === startNodeLabel)[0];
    
    const rawDijkstraMatrix = dijkstra.buildDijkstraMatrix(graph, startNode);
    console.log(rawDijkstraMatrix);
    const translateDijkstraMatrix = dijkstra.translateDijkstraMatrix(rawDijkstraMatrix);
    const pathRoute = dijkstra.getPath(rawDijkstraMatrix, graph, startNode, endNode);
    
    setRoute(pathRoute);
    setDijkstraMatrix(rawDijkstraMatrix);
    setDijkstraTranslateMatrix(translateDijkstraMatrix)
  };

  return (
    <div className='dijkstra-page'>
        <SideBar/>
        <div className='left-graph-container'>
            <Graph buttons={[
                <Button text={'🟢 Agregar nodo'} color={'#002642'} textColor={'white'}/>,
                <Button text={'🗑️ Eliminar nodo'} color={'#DD1C1A'} textColor={'white'}/>
            ]}/>
        </div>
        
        <div className='right-dijkstra-container'>

            <div className='selecter-nodes-container'>
                <div className='text-container'>
                    <h1>Nodo Inicial</h1>
                    <select className='custom-select' ref={selectorNodeStart}>
                        {graph.map((node, index) => (
                            <option key={index} value={node.label}>{node.label}</option>  
                        ))};

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

                <Button 
                    text={'Calcular'} 
                    color={'#002642'} 
                    textColor={'white'}
                    onClick={handleCalcuteButton}
                />

            </div>
            
            <div className='dijkstra-table-container'>
                <h1>Matriz Dijkstra</h1>
                {dijkstraMatrix && dijkstraTranslateMatrix && (
                    <table className='parity-table' style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}></th>
                                {dijkstraMatrix[0].map((_, colIdx) => (
                                    <th key={`${colIdx}`} style={{ border: '1px solid black', padding: '8px' }}>
                                    {colIdx + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dijkstraTranslateMatrix.map((row, rowIdx) => (
                            <tr key={`row-${rowIdx}`}>
                                <th style={{ border: '1px solid black', padding: '8px' }}>
                                    {graph[rowIdx].label}
                                </th>
                                {row.map((cell, colIdx) => (
                                    dijkstraMatrix[rowIdx][colIdx] !== null &&
                                    dijkstraMatrix[rowIdx][colIdx] !== undefined &&
                                    dijkstraMatrix[rowIdx][colIdx]['isDefinitive'] === true ? (
                                        <td key={`${rowIdx}-${colIdx}`} style={{ background: '#ff00002d', border: '1px solid black', padding: '8px' }}>
                                            {cell}
                                        </td>
                                    ) : (
                                        <td key={`${rowIdx}-${colIdx}`} style={{ border: '1px solid black', padding: '8px' }}>
                                            {cell}
                                        </td>
                                    )
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            <div className='text-container-route'>
                <h1>Ruta seleccionada</h1>
                <p className='output-text'>{route}</p>
            </div>

        </div>
      
    </div>
  )
}



export default Dijkstra
