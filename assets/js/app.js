import React from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import {HashRouter, Switch, Route} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";

console.log('Hello Webpack !!!');

const App = () => {
    return (
        <HashRouter>
            <NavBar/>
            <main className="container pt-5">
                <Switch>
                    <Route path="/customers" component={CustomersPage}/>
                    <Route path="/invoices" component={InvoicesPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.getElementById('app');
ReactDOM.render(<App/>, rootElement);