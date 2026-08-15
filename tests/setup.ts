import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

Object.defineProperty(globalThis.URL, "createObjectURL", {
    writable: true,
    value: () => "blob:mock-preview",
});

Object.defineProperty(globalThis.URL, "revokeObjectURL", {
    writable: true,
    value: () => undefined,
});

Object.defineProperty(globalThis, "requestAnimationFrame", {
    writable: true,
    value: (callback: FrameRequestCallback) =>
        globalThis.setTimeout(() => callback(Date.now()), 0),
});

Object.defineProperty(globalThis, "cancelAnimationFrame", {
    writable: true,
    value: (handle: number) => globalThis.clearTimeout(handle),
});
