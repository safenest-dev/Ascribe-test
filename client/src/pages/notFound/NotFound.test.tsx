import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "./NotFound";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("NotFound Component", () => {
  it("renders the 404 message", () => {
    // Setup the navigate mock
    const mockNavigate = vi.fn();
     //@ts-ignore
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);

    render(<NotFound />);
    
    // Check if the component renders the 404 message
    expect(screen.getByText("404 - Not Found")).toBeInTheDocument();
  });

  it("renders a home page button", () => {
    // Setup the navigate mock
    const mockNavigate = vi.fn();
    //@ts-ignore
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);

    render(<NotFound />);
    
    // Check if the button is rendered
    const homeButton = screen.getByText("Home page");
    expect(homeButton).toBeInTheDocument();
    expect(homeButton.tagName).toBe("BUTTON");
  });

  it("navigates to home page when button is clicked", () => {
    // Setup the navigate mock
    const mockNavigate = vi.fn();
     //@ts-ignore
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);

    render(<NotFound />);
    
    // Find and click the home button
    const homeButton = screen.getByText("Home page");
    fireEvent.click(homeButton);
    
    // Verify navigate was called with "/"
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
 
});