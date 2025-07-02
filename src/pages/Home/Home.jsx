import React from 'react'
import './Home.css'
import SideBar from '../../components/SideBar/SideBar'
import Graph from '../../components/Graph/Graph'
import Button from '../../components/Button/Button'


const Home = () => {
  
  const buttons = [
    <Button text={'🟢 Agregar nodo'} color={'#002642'} textColor={'white'}/>,
    <Button text={'🗑️ Eliminar nodo'} color={'#DD1C1A'} textColor={'white'}/>
  ];

  return (
    <div className='home'>
      <SideBar />
      <Graph buttons={buttons}/>
    </div>
  )
}

export default Home
