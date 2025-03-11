import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./Home";
import "@testing-library/jest-dom";

vi.mock("../../components/Form/Form", () => ({
  default: vi.fn(
    ({ setShortenedUrl, setIsLoading, setError, shortenedUrl }) => (
      <div data-testid="form-component">
        <button
          data-testid="mock-submit-button"
          onClick={() => {
            setIsLoading(true);
            // Use setTimeout to simulate async operation
            setTimeout(() => {
              setIsLoading(false);
              setShortenedUrl({
                shortCode: "abc123",
                originalUrl: "https://example.com",
              });
            }, 100);
          }}
        >
          Shorten URL
        </button>
        <button
          data-testid="mock-error-button"
          onClick={() => setError("An error occurred")}
        >
          Trigger Error
        </button>
      </div>
    )
  ),
}));

vi.mock("../../components/Result/Result", () => ({
  default: vi.fn(({ shortenedUrl, setShortenedUrl }) => (
    <div data-testid="result-component">
      <span data-testid="short-code">{shortenedUrl.shortCode}</span>
      <button data-testid="reset-button" onClick={() => setShortenedUrl(null)}>
        Reset
      </button>
    </div>
  )),
}));

describe("Home Component", () => {
  it("renders the title and subtitle", () => {
    render(<Home />);

    expect(screen.getByText("URL Shortener")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a long URL to make it shorter")
    ).toBeInTheDocument();
  });

  it("renders the Form component", () => {
    render(<Home />);

    expect(screen.getByTestId("form-component")).toBeInTheDocument();
  });

  it("doesn't render Result component initially", () => {
    render(<Home />);

    expect(screen.queryByTestId("result-component")).not.toBeInTheDocument();
  });

  it("shows loading state when processing", () => {
    render(<Home />);

    expect(screen.queryByText("Shortening URL...")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mock-submit-button"));

    expect(screen.getByText("Shortening URL...")).toBeInTheDocument();
  });

  it("shows error message when an error occurs", () => {
    render(<Home />);

    expect(screen.queryByText("An error occurred")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mock-error-button"));

    expect(screen.getByText("An error occurred")).toBeInTheDocument();
  });

  it("renders Result component after successful shortening", async () => {
    vi.useFakeTimers();
    render(<Home />);

    expect(screen.queryByTestId("result-component")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mock-submit-button"));

    vi.runAllTimers();

    await vi.waitFor(() => {
      expect(screen.getByTestId("result-component")).toBeInTheDocument();
      expect(screen.getByTestId("short-code")).toHaveTextContent("abc123");
    });

    vi.useRealTimers();
  });

  it("updates container height when shortenedUrl is available", async () => {
    vi.useFakeTimers();
    const { container } = render(<Home />);

    const homeContainer = container.querySelector(".container");

    expect(homeContainer).not.toHaveStyle("height: 600px");

    fireEvent.click(screen.getByTestId("mock-submit-button"));

    vi.runAllTimers();

    await vi.waitFor(() => {
      expect(homeContainer).toHaveStyle("height: 600px");
    });

    vi.useRealTimers();
  });

  it("resets state when Result component triggers reset", async () => {
    vi.useFakeTimers();
    render(<Home />);

    fireEvent.click(screen.getByTestId("mock-submit-button"));
    vi.runAllTimers();

    await vi.waitFor(() => {
      expect(screen.getByTestId("result-component")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("reset-button"));

    expect(screen.queryByTestId("result-component")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
