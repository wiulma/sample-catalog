import React, { useEffect, useRef, useState } from 'react'
import { CatalogService } from './CatalogService'

import { Loader } from '../Loader'
import { CatalogCategory } from '../catalog-category/CatalogCategory'
import { KeyboardKeys } from '../../service/KeyboardService'

import './Catalog.css'
import { remToPx } from '../../service/LayoutService'

const viewportHeight = document.documentElement.clientHeight

const ItemGapPx =
  remToPx(window.getComputedStyle(document.body).getPropertyValue('--items-gap')) + 10

function manageCategoryItemsScroll(
  evtKey: string,
  container: HTMLElement,
  currentScroll: number,
  nextCateg: number
): number | undefined {
  if (nextCateg === 0) return 0
  const elm = container.children[nextCateg]
  const elmRect = elm.getBoundingClientRect()

  let gap = currentScroll

  if (
    evtKey === KeyboardKeys.ARROW_DOWN &&
    elmRect.top + elmRect.height + ItemGapPx > viewportHeight
  ) {
    gap = currentScroll - (elmRect.height + ItemGapPx)
  } else if (evtKey === KeyboardKeys.ARROW_UP && elmRect.top - ItemGapPx < 0) {
    gap = currentScroll + (elmRect.height + ItemGapPx)
  }
  return gap
}

export const Catalog: React.FC<Record<string, never>> = () => {
  const [data, setData] = useState<Catalog>()
  const [error, setError] = useState()
  const [selectedCategory, setSelectedCategory] = useState(0)

  const [selectedItemsMap, setSelectedItemsMap] = useState<Array<number>>([]) // this contains the seleted item for each category. the array index is the category index
  const categoriesItemsLengthRef = useRef<Array<number>>([]) // this is a ref in order to save each category items length

  const containerRef = useRef<HTMLElement>(null)
  const currentScroll = useRef(0)
  const [scrollPosition, setScrollPosition] = useState<number>(0)

  function handleCategoryScroll(
    evtKey: string,
    containerRefCurrent: HTMLElement,
    currentScrollCurrent: number,
    nextCateg: number
  ) {
    const newPos = manageCategoryItemsScroll(
      evtKey,
      containerRefCurrent,
      currentScrollCurrent,
      nextCateg
    )
    if (typeof newPos === 'number') {
      currentScroll.current = newPos
      setScrollPosition(newPos)
    }
  }

  function handleKeyDown(evt: KeyboardEvent) {
    if (!data?.length) return
    if (!containerRef.current) return
    if (evt.key === KeyboardKeys.ARROW_DOWN && selectedCategory < (data?.length ?? 0) - 1) {
      const nextCateg = selectedCategory + 1
      setSelectedCategory(nextCateg)
      handleCategoryScroll(evt.key, containerRef.current, currentScroll.current, nextCateg)
    } else if (evt.key === KeyboardKeys.ARROW_UP && selectedCategory > 0) {
      const nextCateg = selectedCategory - 1
      setSelectedCategory(nextCateg)
      handleCategoryScroll(evt.key, containerRef.current, currentScroll.current, nextCateg)
    } else if (evt.key === KeyboardKeys.ARROW_LEFT) {
      const selectedIndex = selectedItemsMap[selectedCategory]
      if (selectedIndex > 0) {
        const m = structuredClone(selectedItemsMap)
        m[selectedCategory] = m[selectedCategory] - 1
        setSelectedItemsMap(m)
      }
    } else if (evt.key === KeyboardKeys.ARROW_RIGHT) {
      const selectedIndex = selectedItemsMap[selectedCategory]
      const nextSel =
        selectedIndex < categoriesItemsLengthRef.current[selectedCategory] - 1
          ? selectedIndex + 1
          : 0
      const m = structuredClone(selectedItemsMap)
      m[selectedCategory] = nextSel
      setSelectedItemsMap(m)
    }
  }

  useEffect(() => {
    if (!data || !data?.length) return
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [data, selectedCategory, selectedItemsMap])

  useEffect(() => {
    CatalogService.get()
      .then((data: Catalog) => {
        setSelectedItemsMap(new Array(data.length).fill(0))
        const d = []
        for (let i = 0, l = data.length; i < l; i++) {
          d.push(data[i].items?.length ?? 0)
        }
        categoriesItemsLengthRef.current = d
        setData(data)
      })
      .catch((exc) => {
        setData([])
        setError(exc.message)
      })
  }, [])

  return (
    <>
      {!data && !error && <Loader />}
      {!data && error && <p>{error}</p>}
      {data && !error && (
        <section className="catalog-container" ref={containerRef}>
          {data.map((c, idx) => (
            <CatalogCategory
              key={c.category}
              data={c}
              isSelected={selectedCategory === idx}
              selectedIndex={selectedItemsMap[idx]}
              scrollPosition={scrollPosition}
            />
          ))}
        </section>
      )}
    </>
  )
}
