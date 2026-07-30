"use client";

import { useCallback, useState } from "react";

export function useMockSubmission() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const run = useCallback(async <Result,>(
        operation: () => Promise<Result>,
    ): Promise<Result | undefined> => {
        if (isSubmitting) {
            return undefined;
        }

        setIsSubmitting(true);

        try {
            return await operation();
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting]);

    return {
        isSubmitting,
        run,
    };
}