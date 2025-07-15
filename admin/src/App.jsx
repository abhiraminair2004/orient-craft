import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className="bg-pink-50 min-h-screen">
      <ToastContainer />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex h-screen bg-pink-50">
          <Sidebar setToken={setToken} />
          <main className="flex-1 overflow-auto lg:ml-0">
            <div className="p-6">
              <Routes>
                <Route path="/add" element={<Add token={token} setToken={setToken} />} />
                <Route path="/list" element={<List token={token} setToken={setToken} />} />
                <Route path="/orders" element={<Orders token={token} setToken={setToken} />} />
                <Route path="/" element={<Add token={token} setToken={setToken} />} />
              </Routes>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;