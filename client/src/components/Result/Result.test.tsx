import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import Result from "./Result";
import "@testing-library/jest-dom";

describe("Result Component", () => {
  const mockShortenedUrl = {
    shortCode: "abc123",
    originalUrl: "https://example.com/very/long/url",
  };

  const mockSetShortenedUrl = vi.fn();

  const originalWindowLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn(),
      },
      writable: true,
    });
    //@ts-ignore
    delete window.location;
    window.location = {
      ...originalWindowLocation,
      origin: "https://short.url",
    } as any;

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
    window.location = originalWindowLocation;
  });

  it("renders the shortened URL correctly", () => {
    render(
      <Result
        shortenedUrl={mockShortenedUrl}
        setShortenedUrl={mockSetShortenedUrl}
      />
    );

    expect(screen.getByText("https://short.url/abc123")).toBeInTheDocument();
  });

  it("renders the original URL correctly", () => {
    render(
      <Result
        shortenedUrl={mockShortenedUrl}
        setShortenedUrl={mockSetShortenedUrl}
      />
    );

    const originalUrlLink = screen.getByText(mockShortenedUrl.originalUrl);
    expect(originalUrlLink).toBeInTheDocument();
    expect(originalUrlLink.tagName).toBe("A");
    expect(originalUrlLink).toHaveAttribute(
      "href",
      mockShortenedUrl.originalUrl
    );
    expect(originalUrlLink).toHaveAttribute("target", "_blank");
    expect(originalUrlLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("copies the URL to clipboard when copy button is clicked", () => {
    render(
      <Result
        shortenedUrl={mockShortenedUrl}
        setShortenedUrl={mockSetShortenedUrl}
      />
    );

    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://short.url/abc123"
    );
  });

  it("displays 'Copied!' text after copying and reverts back after timeout", () => {
    render(
      <Result
        shortenedUrl={mockShortenedUrl}
        setShortenedUrl={mockSetShortenedUrl}
      />
    );

    const copyButton = screen.getByText("Copy");
    expect(copyButton).toBeInTheDocument();

    fireEvent.click(copyButton);

    expect(screen.getByText("Copied!")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("applies the copied style to the URL container when copied", () => {
    render(
      <Result
        shortenedUrl={mockShortenedUrl}
        setShortenedUrl={mockSetShortenedUrl}
      />
    );

    const urlContainer = screen
      .getByText("https://short.url/abc123")
      .closest(".shortened-url-display");
    expect(urlContainer).toHaveStyle({ borderLeft: "" });

    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);

    expect(urlContainer).toHaveStyle({ borderLeft: "4px solid #34495e" });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(urlContainer).toHaveStyle({ borderLeft: "" });
  });

  it("calls setShortenedUrl with null when the X is clicked", () => {
    render(
      <Result
        shortenedUrl={mockShortenedUrl}
        setShortenedUrl={mockSetShortenedUrl}
      />
    );

    const closeButton = screen.getByText("X");
    fireEvent.click(closeButton);

    expect(mockSetShortenedUrl).toHaveBeenCalledWith(null);
  });
});
