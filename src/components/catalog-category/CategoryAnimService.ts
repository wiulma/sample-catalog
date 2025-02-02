import { KeyboardKeys } from "../../service/KeyboardService"
import { remToPx } from "../../service/LayoutService"

const viewportWidth = document.documentElement.clientWidth

const ItemGapPx =
  remToPx(window.getComputedStyle(document.body).getPropertyValue('--items-gap')) + 10

function calcScroll(evtKey: string, currentScrollGap: number, elmRect: DOMRect) {
  try {
    let newPos = currentScrollGap
    if (evtKey === KeyboardKeys.ARROW_RIGHT) {
      if (elmRect.left + elmRect.width + ItemGapPx > viewportWidth) {
        const gap = elmRect.width + ItemGapPx
        newPos = currentScrollGap - gap
      }
    } else if (evtKey === KeyboardKeys.ARROW_LEFT) {
      if (elmRect.left < 0) {
        const gap = elmRect.left - ItemGapPx
        newPos = currentScrollGap - gap
      }
    }
    return newPos
  } catch (exc) {
    return currentScrollGap
  }
}

export function manageCategoryItemsScroll(evtKey: string, items: CatalogItem[], isSelected: boolean, selectedIndex: number, containerRefCurrent: HTMLDivElement, currentScroll: number): number | undefined {
      if (
        !isSelected ||
        (evtKey !== KeyboardKeys.ARROW_LEFT && evtKey !== KeyboardKeys.ARROW_RIGHT)
      ) {
        return
      }
      const children = containerRefCurrent?.children
      if (!children) return
      let nextElmIdx = selectedIndex
      if (evtKey === KeyboardKeys.ARROW_LEFT) {
        nextElmIdx = selectedIndex > 0 ? selectedIndex - 1 : 0
      } else if (evtKey === KeyboardKeys.ARROW_RIGHT) {
        nextElmIdx = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0
        if (nextElmIdx === items.length) {
          return 0
        }
      }
      if (nextElmIdx === selectedIndex) return

      if (nextElmIdx === 0) {
        return 0
      } else {
        return calcScroll(
          evtKey,
          currentScroll,
          children[nextElmIdx].getBoundingClientRect()
        )
      }
    }