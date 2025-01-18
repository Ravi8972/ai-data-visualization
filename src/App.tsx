import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Navbar from './components/Navbars/Navbar.tsx';
import './App.css';
import Home from './pages/Home.tsx';

const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
    <div className={`App App-${theme || 'light'}`}>
      <Navbar />
      <div className="home-container" >
      <Home />
      </div>
   
    </div>
  );
};

export default App;
