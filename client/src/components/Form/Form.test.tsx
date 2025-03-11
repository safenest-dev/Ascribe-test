import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import '@testing-library/jest-dom';
import Form from "./Form";
import { shortenUrl } from "../../services/api";

vi.mock("../../services/api", () => ({
  shortenUrl: vi.fn(),
}));
 
describe("Form Component", () => {
  const setShortenedUrl = vi.fn();
  const setIsLoading = vi.fn();
  const setError = vi.fn();
  const defaultProps = {
    setShortenedUrl,
    setIsLoading,
    setError,
    shortenedUrl: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with input and button", () => {
    render(<Form {...defaultProps} />);
    expect(
      screen.getByPlaceholderText("Paste your long URL here")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /shorten/i })
    ).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<Form {...defaultProps} />);
    const input = screen.getByPlaceholderText("Paste your long URL here");
    fireEvent.change(input, { target: { value: "example.com" } });
    expect(input).toHaveValue("example.com");
  });

  it("shows error when submitting an empty URL", async () => {
    render(<Form {...defaultProps} />);
    const form = screen.getByRole("form", { name: "URL Shortener Form" }); // Use aria-label
    fireEvent.submit(form);

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith("Please enter a URL");
      expect(setShortenedUrl).not.toHaveBeenCalled();
      expect(setIsLoading).not.toHaveBeenCalled(); // Reflects actual behavior
    });
  });

  it("successfully shortens a valid URL", async () => {
    (shortenUrl as any).mockResolvedValue({
      shortCode: "abc123",
      originalUrl: "https://example.com",
    });

    render(<Form {...defaultProps} />);
    const input = screen.getByPlaceholderText("Paste your long URL here");
    const form = screen.getByRole("form", { name: "URL Shortener Form" });

    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(shortenUrl).toHaveBeenCalledWith("https://example.com");
      expect(setShortenedUrl).toHaveBeenCalledWith({
        shortCode: "abc123",
        originalUrl: "https://example.com",
      });
      expect(setError).toHaveBeenCalledWith("");
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });
  });

  it("handles API error", async () => {
    (shortenUrl as any).mockRejectedValue(new Error("API Error"));

    render(<Form {...defaultProps} />);
    const input = screen.getByPlaceholderText("Paste your long URL here");
    const form = screen.getByRole("form", { name: "URL Shortener Form" });

    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(form); 

    await waitFor(() => {
      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(shortenUrl).toHaveBeenCalledWith("https://example.com");
      expect(setError).toHaveBeenCalledWith("API Error");
      expect(setShortenedUrl).toHaveBeenCalledWith(null);
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });
  });

  it("resets input when shortenedUrl changes to null", () => {
    const { rerender } = render(
      <Form
        {...defaultProps}
        shortenedUrl={{
          shortCode: "abc123",
          originalUrl: "https://example.com",
        }}
      />
    );
    const input = screen.getByPlaceholderText("Paste your long URL here");
    expect(input).toHaveValue("");

    rerender(<Form {...defaultProps} shortenedUrl={null} />);
    expect(input).toHaveValue("");
  });
});
