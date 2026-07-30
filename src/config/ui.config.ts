export const uiConfig = {
    brand: {
        name: "MUCYORA",
        primaryColor: "#1B4EF5",
        fontFamily: "Outfit",
    },
    controls: {
        textSizePx: 12,
        minimumHeightPx: 44,
        iconSizePx: 16,
    },
    toast: {
        position: "top-center" as const,
        durationMs: 4000,
        visibleToasts: 3,
    },
    motion: {
        fastMs: 120,
        standardMs: 180,
        slowMs: 220,
    },
} as const;