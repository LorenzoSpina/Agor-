import './App.css';
import Bazar from './pages/Bazar'
import ChatPage from './pages/ChatPage'
import AuthenticationPage from './pages/AuthenticationPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ServicesUserPage from './pages/ServicesUserPage'
import AddServicePage from './pages/AddServicePage';
import ErrorPage from './pages/ErrorPage';
import ServicePage from './pages/ServicePage';


function App() {

  {/*const [socket, setSocket] = React.useState(null)
  const toast = useToast()


  function getToken() {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if (!user) return null
    else return user.data.token
  }

  const setupSocket = () => {
    let token = getToken()
    if(token && !socket){
      const newSocket = io("http://localhost:5000", {
        query: {
          token: getToken(),
        },
      })
      newSocket.on("disconnect", () => {
        setSocket(null)
        setTimeout(setupSocket, 3000)
        toast({
          title: "Socket disconnect",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
      })
      newSocket.on("connect", () => {
        toast({
          title: "Socket connected",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
      })
      setSocket(newSocket)
    }  
  }

  React.useEffect(() => {
    setupSocket()
  }, [])*/}

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Bazar/>} exact/>
            <Route path='/chats' element={<ChatPage  />} />
            <Route path='/auth' element={<AuthenticationPage  />} />
            <Route path='/services' element={<ServicesUserPage />} />
            <Route path='/add-service' element={<AddServicePage />} />
            <Route path='/service' element={<ServicePage />} />

            <Route path='*' element={<ErrorPage error={404}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
