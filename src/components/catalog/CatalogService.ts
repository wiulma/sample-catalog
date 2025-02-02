export const CatalogService = Object.freeze({
    get(): Promise<Catalog> {

        const categs = ['news', 'movies', 'sport', 'fashion', 'documentary', 'cartoon', 'drama', 'shows', 'real-time', 'drama2', 'shows2', 'real-time2']
        const data = categs.map(category => {
            return ({
                category,
                items: new Array(10).fill(0).map((_,idx) => ({id: idx+1, title: `${category} ${idx+1}`, schedule: '16:00-17:00'}))
            })
        })
        return Promise.resolve(data as Catalog)
    }
})