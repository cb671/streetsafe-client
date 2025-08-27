import { describe, it, expect, test, vi} from "vitest";
import {register} from '../app/api/api.js';
import {login} from '../app/api/api.js';
import {render} from "vitest-browser-react";
import {useEffect} from "react";
import { userEvent } from '@vitest/browser/context';
import Home from "../app/routes/home.jsx";
import {createRoutesStub} from "react-router";
import Login from "../app/routes/login.jsx";
import Register from "../app/routes/register.jsx";

const RegistrationStub = createRoutesStub([
    { path: "/register", Component: Register },
])

describe("Register component works", () => {

    it("renders the registration form", () => {

        const page = render(<RegistrationStub initialEntries={["/register"]}/>);

        const form = page.getByTestId("form");

        expect(form).toBeInTheDocument()

    });


    it("submits the form when the submit button is clicked", async () => {

        vi.mock('../app/api/api.js', {spy: true});

        const page = render(<RegistrationStub initialEntries={["/register"]} />);
        
        const form = page.getByTestId("form");

        await userEvent.fill(document.querySelector('input[name=username]'), 'bob@bob.com')
        await userEvent.fill(document.querySelector('input[name=email]'), '   bob@bob.com')
        await userEvent.fill(document.querySelector('input[name=password]'), 'bob@bob.com')
        await userEvent.fill(document.querySelector('input[name=postcode]'), 'N16 5JJ')

        await userEvent.click(document.querySelector('button[type=submit]'))

        expect(register).toHaveBeenCalled()
    });

})

const LoginStub = createRoutesStub([
    { path: "/login", Component: Login },
])


describe("Login component works", () => {

    it("renders the login form", () => {

        const page = render(<LoginStub initialEntries={["/login"]}/>);

        const form = page.getByTestId("form");

        expect(form).toBeInTheDocument()

    });


    it("submits the form when the submit button is clicked", async () => {

        vi.mock('../app/api/api.js', {spy: true});

        const page = render(<LoginStub initialEntries={["/login"]} />);
        
        const form = page.getByTestId("form");

        await userEvent.fill(document.querySelector('input[name=username]'), 'bob@bob.com')
        await userEvent.fill(document.querySelector('input[name=password]'), 'bob@bob.com')

        await userEvent.click(document.querySelector('button[type=submit]'))

        expect(login).toHaveBeenCalled()
    });

})
