import React from 'react'
import './Home.css'
import SideBar from '../../components/SideBar/SideBar'
import Graph from '../../components/Graph/Graph'
import Button from '../../components/Button/Button'


const Home = () => {
  
  return (
    <div className='home-page'>
      <SideBar />
      <Graph showButtons={true}/>
    </div>
  )
}

export default Home
