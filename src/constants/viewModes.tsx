export const viewModes = [
    {
        mode: "grid4",
        icon: (
            // 3×3 dot grid
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                <rect x="1" y="1" width="4" height="4" rx="0.5" />
                <rect x="6" y="1" width="4" height="4" rx="0.5" />
                <rect x="11" y="1" width="4" height="4" rx="0.5" />
                <rect x="1" y="6" width="4" height="4" rx="0.5" />
                <rect x="6" y="6" width="4" height="4" rx="0.5" />
                <rect x="11" y="6" width="4" height="4" rx="0.5" />
                <rect x="1" y="11" width="4" height="4" rx="0.5" />
                <rect x="6" y="11" width="4" height="4" rx="0.5" />
                <rect x="11" y="11" width="4" height="4" rx="0.5" />
            </svg>
        ),
    },
    {
        mode: "columns",
        icon: (
            // 2 tall columns
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                <rect x="1" y="1" width="6" height="14" rx="0.5" />
                <rect x="9" y="1" width="6" height="14" rx="0.5" />
            </svg>
        ),
    },
    {
        mode: "list",
        icon: (
            // horizontal lines (list)
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                <rect x="1" y="2" width="14" height="3" rx="0.5" />
                <rect x="1" y="7" width="14" height="3" rx="0.5" />
                <rect x="1" y="12" width="14" height="3" rx="0.5" />
            </svg>
        ),
    },
]