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
  const [frameTransmission, setFrameTransmission] = useState(null);
  
  
  const handleCalculate = () => {
    const frame = crc.buidFrameTransmission(
      message.trim().split(''),
      generator.trim().split('')
    );
    
    const sent = modifyBit ? setRandomErrorBit(frame) : frame;
    const residueResult = crc.getResidue(
      sent, 
      generator.trim().split('')
    );

    setFrameTransmission(frame);
    setFrameSend(sent);
    setResidue(residueResult);
  };

  const handleClearData = () => {
    setMessage('');
    setGenerator('');
    setModifyBit(false);    

    setFrameTransmission(null);
    setFrameSend(null);
    setResidue(null);
  };

  return (
    <div className='crc-page'>
      <SideBar />
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
  )
}

export default CyclicRedundancyCheck
