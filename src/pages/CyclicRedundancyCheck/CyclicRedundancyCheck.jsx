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
  const [modifyBit, setModifyBit] = useState(false);

  const [residue, setResidue] = useState(null);
  const [frameSend, setFrameSend] = useState(null);
  const [divisionSteps, setDivisionSteps] = useState(null);
  const [frameTransmission, setFrameTransmission] = useState(null);
  
  
  const handleCalculate = () => {
    const frame = crc.buidFrameTransmission(
      message.trim().split(''),
      generator.trim().split('')
    );
    
    const sent = modifyBit ? setRandomErrorBit(frame).join('') : frame;
    const result = crc.getResidue(sent, generator.trim().split(''));

    const residueResult = result.residue;
    const steps = result.division_steps;

    setFrameTransmission(frame);
    setFrameSend(sent);
    setResidue(residueResult);
    setDivisionSteps(steps);
    console.log(steps);
  
  };

  const handleClearData = () => {
    setMessage('');
    setGenerator('');
    setModifyBit(false);    

    setFrameTransmission(null);
    setFrameSend(null);
    setResidue(null);
    setDivisionSteps(null);
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
          <p className='output-text'>{frameTransmission}</p>
        </div>

        <div className='text-container'>
          <h1>Enviado</h1>
          <p className='output-text'>{frameSend}</p>
        </div>

        <div className='text-container'>
          <h1>Residuo</h1>
          <p className='output-text'>{residue}</p>
        </div>

      </div>

      <div className='right-side-crc-container'>
            <h2>Division Binaria Comprobacion Trama Enviada</h2>
            {divisionSteps && (
            <table className='table-division'>
              <thead>
                <tr>
                  {frameSend.split('').map((bit, index) => (
                    <th key={`frame-${index}`}>{bit}</th>
                  ))}
                  <th>{'➗'}</th>{/*ESPACIO*/}
                  {generator.split('').map((bit, index) => (
                    <th key={`gen-${index}`}>{bit}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {divisionSteps.map((step, numberStep) => (
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
                          {Array.from({ length: frameSend.length - generator.length }).map((_, i) => (
                            <td key={`empty-cociente-${i}`}></td>
                          ))}
                          <td></td>
                          {divisionSteps.map((stepCociente, i) => (
                            <td key={`cociente-${i}`}>{stepCociente.cociente}</td>
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
