export const getGridClasses = (viewMode: string) => {
    switch (viewMode) {
        case "grid4":
            return "grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4"
        case "columns":
            return "grid grid-cols-2 gap-4"
        case "list":
            return "space-y-4"
        default:
            return "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
}