import React, { useState } from 'react'

const Login = () => {
  const [currentState, setCurrentState]= useState('Sign Up');
  const onSubmitHandler=async(event)=>{
    event.preventDefault()
  }
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState==='Login'?'':<input type="text" className='w-full px-3 py-2 border border-gray-800 bg-[#FEFDED]' placeholder='Name' required/>}
      <input type="email" className='w-full px-3 py-2 border border-gray-800 bg-[#FEFDED]' placeholder='Email' required/>
      <input type="password" className='w-full px-3 py-2 border border-gray-800 bg-[#FEFDED]' placeholder='Password' required/>
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className='text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer'>Forgot your password?</p>
        {
          currentState=='Login'
          ?<p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
          :<p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>
      <button className='bg-black text-white fonr-loght px-8 py-2 mt-4'>{currentState=='Login'?'Sign In':'Sign Up'}</button>
    </form>
  )
}

export default Login