import React, { useRef, useState } from 'react'
import './CyclicRedundancyCheck.css'
import Button from '../../components/Button/Button'
import { CRC } from '../../algorithms/crc.js'
import { setRandomErrorBit } from '../../utils/utils.js'
import SideBar from '../../components/SideBar/SideBar.jsx'


const CyclicRedundancyCheck = () => {
  const crc = new CRC();
  
  const [message, setMessage] = useState('');
  const [generator, setGenerator] = useState('');
  const [bitPosition, setBitPosition] = useState(1);
  const [selectedOption, setSelectedOption] = useState('none');

  const [frame, setFrame] = useState(null);
  const [residue, setResidue] = useState(null);
  const [frameTransmited, setFrameTransmited] = useState(null);
  const [divisionStepsFrameTransmited, setDivisionStepsFrameTransmited] = useState(null);
  
  
  const handleCalculate = () => {
    const buildFrame = crc.buidFrameTransmission(
      message.trim().split(''),
      generator.trim().split('')
    );
    
    // Modificar bit si es necesario el cambio
    let transmited = null;
    
    if (selectedOption === 'random') {
      transmited = setRandomErrorBit(buildFrame).join('');
    }
    else if (selectedOption === 'manual' && bitPosition > 0 && bitPosition <= buildFrame.length) {
      let buildFrameArray = buildFrame.split('');

      buildFrameArray[bitPosition - 1] === '0' 
        ? buildFrameArray[bitPosition - 1] = '1' 
        : buildFrameArray[bitPosition - 1] = '0';

      transmited = buildFrameArray.join('');
    }
    else {
      transmited = buildFrame;
    }
    
    const result = crc.getResidue(transmited, generator.trim().split(''));

    // Informacion adicional de transmicion de trama
    const residueResult = result.residue;
    const stepsTransmited = result.division_steps;

    setFrame(buildFrame);
    setResidue(residueResult);
    setFrameTransmited(transmited);
    setDivisionStepsFrameTransmited(stepsTransmited);
  };

  const handleClearData = () => {
    setMessage('');
    setGenerator('');
    setSelectedOption('none');
    
    setFrame(null);
    setResidue(null);
    setBitPosition(1);
    setFrameTransmited(null);
    setDivisionStepsFrameTransmited(null);
  };

  const handleChangeOptionBit = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className='crc-page'>
      <SideBar />
      <div className='left-side-crc-container'>
        <div className='input-container'>
          <h1>Mensaje</h1>
          <input
            className='input message-input'
            placeholder='Ingresar mensaje en binario'
            value={message}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[01]*$/.test(val)) setMessage(val); 
            }}
          />
        </div>

        <div className='input-container'>
          <h1>Generador</h1>
          <input
            className='input generator-input'
            placeholder='Ingresar generador en binario'
            value={generator}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[01]*$/.test(val)) setGenerator(val); 
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
                onChange={() => handleChangeOptionBit('none')}
              />
              <label>Sin modificaciones</label>
            </li>
            <li key={'radio-button-random'} className='radio-button'>
              <input
                type='radio'
                name='modifyBit'
                value={'random'}
                checked={selectedOption === 'random'}
                onChange={() => handleChangeOptionBit('random')}
              />
              <label>Modificar bit aleatorio</label>
            </li>
            <li key={'radio-button-manual'} className='radio-button'>
              <input
                type='radio'
                name='modifyBit'
                value={'manual'}
                checked={selectedOption === 'manual'}
                onChange={() => handleChangeOptionBit('manual')}
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
          onClick={handleCalculate}
          />
          
          <Button 
            text={'🗑️ Limpiar datos'} 
            color={'#DD1C1A'} 
            textColor={'white'}
            onClick={handleClearData}
          />
        </div>
        
        <div className='text-container'>
          <h1>Trama</h1>
          <p className='output-text'>{frame}</p>
        </div>

        <div className='text-container'>
          <h1>Enviado</h1>
          <p className='output-text'>{frameTransmited}</p>
        </div>

        <div className='text-container'>
          <h1>Residuo</h1>
          <p className='output-text'>{residue}</p>
        </div>

      </div>
      <div className='right-side-crc-container'>
            <h2>División Binaria Comprobación Trama Enviada</h2>
            {divisionStepsFrameTransmited && (
            <table className='table-division'>
              <thead>
                <tr>
                  {frameTransmited.split('').map((bit, index) => (
                    <th key={`frame-${index}`}>{bit}</th>
                  ))}
                  <th>{'➗'}</th>{/*ESPACIO*/}
                  {generator.split('').map((bit, index) => (
                    <th key={`gen-${index}`}>{bit}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {divisionStepsFrameTransmited.map((step, numberStep) => (
                  <React.Fragment key={`step-${numberStep}`}>
                    {/* Dividendo */}
                    <tr>
                      {Array.from({ length: numberStep }).map((_, i) => (
                        <td key={`space-div-${numberStep}-${i}`}></td>
                      ))}
                      {step.dividendo.map((bit, i) => (
                        <td key={`dividendo-${numberStep}-${i}`}>{bit}</td>
                      ))}
                      {numberStep === 0 && (
                        <>
                          {Array.from({ length: frameTransmited.length - generator.length }).map((_, i) => (
                            <td key={`empty-cociente-${i}`}></td>
                          ))}
                          <td></td>
                          {divisionStepsFrameTransmited.map((stepCociente, i) => (
                            <td className='quotient-table' key={`cociente-${i}`}>{stepCociente.cociente}</td>
                          ))}
                        </>
                      )}
                    </tr>

                    {/* Divisor con línea abajo */}
                    <tr>
                      {Array.from({ length: numberStep }).map((_, i) => (
                        <td key={`space-divisor-${numberStep}-${i}`}></td>
                      ))}
                      {step.divisor.map((bit, i) => (
                        <td
                          key={`divisor-${numberStep}-${i}`}
                          style={{ borderBottom: '0.5px solid black' }}
                        >
                          {bit}
                        </td>
                      ))}
                    </tr>

                    {/* Residuo */}
                    <tr>
                      {Array.from({ length: numberStep }).map((_, i) => (
                        <td key={`space-res-${numberStep}-${i}`}></td>
                      ))}
                      {step.residuo.map((bit, i) => (
                        <td key={`residuo-${numberStep}-${i}`}>{bit}</td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
      </div>
      

    </div>
  )
}

export default CyclicRedundancyCheck
