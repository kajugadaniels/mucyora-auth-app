"use client";

import { useCallback, useEffect, useState } from "react";

export function useCountdown(initialSeconds: number) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setSeconds((current) => Math.max(0, current - 1));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [seconds]);

    const restart = useCallback((nextSeconds = initialSeconds) => {
        setSeconds(nextSeconds);
    }, [initialSeconds]);

    return {
        seconds,
        isComplete: seconds === 0,
        restart,
    };
}