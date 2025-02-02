type CatalogItem = {
    id: number
    title: string
    schedule: string
}

type CatalogCategory = {category: string, items: CatalogItem[]}

type Catalog = Array<CatalogCategory>

type SetCatalog = { type: 'SET_LIST'; payload: Catalog }

type CatalogAction = SetCatalog

type CatalogState = {
    catalog: Catalog
}