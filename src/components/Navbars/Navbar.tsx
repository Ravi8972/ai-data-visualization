import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineBell, HiSearch } from 'react-icons/hi';
import { DiReact } from 'react-icons/di';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import ChangeThemes from '../themeChanges/ChangeThemes.tsx';
import toast, { Toaster } from 'react-hot-toast';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const element = document.getElementById('root');

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      element?.requestFullscreen?.({ navigationUI: 'auto' }).catch((err) => {
        console.error('Error attempting to enable fullscreen mode:', err);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error('Error attempting to exit fullscreen mode:', err);
      });
      setIsFullScreen(false);
    }
  };


  return (
    <div className="navbar-container">
      {/* Navbar left part */}
      <div className="navbar-left">
        <DiReact className="logo-icon" />
        <span className="logo-text">React Dashboard</span>
      </div>

      {/* Navbar Right part */}
      <div className="navbar-right">
        <button
          onClick={() =>
            toast('Search is not available!', {
              icon: '🔍',
            })
          }
          className="navbar-search btn btn-circle btn-ghost"
        >
          <HiSearch className="icon" />
        </button>

        <button onClick={toggleFullScreen} className="navbar-search btn btn-circle btn-ghost">
          {isFullScreen ? (
            <RxExitFullScreen className="icon" />
          ) : (
            <RxEnterFullScreen className="icon" />
          )}
        </button>

        <button
          onClick={() =>
            toast('No notifications!', {
              icon: '🔔',
            })
          }
          className="navbar-button btn-circle btn-ghost"
        >
          <HiOutlineBell className="icon" />
        </button>

        <div className="navbar-button btn-circle btn-ghost">
          <ChangeThemes />
        </div>

        <div className="dropdown">
          <div tabIndex={0} role="button" className="dropdown-avatar">
            <div className="avatar-image">
              <img
                src="https://cdn3.iconfinder.com/data/icons/avatars-flat/33/man_5-512.png"
                alt="User Avatar"
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Navbar;
