import './App.css';
import Bazar from './pages/Bazar'
import ChatPage from './pages/ChatPage'
import AuthenticationPage from './pages/AuthenticationPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ServicesUserPage from './pages/ServicesUserPage'
import AddServicePage from './pages/AddServicePage';
import ErrorPage from './pages/ErrorPage';
import MyProfilePage from './pages/MyProfilePage'
import ServiceUserPage from './pages/ServiceUserPage';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Bazar/>} exact/>
            <Route path='/chats' element={<ChatPage  />} />
            <Route path='/auth' element={<AuthenticationPage  />} />
            <Route path='/services' element={<ServicesUserPage />} />
            <Route path='/add-service' element={<AddServicePage />} />
            <Route path='/service' element={<ServiceUserPage />} />
            <Route path='/my-profile' element={<MyProfilePage />} />
            <Route path='*' element={<ErrorPage error={404}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
