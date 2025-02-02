import React, { useEffect, useRef, useState } from 'react'

import './Header.css'

export const Header: React.FC<Record<string, never>> = () => {
  const [currentTime, setCurrenTime] = useState<Date>(new Date())
  const intervalRef = useRef<number>()

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrenTime(new Date())
    }, 60 * 1000)
    return () => clearInterval(intervalRef.current)
  }, [])
  return (
    <section className="header-container">
      <span className="logo">LOGO</span>
      <span className="time">
        {currentTime.toLocaleTimeString(undefined, { timeStyle: 'short' })} |{' '}
        {currentTime.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
      </span>
    </section>
  )
}
