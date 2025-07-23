import React, { useState } from 'react'
import './CustomInput.css'
import Button from '../Button/Button';

const CustomInput = ({title, placeHolder, onSubmit, onCancel, validateInput = () => true}) => {
    const [value, setValue] = useState('');

    const handleConfirmButton = () => {
        const trimmedValue = value.trim();
        setValue('');
        onSubmit(trimmedValue);
    };

    const handleCancelButton = () => {
        setValue('');
        onCancel();
    };

    return (
    <div className='custom-input'>
        <label className='custom-input-label'>{title}</label>
        <input
            className='custom-input-field'
            type='text'
            placeholder={placeHolder}
            value={value}
            onChange={(e) => {if(validateInput(e)) setValue(e.target.value);}}
        />
        <div className='buttons-input-container'>
            <Button color={'#002642'} textColor={'white'} text={'Aceptar'} onClick={handleConfirmButton}/>
            <Button color={'#DD1C1A'} textColor={'white'} text={'Cancelar'} onClick={handleCancelButton}/>
        </div>
      
    </div>
  )
}

export default CustomInput
