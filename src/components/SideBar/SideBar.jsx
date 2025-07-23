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
                            <path d="M4 12H20M4 8H20M4 16H12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                        <ul className='sidebar-list'>
                            
                            <li className='sidebar-item'>
                                <a href="/">Inicio</a>
                            </li>
                            
                            <li className='sidebar-item'>
                                <a href="/prim">Prim</a>
                            </li>

                            <li className='sidebar-item'>
                                <a href="/dijkstra">Dijkstra</a>
                            </li>
                            
                            <li className='sidebar-item'>
                                <a href="/hamming">Hamming</a>
                            </li>

                            <li className='sidebar-item'>
                                <a href="/link-state">Estado del enlace</a>
                            </li>

                            <li className='sidebar-item'>
                                <a href="/crc">Comprobación de redundancia cíclica</a>
                            </li>

                        </ul>

                    </div>
                ) : (
                    <svg className='icon menu-icon' onClick={handleMenu} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12H20M4 8H20M4 16H12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )
            }
        </>
    
  )
}

export default SideBar
