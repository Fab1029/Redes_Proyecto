import React, { useEffect, useState } from 'react'
import './SideBar.css'
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);
    const [selected, setSelected] = useState('/');
    
    const handleMenu = () => {
        setMenu(!menu);
    };

    // Leer la opción seleccionada desde sessionStorage al cargar
    useEffect(() => {
        const stored = sessionStorage.getItem('selectedSidebarOption');
        if (stored) {
            setSelected(stored);
        }
    }, []);

    // Guardar en sessionStorage cuando cambia la opción
    useEffect(() => {
        sessionStorage.setItem('selectedSidebarOption', selected);
    }, [selected]);

    // Navegación y cambio de opción
    const handleOptionClick = (path) => {
        setSelected(path);
        navigate(path);  // si estás usando React Router
    };

    return (
        <>
            {
                menu ? (
                    <div className={`sidebar ${menu ? 'show' : ''}`}>

                        <svg className='icon' onClick={handleMenu} viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20M4 8H20M4 16H12"
                                stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <ul className='sidebar-list'>

                            {[
                                { label: 'Inicio', path: '/' },
                                { label: 'Prim', path: '/prim' },
                                { label: 'Dijkstra', path: '/dijkstra' },
                                { label: 'Hamming', path: '/hamming' },
                                { label: 'Vector distancia', path: '/distance-vector' },
                                { label: 'Estado del enlace', path: '/link-state' },
                                { label: 'Comprobación de redundancia cíclica', path: '/crc' },
                            ].map(({ label, path }) => (
                                <li
                                    key={path}
                                    className={`sidebar-item ${selected === path ? 'active' : ''}`}
                                    onClick={() => handleOptionClick(path)}
                                >
                                    {label}
                                </li>
                            ))}

                        </ul>

                    </div>
                ) : (
                    <svg className='icon menu-icon' onClick={handleMenu} viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12H20M4 8H20M4 16H12"
                            stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            }
        </>
    )
}

export default SideBar;
