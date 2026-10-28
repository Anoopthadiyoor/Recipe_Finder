import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './Components/Footer'
import Header from './Components/Header'
import Add from './Pages/Add'
import Home from './Pages/Home'
import RecipeDetails from './Pages/RecipeDetails'

function App() {

  return (
    <>
    <Header />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='add' element={<Add/>}/>
      <Route path='edit/:id' element={<Add/>}/>
      <Route path='recipe/:id' element={<RecipeDetails/>}/>
      <Route path='home' element={<Home/>}/>
    </Routes>
    <Footer />
    </>
  )
}

export default App
