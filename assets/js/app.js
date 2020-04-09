import React, {useContext, useState} from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import {HashRouter, Switch, Route, withRouter, Redirect} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/authAPI";
import AuthContext from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CustomerPage from "./pages/CustomerPage";

AuthAPI.setup();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    const NavbarWithRouter = withRouter(NavBar);

    return (
        <AuthContext.Provider value={
            {
                isAuthenticated,
                setIsAuthenticated
            }
        }>
            <HashRouter>
                <NavbarWithRouter/>
                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <PrivateRoute path="/customers/:id" component={CustomerPage}/>
                        <PrivateRoute path="/customers" component={CustomersPage}/>
                        <PrivateRoute path="/invoices" component={InvoicesPage}/>
                        <Route path="/" component={HomePage}/>
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.getElementById('app');
ReactDOM.render(<App/>, rootElement);