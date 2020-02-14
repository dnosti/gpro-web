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
            <Router history={window.history}>
                <div>
                    <ScrollUpButton style={{ backgroundColor: "rgba(32, 35, 42, 0.80)", borderRadius: "5px" }} />
                    {currentUser &&
                        <div>

                            {/* Bootstrap NavBar */}
                            <nav className="navbar fixed-top navbar-expand-md navbar-dark home-navbar-bg" id="barranav">

                                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>

                                <a className="navbar-brand" href="#top">
                                    <img src={Logo} width="27px" className="d-inline-block align-top" alt="" style={{ marginTop: "2px", marginLeft: "2px" }}></img>
                                    <span className="menu-collapsed ml-2">GPRO</span>
                                    {/*<span className="menu-collapsed ml-2 font-s-logo">V. 0.1</span>*/}
                                </a>

                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-link">
                                            <span className="badge badge-secondary badge-dark text-info"><span className="fa fa-user fa-fw mr-2 pl-2"></span><span className="pr-2 pl-1">{currentUser.username}</span></span>
                                        </li>
                                        <li className="nav-link mr-3">
                                            <span className="badge badge-secondary badge-dark text-info"><span className="fa fa-user-tag fa-fw mr-2 pl-2"></span><span className="pr-2 pl-2">{currentUser.rol}</span></span>
                                        </li>
                                        <li className="nav-item active mr-4">
                                            <a className="nav-link" href="#top">Inicio</a>
                                        </li>
                                        <li className="nav-item">
                                            <button type="button" className="btn btn-primary nav-item" onClick={this.logout} style={{ marginRight: "2px" }}>Cerrar sesi&oacute;n</button>
                                        </li>

                                        {/* Menú para dispositivos pequeños */}
                                        <li className="nav-item dropdown d-sm-block d-md-none">
                                            <a className="nav-link dropdown-toggle" href="#top" id="smallerscreenmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Menú</a>
                                            <div className="dropdown-menu" aria-labelledby="smallerscreenmenu">
                                                <a className="dropdown-item" href="#top">Opción 1</a>
                                                <a className="dropdown-item" href="#top">Opción 2</a>
                                                <a className="dropdown-item" href="#top">Opción 3</a>
                                                <a className="dropdown-item" href="#top">Opción 4</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </nav>


                        {/* Bootstrap row */}
                        <div className="container-fluid">
                            <div className="row">

                                {/*  Sidebar */}
                                <div className="col-2 d-none d-md-block" id="sidebar-container">
                                        <Link to="/nuevousuario" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span className="menu-collapsed">Nuevo</span>
                                        </Link>
                                    </div>
                                    {/* Bootstrap List Group */}
                                    <ul className="list-group">

                                        {/* <!-- Separator with title --> */}
                                        <li className="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                                            <small>MENU</small>
                                        </li>
                                        {/* <!-- /END Separator --> */}

                                        {/* <!-- Menu with submenu --> */}
                                        <a href="#submenu1" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="d-flex w-100 justify-content-start align-items-center">
                                                <span className="fa fa-users fa-fw mr-3"></span>
                                                <span className="menu-collapsed">Clientes</span>
                                                <span className="submenu-icon ml-auto"></span>
                                            </div>
                                        </a>
                                        {/* <!-- Submenu content --> */}
                                        <div id='submenu1' className="collapse sidebar-submenu">
                                            <Link to="/clientes" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Buscar</span>
                                            </Link>
                                            {(currentUser.rol === 'Admin' || currentUser.rol === 'PM') ? (
                                                <Link to="/nuevocliente" className="list-group-item list-group-item-action bg-dark text-white">
                                                    <span className="menu-collapsed">Nuevo</span>
                                                </Link>) : false
                                            }
                                        </div>

                                        {/* <!-- Menu with submenu --> */}
                                        <a href="#submenu2" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="d-flex w-100 justify-content-start align-items-center">
                                                <span className="fa fa-project-diagram fa-fw mr-3"></span>
                                                <span className="menu-collapsed">Proyectos</span>
                                                <span className="submenu-icon ml-auto"></span>
                                            </div>
                                        </a>
                                        {/* <!-- Submenu content --> */}
                                        <div id='submenu2' className="collapse sidebar-submenu">
                                            <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Lorem Ipsum</span>
                                            </a>
                                            <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Lorem Ipsum</span>
                                            </a>
                                        </div>

                                        {/* <!-- Menu with submenu --> */}
                                        <a href="#submenu3" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="d-flex w-100 justify-content-start align-items-center">
                                                <span className="fa fa-tasks fa-fw mr-3"></span>
                                                <span className="menu-collapsed">Tareas</span>
                                                <span className="submenu-icon ml-auto"></span>
                                            </div>
                                        </a>
                                        {/* <!-- Submenu content --> */}
                                        <div id='submenu3' className="collapse sidebar-submenu">
                                            <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Lorem Ipsum</span>
                                            </a>
                                            <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Lorem Ipsum</span>
                                            </a>
                                        </div>

                                        {/* <!-- Menu with submenu --> */}
                                        <a href="#submenu4" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="d-flex w-100 justify-content-start align-items-center">
                                                <span className="fa fa-user-tie fa-fw mr-3"></span>
                                                <span className="menu-collapsed">Empleados</span>
                                                <span className="submenu-icon ml-auto"></span>
                                            </div>
                                        </a>
                                        {/* <!-- Submenu content --> */}
                                        <div id='submenu4' className="collapse sidebar-submenu">
                                            <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Lorem Ipsum</span>
                                            </a>
                                            <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Lorem Ipsum</span>
                                            </a>
                                        </div>

                                        {/* <!-- Menu with submenu --> */}
                                        <a href="#submenu5" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="d-flex w-100 justify-content-start align-items-center">
                                                <span className="fa fa-user fa-fw mr-3"></span>
                                                <span className="menu-collapsed">Usuarios</span>
                                                <span className="submenu-icon ml-auto"></span>
                                            </div>
                                        </a>
                                        {/* <!-- Submenu content --> */}
                                        <div id='submenu5' className="collapse sidebar-submenu">
                                            <Link to="/usuario" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span clasName="menu-collapsed">Buscar/Modificar</span>
                                            </Link>
                                            <Link to="/nuevousuario" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Nuevo</span>
                                            </Link>
                                        </div>

                                        {/* <!-- Separator with title --> */}
                                        <li className="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                                            <small>CONSULTAS</small>
                                        </li>
                                        {/* <!-- /END Separator --> */}


                                        {/* <!-- Menu with submenu --> */}
                                        <a href="#submenu6" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="d-flex w-100 justify-content-start align-items-center">
                                                <span className="fa fa-file-pdf fa-fw mr-3"></span>
                                                <span className="menu-collapsed">Reportes</span>
                                                <span className="submenu-icon ml-auto"></span>
                                            </div>
                                        </a>
                                        {/* <!-- Submenu content --> */}
                                        <div id='submenu6' className="collapse sidebar-submenu">
                                            <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Lorem Ipsum</span>
                                            </a>
                                            <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                                <span className="menu-collapsed">Lorem Ipsum</span>
                                            </a>
                                        </div>

                                        {/* <!-- Separator without title --> */}
                                        <li className="list-group-item sidebar-separator menu-collapsed"></li>
                                        {/* <!-- /END Separator --> */}
                                        <a href="#" className="bg-dark list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-start align-items-center">
                                                <span className="fa fa-info fa-fw mr-3"></span>
                                                <span className="menu-collapsed">Acerca de</span>
                                            </div>
                                        </a>
                                    </ul>
                                    {/* <!-- List Group END--> */}
                                </div>
                                {/* <!-- sidebar-container END --> */}

                                {/* <!-- MAIN --> */}
                                <div className="col-10 p-4">
                                    <PrivateRoute exact path="/" component={Home} />
                                    <PrivateRoute path="/clientes" roles={["Admin", 'PM', 'Member']} component={Cliente} />
                                    {/*<Route path="/clientes" component={Cliente} />*/}
                                <PrivateRoute path="/nuevocliente" roles={["Admin", 'PM']} component={NuevoCliente} />
                                <PrivateRoute path="/usuario" roles={["Admin"]} component={Usuario} />
                                <PrivateRoute path="/nuevousuario" roles={["Admin"]} component={NuevoUsuario} />


                                </div>
                                {/* <!-- Main Col END --> */}
                            </div>
                            {/* <!-- body-row END --> */}
                            </div>
                            {/* <!-- NavBar END --> */}
                        </div>
                    }

                    {!loggedIn && <Redirect to="/login" />}
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                </div >
            </Router >
        );
    }
}