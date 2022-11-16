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

            <Route path='/service' element={<ServiceUserPage />} />
            <Route path='/my-profile' element={<MyProfilePage />} />
            <Route path='*' element={<ErrorPage error={404}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
