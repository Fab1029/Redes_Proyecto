import React, { useRef, useState } from 'react'
import './Hamming.css'
import { Hamming as HammingAlgorithm} from '../../algorithms/hamming.js'
import { setRandomErrorBit } from '../../utils/utils.js'
import SideBar from '../../components/SideBar/SideBar'
import Button from '../../components/Button/Button'

const Hamming = () => {
  const [message, setMessage] = useState('');
  const [modifyBit, setModifyBit] = useState(false);
  
  const hamming = new HammingAlgorithm();  
  const [errorBit, setErrorBit] = useState(null);
  const [bitsNumber, setBitsNumber] = useState(null);
  const [parityNumber, setParityNumber] = useState(null);
  const [frameHamming, setFrameHamming] = useState(null);
  const [parityMatrix, setParityMatrix] = useState(null);
  const [parityMatrixSteps, setParityMatrixSteps] = useState([]);
  const [frameHammingSent, setFrameHammingSent] = useState(null);

  const handleCalculteButton = () => {
    const messageInput = message.trim().split('');
    const sent = modifyBit ? setRandomErrorBit(messageInput) : messageInput;

    const frameErrorParityMatrix = hamming.buildParityMatrix(sent);
    const frameParityMatrix = hamming.buildParityMatrix(messageInput);
    console.log(frameErrorParityMatrix)
    const frameHammingBuild = hamming.buildHammingFrame(messageInput, frameParityMatrix.parity_matrix);
    const frameErrorHammingBuild = hamming.buildHammingFrame(sent, frameErrorParityMatrix.parity_matrix);

    const detectedErrorBit = hamming.getPositionErrorBit(frameHammingBuild.split(''), frameErrorHammingBuild.split(''));

    setBitsNumber(messageInput.length);
    setParityNumber(hamming.getParityBitsCount(messageInput));
    setFrameHamming(frameErrorHammingBuild);
    setFrameHammingSent(frameHammingBuild);
    setErrorBit(
        detectedErrorBit === 0 ? 
            'Trama enviada sin errores' : 
            detectedErrorBit
    );
    // Cambiar qui deno mnada rla lista de step de tablas 
    setParityMatrix(frameErrorParityMatrix.parity_matrix);
    setParityMatrixSteps(frameErrorParityMatrix.steps);

  };

  const handleClearButton = () => {
    setMessage('');
    setErrorBit(null);
    setModifyBit(false);
    setBitsNumber(null);
    setParityNumber(null);
    setFrameHamming(null);

    setParityMatrix(null);
    setParityMatrixSteps([]);
    setFrameHammingSent(null);
  };

  return (
    <div className='hamming-page'>
        <SideBar/>
        
        <div className='left-side-container'>
            <div className='input-container'>
                <h1>Mensaje</h1>
                <input
                value={message}
                className='input message-input'
                placeholder='Ingresar mensaje en binario'
                onChange={(e) => {
                    const val = e.target.value;
                    if (/^[01]*$/.test(val)) setMessage(val); 
                    }}
                />
            </div>
            <div className='input-container'>
                <h1>Modificar bit</h1>
                <input 
                    type='checkbox'
                    value={modifyBit}
                    onChange={(e) => setModifyBit(e.target.checked)}  
                />
            </div>

            <div className='buttons-container'>
                <Button
                text={'🟢 Calcular'}
                color={'#002642'}
                textColor={'white'}
                onClick={handleCalculteButton}
                />
                
                <Button 
                text={'🗑️ Limpiar datos'} 
                color={'#DD1C1A'} 
                textColor={'white'}
                onClick={handleClearButton}
                />
            </div>

            <div className='text-container'>
                <h1>Numero de bits</h1>
                <p className='output-text'>{bitsNumber}</p>
            </div>

            <div className='text-container'>
                <h1>Numero de pariedad</h1>
                <p className='output-text'>{parityNumber}</p>
            </div>


            <div className='text-container'>
                <h1>Trama Hamming</h1>
                <p className='output-text'>{frameHamming}</p>
            </div>

            <div className='text-container'>
                <h1>Trama Hamming Enviada</h1>
                <p className='output-text'>{frameHammingSent}</p>
            </div>

            <div className='text-container'>
                <h1>Bit errado</h1>
                <p className='output-text'>{errorBit}</p>
            </div>
            

        </div>

        <div className='right-side-container'>
            <h2>Matriz de pariedad de Hamming</h2>
            
            {parityMatrix && (
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            {parityMatrix[0].map((_, colIdx) => (
                                <th key={`${colIdx}`}>
                                {colIdx + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {parityMatrix.map((row, rowIdx) => (
                        <tr key={`row-${rowIdx}`}>
                            <th>
                                {Math.pow(2, rowIdx)}
                            </th>
                            {row.map((cell, colIdx) => (
                            <td key={`${rowIdx}-${colIdx}`}>
                                {cell !== null ? cell : '-'}
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {setParityMatrixSteps.length > 0 && (
                parityMatrixSteps.map((stepMatrix, stepIndex) => (
                    <div key={`step-${stepIndex}`} className="matrix-step-container">
                        <h3>Paso {stepIndex + 1}</h3>
                        <table className='table'>
                            <thead>
                            <tr>
                                <th></th>
                                {stepMatrix[0].map((_, colIdx) => (
                                <th key={`header-${colIdx}`}>{colIdx + 1}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {stepMatrix.map((row, rowIdx) => (
                                <tr key={`row-${rowIdx}`}>
                                <th>{Math.pow(2, rowIdx)}</th>
                                {row.map((cell, colIdx) => (
                                    <td key={`cell-${rowIdx}-${colIdx}`}>
                                    {cell !== null ? cell : '-'}
                                    </td>
                                ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
            )))}
            
        </div>
      
    </div>
  )
}

export default Hamming
