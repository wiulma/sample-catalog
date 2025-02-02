import React, { useEffect, useRef, useState } from 'react'
import { CatalogItem } from '../catalog-item/CatalogItem'
import './CatalogCategory.css'
import { manageCategoryItemsScroll } from './CategoryAnimService'

type Props = {
  data: CatalogCategory
  isSelected: boolean
  selectedIndex: number
  scrollPosition: number
}

export const CatalogCategory: React.FC<Props> = React.memo(
  ({ data: { category, items }, isSelected, selectedIndex, scrollPosition }) => {
    const itemsCcontainerRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLElement>(null)
    const currentScroll = useRef<number>(0)

    const [scrollItemsPosition, setScrollItemsPosition] = useState(0)

    function handleScroll(evt: KeyboardEvent) {
      if (!itemsCcontainerRef.current) return
      const newPos = manageCategoryItemsScroll(
        evt.key,
        items,
        isSelected,
        selectedIndex,
        itemsCcontainerRef.current,
        currentScroll.current
      )
      if (typeof newPos === 'number') {
        setScrollItemsPosition(newPos)
        currentScroll.current = newPos
      }
    }

    useEffect(() => {
      document.addEventListener('keydown', handleScroll)
      return () => {
        document.removeEventListener('keydown', handleScroll)
      }
    }, [isSelected, selectedIndex])

    return (
      <section
        className="category-container"
        style={{ transform: `translateY(${scrollPosition}px)` }}
        ref={containerRef}
      >
        <p>{category}</p>
        <div className="show-container" ref={itemsCcontainerRef}>
          {items.map((item, idx) => (
            <CatalogItem
              key={`${category}-${idx}`}
              data={item}
              isFocused={isSelected && selectedIndex === idx}
              scrollPosition={scrollItemsPosition}
            />
          ))}
        </div>
      </section>
    )
  }
)
