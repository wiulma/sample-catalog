import { useEffect, useState } from "react";

export function useIsVisible(elm: HTMLElement | null ) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        console.log('elm', elm)
        if(!elm) return
        const observer = new IntersectionObserver(([entry]) => {
            console.log('set is visible', entry.isIntersecting )
            setIsVisible(entry.isIntersecting)
        }, {
            root: document.documentElement,
            threshold: 0
        })
        observer.observe(elm)

        return () => observer.disconnect()
    }, [elm])

    return isVisible
}