import { render,screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import OAuth from '../../src/pages/auth/OAuth'
import React from "react";
import '@testing-library/jest-dom/vitest';
describe("oauth", () => {
    it("it should render service name and logo", () => {
        render(<OAuth service={'google'} icon={<i className="bi bi-google" ></i>} className={'border'} />)
        screen.debug()
        const heading = screen.getByRole('button');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/google/i)
  });
});
