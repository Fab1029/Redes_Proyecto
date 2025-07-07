import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Hamming from './pages/Hamming/Hamming';
import CyclicRedundancyCheck from './pages/CyclicRedundancyCheck/CyclicRedundancyCheck';
import Dijkstra from './pages/Dijkstra/Dijkstra';
import Prim from './pages/Prim/Prim';
import LinkState from './pages/LinkState/LinkState';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/prim' element={<Prim />}/>
        <Route path='/hamming' element={<Hamming />}/>
        <Route path='/dijkstra' element={<Dijkstra />}/>
        <Route path='/crc' element={<CyclicRedundancyCheck />}/>
        <Route path='/link-state' element= {<LinkState />} />
      </Routes>
    </Router>
  )
}

export default App
