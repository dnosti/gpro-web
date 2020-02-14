import React, { Component } from 'react';

import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Link
} from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';
import { Cliente } from './components/Cliente';
import { NuevoCliente } from './components/NuevoCliente';
import { Usuario } from './components/Usuario';
import { NuevoUsuario } from './components/NuevoUsuario';

import Logo from '../src/assets/img/logo-gpro-nav-c.png';
import './custom.css';
import { authenticationService } from './components/authentication.service';
import ScrollUpButton from "react-scroll-up-button";

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            loggedIn: false
        }
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            loggedIn: true
        }));
    }

    logout() {
        authenticationService.logout();
    }


    render() {
        const { currentUser, loggedIn } = this.state;
        return (
            <div></div>
        );
    }
}