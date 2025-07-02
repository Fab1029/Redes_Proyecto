import React from 'react'
import './Button.css'
const Button = ({text, color, textColor, onClick}) => {
  
  return (
    <div className='button' onClick={onClick} style={{color: textColor, background: color}}>
      {text}
    </div>
  )
}

export default Button
