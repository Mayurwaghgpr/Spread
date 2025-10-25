import { render, screen } from "@testing-library/react";
import { it, expect, describe, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import OAuth from "../../src/pages/auth/OAuth";
import React from "react";
import { GrGoogle } from "react-icons/gr";

// 🧠 Mock the custom useIcons hook
vi.mock("../../src/hooks/useIcons", () => ({
  __esModule: true,
  default: () => ({
    google: <GrGoogle data-testid="google-icon" />,
  }),
}));

describe("OAuth Component", () => {
  it("renders the service name and logo", () => {
    render(<OAuth service="google" className="border" />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/google/i);

    const icon = screen.getByTestId("google-icon");
    expect(icon).toBeInTheDocument();
  });

  it("redirects to correct OAuth URL on click", () => {
    // Mock window.location.href
    delete window.location;
    window.location = { href: "" };

    render(<OAuth service="google" className="border" />);

    const button = screen.getByRole("button");
    button.click();

    expect(window.location.href).toContain("/api/auth/login/google");
  });
});
