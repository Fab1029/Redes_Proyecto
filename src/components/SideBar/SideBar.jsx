import React, { useState } from 'react'
import './SideBar.css'

const SideBar = () => {
    const [menu, setMenu]  = useState(false);

    const handleMenu = () => {
        setMenu(!menu);
    };

    return (
        <>
            {
                menu ?
                (
                    <div className= {`sidebar ${menu ? 'show' : ''}`}>
        
                        <svg className='icon' onClick={handleMenu} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20M4 8H20M4 16H12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        <ul className='sidebar-list'>
                            
                            <li className='sidebar-item'>
                                <a href="/">Home</a>
                            </li>
                            
                            <li className='sidebar-item'>
                                <a href="/crc">Cyclic Redundancy Check</a>
                            </li>

                        </ul>

                    </div>
                ) : (
                    <svg className='icon menu-icon' onClick={handleMenu} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12H20M4 8H20M4 16H12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                )
            }
        </>
    
  )
}

export default SideBar
