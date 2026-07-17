import './App.css'
import { Routes,Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import InterviewPage from './pages/InterviewPage'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewHistory from './pages/InterviewHistory'
import InterviewReport from './pages/InterviewReport'
import Pricing from './pages/Pricing'

export const ServerUrl = "https://interviewiq-ai-g12q.onrender.com"

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
     const getUser = async()=>{
       try{
          const result = await axios.get(ServerUrl + "/api/user/current-user", {withCredentials:true})
          console.log(result.data)
          dispatch(setUserData(result.data))
       }
       catch(error){
         console.log(error)
         dispatch(setUserData(null))
       }
     }
     getUser()
  },[])

  return (
    <Routes>
        <Route path='/' element={<Home />} />
       <Route path="/auth" element={<Auth />} />
       <Route path="/interview" element={<InterviewPage />} />
       <Route path='/history' element={<InterviewHistory />} />
       <Route path='/report/:id' element={<InterviewReport />} />
       <Route path='/pricing' element={<Pricing />} />
    </Routes>
  )
}

export default App
