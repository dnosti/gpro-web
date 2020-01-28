import React, { Component } from 'react';

import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Link
} from 'react-router-dom';
import { Role } from './components/role';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';
import { Cliente } from './components/Cliente';

/*import { Recov } from './components/Recov';*/
import Logo from '../src/assets/img/logo-gpro-nav.png';
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
                    <ScrollUpButton style={{ backgroundColor: "rgba(7, 65, 173, 0.80)"}} />
                    {currentUser &&
                        <div>
                        <nav className="navbar fixed-top navbar-expand-md navbar-dark home-navbar-bg" id="barranav">
                            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <a className="navbar-brand" href="#">
                                <img src={Logo} width="27px" className="d-inline-block align-top" alt=""></img>
                                <span className="menu-collapsed ml-2">GPRO</span>
                                <span className="menu-collapsed ml-2 font-s-logo">V. 0.1</span>
                            </a>
                            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-link">
                                        <span class="badge badge-secondary badge-dark text-info"><span className="fa fa-user fa-fw mr-2 pl-2"></span><span className="pr-2 pl-1">{currentUser.username}</span></span>
                                    </li>
                                    <li className="nav-link mr-3">
                                        <span class="badge badge-secondary badge-dark text-info"><span className="fa fa-user-tag fa-fw mr-2 pl-2"></span><span className="pr-2 pl-2">{currentUser.rol}</span></span>
                                    </li>
                                    <li className="nav-item active mr-4">
                                        <a className="nav-link" href="#top">Inicio</a>
                                    </li>
                                    <li className="nav-item">
                                        <button type="button" className="btn btn-primary nav-item" onClick={this.logout}>Cerrar sesi&oacute;n</button>
                                    </li>

                                    {/*
                                     <!-- This menu is hidden in bigger devices with d-sm-none.
                                    The sidebar isn't proper for smaller screens imo, so this dropdown menu can keep all the useful sidebar itens exclusively for smaller screens  -->
                                    */}

                                    <li className="nav-item dropdown d-sm-block d-md-none">
                                        <a className="nav-link dropdown-toggle" href="#" id="smallerscreenmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Menu </a>
                                        <div className="dropdown-menu" aria-labelledby="smallerscreenmenu">
                                            <a className="dropdown-item" href="#top">hjsahgjsa</a>
                                            <a className="dropdown-item" href="#top">Profile</a>
                                            <a className="dropdown-item" href="#top">Tasks</a>
                                            <a className="dropdown-item" href="#top">Etc ...</a>
                                        </div>
                                    </li> {/*<!-- Smaller devices menu END -->*/}
                                </ul>
                            </div>
                        </nav>
                    

                        {/* Bootstrap row */}
                        <div className="row" id="body-row">
                            {/* <!-- Sidebar --> */}
                            <div id="sidebar-container" className="sidebar-expanded d-none d-md-block">
                                {/* <!-- d-* hiddens the Sidebar in smaller devices. Its itens can be kept on the Navbar 'Menu' --> */}
                                {/* <!-- Bootstrap List Group --> */}
                                <ul className="list-group">
                                    {/* <!-- Separator with title --> */}
                                    <li className="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                                        <small>MENU</small>
                                    </li>
                                    {/* <!-- /END Separator --> */}
                                    {/* <!-- Menu with submenu --> */}
                                    <a href="#submenu1" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
                                        <div class="d-flex w-100 justify-content-start align-items-center">
                                            <span className="fa fa-users fa-fw mr-3"></span>
                                            <span className="menu-collapsed">Clientes</span>
                                            <span className="submenu-icon ml-auto"></span>
                                        </div>
                                    </a>
                                    {/* <!-- Submenu content --> */}
                                    <div id='submenu1' className="collapse sidebar-submenu">
                                        <Link to = "/clientes" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span className="menu-collapsed">Buscar</span>
                                        </Link>
                                        <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span className="menu-collapsed">Nuevo</span>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span className="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                    </div>
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
                                            <span clasName="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span className="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                    </div>

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
                                            <span clasName="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span className="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                    </div>

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
                                            <span clasName="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span className="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                    </div>

                                    <a href="#submenu5" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
                                        <div className="d-flex w-100 justify-content-start align-items-center">
                                            <span className="fa fa-user fa-fw mr-3"></span>
                                            <span className="menu-collapsed">Usuarios</span>
                                            <span className="submenu-icon ml-auto"></span>
                                        </div>
                                    </a>
                                    {/* <!-- Submenu content --> */}
                                    <div id='submenu5' className="collapse sidebar-submenu">
                                        <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span clasName="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
                                            <span className="menu-collapsed">Lorem Ipsum</span>
                                        </a>
                                    </div>



                                    {/* <!-- Separator with title --> */}
                                    <li className="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                                        <small>CONSULTAS</small>
                                    </li>
                                    {/* <!-- /END Separator --> */}
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
                                            <span clasName="menu-collapsed">Lorem Ipsum</span>
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

                            {/* <!-- MAIN --> */ }
                            <div className="col p-4">
                                
                                <PrivateRoute exact path="/" component={Home} />
                                <Route path="/clientes" component={Cliente} />
                                {/* 
                                <h1 className="display-4">Collapsing Sidebar Menu</h1>
                                <div className="card">
                                    <h5 className="card-header font-weight-light">Requirements</h5>
                                    <div className="card-body">
                                        <ul>
                                            <li>JQuery</li>
                                            <li>Bootstrap 4.3</li>
                                            <li>FontAwesome</li>
                                        </ul>
                                    </div>
                                </div>
                                */}
                            </div>
                            {/* <!-- Main Col END --> */}
                        </div>
                        {/* <!-- body-row END --> */}    
                        {/* <!-- NavBar END --> */}
                        </div>
                    }

                    {!loggedIn && <Redirect to="/login"/>}
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    
                    {/*<Route path="/recov" component={Recov} />*/}
                    </div >
                
            </Router >
        );
    }
}