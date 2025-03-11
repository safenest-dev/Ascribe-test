import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import RedirectHandler from "./RedirectHandler";
import "@testing-library/jest-dom";
import { useParams } from "react-router-dom";

// Mock `useParams` from `react-router-dom`
vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

describe("RedirectHandler Component", () => {
  beforeEach(() => {
    // Setup fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Cleanup fake timers
    vi.useRealTimers();
  });

  it("redirects to the correct URL after timeout", async () => {
    const code = "abc123";
            // @ts-ignore
    (useParams as vi.Mock).mockReturnValue({ code });

    // Provide the API URL directly in the test
    vi.stubGlobal("import", {
      meta: {
        env: {
          VITE_API_URL: "http://localhost:5000",
        },
      },
    });

    // Mock the global window.location.href to prevent actual redirect during test
    const mockLocation = { href: "" };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    render(<RedirectHandler />);

    // Fast-forward timers
    vi.runAllTimers();

    // Check for the redirect
    expect(mockLocation.href).toBe(`http://localhost:5000/${code}`);
  });

  it("clears the timeout on component unmount", () => {
    const code = "abc123";
            // @ts-ignore
    (useParams as vi.Mock).mockReturnValue({ code });

    const { unmount } = render(<RedirectHandler />);

    // Mock global setTimeout and clearTimeout to track calls
    const mockClearTimeout = vi.fn();
            // @ts-ignore
    global.clearTimeout = mockClearTimeout;

    unmount();

    // Ensure the timeout is cleared
    expect(mockClearTimeout).toHaveBeenCalled();
  });
});
