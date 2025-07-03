import React, { useRef, useState } from 'react'
import './Hamming.css'
import { Hamming as HammingAlgorithm} from '../../algorithms/hamming.js'
import { setRandomErrorBit } from '../../utils/utils.js'
import SideBar from '../../components/SideBar/SideBar'
import Button from '../../components/Button/Button'

const Hamming = () => {
  const bitInput = useRef();
  const messageInput = useRef();
  const hamming = new HammingAlgorithm();  
  const [errorBit, setErrorBit] = useState(null);
  const [bitsNumber, setBitsNumber] = useState(null);
  const [parityNumber, setParityNumber] = useState(null);
  const [frameHamming, setFrameHamming] = useState(null);
  const [parityMatrix, setParityMatrix] = useState(null);

  const handleCalculteButton = () => {
    const modifyBit = bitInput.current.checked;
    const message = messageInput.current.value.trim().split('');
    const sent = modifyBit ? setRandomErrorBit(message) : message;

    const frameParityMatrix = hamming.buildParityMatrix(message);
    const frameErrorParityMatrix = hamming.buildParityMatrix(sent);

    const frameHammingBuild = hamming.buildHammingFrame(message, frameParityMatrix);
    const frameErrorHammingBuild = hamming.buildHammingFrame(sent, frameErrorParityMatrix);

    const detectedErrorBit = hamming.getPositionErrorBit(frameHammingBuild.split(''), frameErrorHammingBuild.split(''));

    setBitsNumber(message.length);
    setParityNumber(hamming.getParityBitsCount(message));
    setFrameHamming(frameErrorHammingBuild);
    setErrorBit(
        detectedErrorBit === 0 ? 
            'Trama enviada sin errores' : 
            detectedErrorBit
    );
    setParityMatrix(frameErrorParityMatrix);

  };

  const handleClearButton = () => {
    messageInput.current.value = '';
    bitInput.current.checked = false;
    setErrorBit(null);
    setBitsNumber(null);
    setParityNumber(null);
    setFrameHamming(null);
    setParityMatrix(null);
  };

  return (
    <div className='hamming-page'>
        <SideBar/>
        
        <div className='left-side-container'>
            <div className='input-container'>
                <h1>Mensaje</h1>
                <input
                className='input message-input'
                placeholder='Ingresar mensaje en binario'
                ref={messageInput}
                />
            </div>
            <div className='input-container'>
                <h1>Modificar bit</h1>
                <input type='checkbox'ref={bitInput}/>
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
                <h1>Bit errado</h1>
                <p className='output-text'>{errorBit}</p>
            </div>
            

        </div>

        <div className='right-side-container'>
            <h1>Matriz de pariedad de Hamming</h1>
            
            {parityMatrix && (
                <table className='parity-table' style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}></th>
                            {parityMatrix[0].map((_, colIdx) => (
                                <th key={`${colIdx}`} style={{ border: '1px solid black', padding: '8px' }}>
                                {colIdx + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {parityMatrix.map((row, rowIdx) => (
                        <tr key={`row-${rowIdx}`}>
                            <th style={{ border: '1px solid black', padding: '8px' }}>
                                {Math.pow(2, rowIdx)}
                            </th>
                            {row.map((cell, colIdx) => (
                            <td key={`${rowIdx}-${colIdx}`} style={{ border: '1px solid black', padding: '8px' }}>
                                {cell !== null ? cell : '-'}
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
      
    </div>
  )
}

export default Hamming
