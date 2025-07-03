import React, { useRef, useState } from 'react'
import './CyclicRedundancyCheck.css'
import Button from '../../components/Button/Button'
import { CRC } from '../../algorithms/crc.js'
import { setRandomErrorBit } from '../../utils/utils.js'
import SideBar from '../../components/SideBar/SideBar.jsx'

const CyclicRedundancyCheck = () => {
  const crc = new CRC();
  const bitInput = useRef();
  const messageInput = useRef();
  const generatorInput = useRef();
  const [residue, setResidue] = useState(null);
  const [frameSend, setFrameSend] = useState(null);
  const [frameTransmission, setFrameTransmission] = useState(null);
  
  
  const handleCalculate = () => {
    const message = messageInput.current.value.trim().split('');
    const generator = generatorInput.current.value.trim().split('');
    const modifyBit = bitInput.current.checked;

    const frame = crc.buidFrameTransmission(message, generator);
    const sent = modifyBit ? setRandomErrorBit(frame) : frame;
    const residueResult = crc.getResidue(sent, generator);


    setFrameTransmission(frame);
    setFrameSend(sent);
    setResidue(residueResult);
  };

  const handleClearData = () => {
    messageInput.current.value = '';
    generatorInput.current.value = '';
    bitInput.current.checked = false;    

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
          ref={messageInput}
        />
      </div>

      <div className='input-container'>
        <h1>Generador</h1>
        <input
          className='input generator-input'
          placeholder='Ingresar generador en binario'
          ref={generatorInput}
        />
      </div>

      <div className='input-container'>
        <h1>Modificar bit</h1>
        <input type='checkbox' ref={bitInput} />
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
