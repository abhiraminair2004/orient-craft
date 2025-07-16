import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = ({ setToken }) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      path: '/add',
      name: 'Add Product',
      icon: assets.add_icon
    },
    {
      path: '/list',
      name: 'Product List',
      icon: assets.parcel_icon
    },
    {
      path: '/orders',
      name: 'Orders',
      icon: assets.order_icon
    }
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 bg-pink-500 bg-opacity-70 text-pink-700 rounded-md shadow-lg focus:outline-none backdrop-blur-sm"
          aria-label="Open sidebar menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-[#FFFBDE] text-gray-800 transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full w-64 mt-12 lg:mt-0">
          {/* Logo */}
          <div className="p-4 border-b border-gray-300">
            <img src={assets.logo} alt="Logo" className="w-32 h-auto" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-pink-100 text-pink-800 border border-pink-400'
                          : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <img src={item.icon} alt="" className="w-6 h-6 mr-3" />
                    <span className="lg:block">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-300">
            <button onClick={() => setToken('')} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="lg:block">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
