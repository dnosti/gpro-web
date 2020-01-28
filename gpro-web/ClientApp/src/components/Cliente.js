import React, { Component } from 'react';
import { userService } from './user.service';
import { authenticationService } from './authentication.service';
import { clienteService } from './cliente.service';
import { Formik, Field, Form, ErrorMessage } from 'formik';


export class Cliente extends Component {
    static displayName = Cliente.name;
    constructor(props) {
        super(props);
        document.body.style.backgroundColor = '#FFFFFF';
        document.body.style.paddingTop = '53px';
        this.state = {
            currentUser: authenticationService.currentUserValue,
            users: null,
            consulta: []
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        if (currentUser.rol === "Admin" || currentUser.rol === "PM") {
            userService.getAll().then(users => this.setState({ users }));
        }
    }

    render() {
        const { consulta } = this.state;
        return (
            <div>
                <Formik
                    initialValues={{ dato: '' }}
                    validate={values => {
                        let errors = {};
                        if (!values.dato) {
                            errors.dato = 'Campo requerido.';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        setStatus();
                        clienteService.getByString(values.dato).then(
                            consulta => this.setState({ consulta })
                        );
                    }
                    }
                >
                    {({ errors, status, touched, isSubmitting }) => (

                        <div className="container-fluid minh-100 ">
                            <div className="container">
                                <div className="row justify-content-flex-start align-items-flex-start minh-100">
                                    <div className="buscar-clientes">
                                        <div className="card border-0">
                                            <div className="card-body">
                                                <div className="txt-color">Buscar cliente</div>
                                                <Form>
                                                    <div className="form-group">
                                                        <Field name="dato" type="text" className={'form-control'} />
                                                        <ErrorMessage name="dato" component="div" className="invalid-feedback" />
                                                    </div>

                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-primary">Buscar</button>
                                                    </div>
                                                </Form>
                                                <div className="container">
                                                    <thead>
                                                        <tr>
                                                            <th className="column-tb1">CUIT</th>
                                                            <th className="column-tb3">Razon Social</th>
                                                            <th className="column-tb2">Apellido</th>
                                                            <th className="column-tb2">Nombre</th>
                                                            <th className="column-tb3">Domicilio</th>
                                                            <th className="column-tb1">Teléfono</th>
                                                            <th className="column-tb2">E-Mail</th>

                                                        </tr>
                                                    </thead>
                                                    {consulta.map(cons =>
                                                        <tr>
                                                            <td className="column-tb1">{cons.idCliente}</td>
                                                            <td className="column-tb3">{cons.razonSocialCliente}</td>
                                                            <td className="column-tb2">{cons.apellidoCliente}</td>
                                                            <td className="column-tb2">{cons.nombreCliente}</td>
                                                            <td className="column-tb3">{cons.direccionCliente}</td>
                                                            <td className="column-tb1">{cons.telefonoCliente}</td>
                                                            <td className="column-tb2">{cons.emailCliente}</td>
                                                            </tr>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Formik>
            </div>
        );
    }
}