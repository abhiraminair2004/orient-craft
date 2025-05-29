import React from 'react'
import {assets} from '../assets/assets.js'
const Navbar = () => {
  return (
    <div className='flex item-center justify-between py-5 font-medium'>
        <img src={assets.logo} alt="" className='w-36' />
    </div>
  )
}

export default Navbar