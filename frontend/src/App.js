import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Chat from './pages/chat';
import Login from './pages/login';
import Avatar from './pages/avatar'



function App() {
  return (
   
      <Router>
        <Routes>
        <Route path='/avatar' element={<Avatar />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Chat />} />
        </Routes>
      </Router>
    
    
  );
}

export default App;