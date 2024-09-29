"use client"
import React, {useState} from 'react'
import Image from 'next/image'

const Notification = () => {
    const [ notificationVisible, setNotificationVisible ] = useState( true );
    const handleNotificationClose = () => {
        setNotificationVisible( false );
    }
    if ( !notificationVisible ) {
        return null;
    }
  return (
      <div className='bg-gradient-to-r from-indigo-500 via-purple-800 to-pink-500 flex justify-center'>
          <div className='text-center text-white font-bold text-sm'>New! LitServe with gRPC support is now available.</div>
          <div className='cursor-pointer ml-7' onClick={handleNotificationClose}>
              <Image src="/images/cross-button.png" width={20} height={20} alt="cross-button"/>
          </div>
    </div>
  )
}

export default Notification