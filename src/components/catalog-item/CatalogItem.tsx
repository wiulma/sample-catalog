import React from 'react'
import './CategoryItem.css'

type Props = {
  data: CatalogItem
  isFocused: boolean
  scrollPosition: number
}

export const CatalogItem: React.FC<Props> = React.memo(({ data, isFocused, scrollPosition }) => {
  return (
    <div
      className={`show-item ${isFocused ? 'focused' : ''}`}
      style={{
        transform: `translateX(${scrollPosition}px) ${isFocused ? ' scale(1.15)' : ''}`,
        backgroundImage: "url('/eurofilm.png')",
      }}
    >
      <span>{data.schedule}</span>
      <span>{data.title}</span>
    </div>
  )
})
