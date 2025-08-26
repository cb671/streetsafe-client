import { describe, it, expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {useEffect} from "react";
import Home from "../app/routes/home.jsx";
import {createRoutesStub} from "react-router";
import Login from "../app/routes/login.jsx";
import Register from "../app/routes/register.jsx";

const RegistrationStub = createRoutesStub([
    { path: "/register", Component: Register },
])

describe("Register component works", () => {
    it("renders the registration form", () => {   
        
        const page = render(<RegistrationStub initialEntries={["/register"]} />);
        expect(page.getByRole("heading", { name: /register/i })).toBeInTheDocument();
        expect(page.getByRole("form")).toBeInTheDocument();

    });

    
    it("submits the form when the submit button is clicked", () => {
        
        render(<RegistrationStub initialEntries={["/register"]} />);

        const form = page.getByRole("form");
        const submit = vi.fn((e) => e.preventDefault());
        form.addEventListener("submit", submit);

        const button = page.getByRole("button", { name: /register/i });

    });

})