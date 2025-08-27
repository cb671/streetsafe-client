import { describe, it, expect, test, vi } from "vitest";
import { register } from '../app/api/api.js';
import { login } from '../app/api/api.js';
import { render } from "vitest-browser-react";
import { userEvent } from '@vitest/browser/context';
import { createRoutesStub } from "react-router";
import Login from "../app/routes/login.jsx";
import Register from "../app/routes/register.jsx";
import AuthLayout from "../app/routes/auth.jsx";
import {Outlet} from "../app/routes/auth.jsx";



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

function DummyChild() {
    return <div data-testid="dummy">Some child content here</div>;
}

const AuthLayoutStub = createRoutesStub([
    { 
        path: "/auth", 
        Component: AuthLayout,
        children: [
            { path: "/child", Component: DummyChild },
        ]
    },
])

describe("Auth Layout parent component to login and registration works", () => {

    test("renders the Outlet component to child routes", async () => {

        const outletComponent = render(
        <>
            <AuthLayoutStub>
                <Outlet/>
            </AuthLayoutStub>
        </>);
        await expect.element(outletComponent).toBeInTheDocument()

    });


})