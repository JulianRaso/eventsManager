import './styles/app.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './ui/AppLayout'


//Pages


export default function App(){
  return(
    <BrowserRouter>
      <Routes>
      <Route index element={<AppLayout />} />
      
    </Routes>
    </BrowserRouter>
  )
}