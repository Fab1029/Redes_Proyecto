import React, { use, useRef, useState } from 'react'
import './Hamming.css'
import { Hamming as HammingAlgorithm} from '../../algorithms/hamming.js'
import { setRandomErrorBit } from '../../utils/utils.js'
import SideBar from '../../components/SideBar/SideBar'
import Button from '../../components/Button/Button'

const Hamming = () => {
  const [message, setMessage] = useState('');
  const [indexStep, setIndexStep] = useState(0);
  const [bitPosition, setBitPosition] = useState(1);
  const [selectedOption, setSelectedOption] = useState('none');
  
  const hamming = new HammingAlgorithm();  
  const [errorBit, setErrorBit] = useState(null);
  const [bitsNumber, setBitsNumber] = useState(null);
  const [parityNumber, setParityNumber] = useState(null);
  const [frameHamming, setFrameHamming] = useState(null);
  const [parityMatrix, setParityMatrix] = useState(null);
  const [frameHammingSent, setFrameHammingSent] = useState(null);
  const [parityMatrixSteps, setParityMatrixSteps] = useState(null);

  const handleCalculteButton = () => {
    const messageInput = message.trim().split('');
    
    let sent = null;
    
    if (selectedOption === 'random') {
        sent = setRandomErrorBit(messageInput).join('');
    }
    else if (selectedOption === 'manual' && bitPosition > 0 && bitPosition <= messageInput.length) {
        let buildFrameArray = [...messageInput];

        buildFrameArray[bitPosition - 1] === '0' 
        ? buildFrameArray[bitPosition - 1] = '1' 
        : buildFrameArray[bitPosition - 1] = '0';

        sent = buildFrameArray.join('');
    }
    else {
        sent = messageInput;
    }
    
    const frameErrorParityMatrix = hamming.buildParityMatrix(sent);
    const frameParityMatrix = hamming.buildParityMatrix(messageInput);
    const frameHammingBuild = hamming.buildHammingFrame(messageInput, frameParityMatrix.parity_matrix);
    const frameErrorHammingBuild = hamming.buildHammingFrame(sent, frameErrorParityMatrix.parity_matrix);

    const detectedErrorBit = hamming.getPositionErrorBit(frameHammingBuild.split(''), frameErrorHammingBuild.split(''));
    
    setBitsNumber(messageInput.length);
    setFrameHammingSent(frameHammingBuild);
    setFrameHamming(frameErrorHammingBuild);
    setParityNumber(hamming.getParityBitsCount(messageInput));

    setErrorBit(
        detectedErrorBit === 0 ? 
            'Trama enviada sin errores' : 
            detectedErrorBit
    );

    setParityMatrix(frameErrorParityMatrix.parity_matrix);
    frameErrorParityMatrix.steps.length > 0 
        ? setParityMatrixSteps(frameErrorParityMatrix.steps) 
        : setParityMatrixSteps(null);

  };

  const handleClearButton = () => {
    setMessage('');
    setErrorBit(null);
    setBitsNumber(null);
    setParityNumber(null);
    setFrameHamming(null);

    setIndexStep(0);
    setBitPosition(1);
    setParityMatrix(null);
    setSelectedOption('none');
    setFrameHammingSent(null);
    setParityMatrixSteps(null);
  };

  const handleNextStep = () => {
    if (indexStep < parityMatrixSteps.length - 1) {
        setIndexStep(indexStep + 1);
    };
  };

  const handlePrevStep = () => {
    if (indexStep > 0) {
        setIndexStep(indexStep - 1);
    };
  };

  const handleChangeOptionBit = (option) => {
    setSelectedOption(option);
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
                <ul>
                    <li key={'radio-button-none'} className='radio-button'>
                        <input
                            type='radio'
                            name='modifyBit'
                            value={'none'}
                            checked={selectedOption === 'none'}
                            onChange={() => {handleChangeOptionBit('none');}}
                        />
                        <label>Sin modificaciones</label>
                    </li>
                    <li key={'radio-button-random'} className='radio-button'>
                        <input
                            type='radio'
                            name='modifyBit'
                            value={'random'}
                            checked={selectedOption === 'random'}
                            onChange={() => {handleChangeOptionBit('random');}}
                        />
                        <label>Modificar bit aleatorio</label>
                    </li>
                    <li key={'radio-button-manual'} className='radio-button'>
                        <input
                            type='radio'
                            name='modifyBit'
                            value={'manual'}
                            checked={selectedOption === 'manual'}
                            onChange={() => {handleChangeOptionBit('manual');}}
                        />
                        <label>Modificar bit manual</label>
                        {selectedOption === 'manual' && (
                            <>
                            <input
                                type='number'
                                min={1}
                                value={bitPosition}
                                placeholder='Ingresar indice bit'
                                onChange={(e) => {
                                const val = e.target.value; 
                                if (/^[0-9]*$/.test(val))
                                    setBitPosition(Number(val));
                                }
                                }
                            />
                            </>
                        )}
                    </li>

                </ul>
                
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
            <h2 style={{textAlign: 'center'}}>Matriz de pariedad de Hamming</h2>
            
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

            {parityMatrixSteps && (
                <div className='matrix-step-container'>
                    <h2>Paso {indexStep + 1} Matriz de pariedad de Hamming</h2>

                    <table className='table'>
                        <thead>
                        <tr>
                            <th></th>
                            {parityMatrixSteps[indexStep][0].map((_, colIdx) => (
                                <th key={`header-${colIdx}`}>{colIdx + 1}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {parityMatrixSteps[indexStep].map((row, rowIdx) => (
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
                    <div className='buttons-step-container'>
                        <Button
                            text={'🡸 Anterior'}
                            color={indexStep > 0 ? '#002642' : 'gray'}
                            textColor={'white'}
                            onClick={handlePrevStep}
                        />

                        <Button
                            text={'🡺 Siguiente'}
                            color={indexStep < parityMatrixSteps.length - 1 ? '#002642' : 'gray'}
                            textColor={'white'}
                            onClick={handleNextStep}
                        />

                    </div>
                </div>
            )}
            
        </div>
      
    </div>
  )
}

export default Hamming
