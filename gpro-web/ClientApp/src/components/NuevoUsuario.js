import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../custom.css';
import swal from 'sweetalert';
import { userService } from './user.service';



export class NuevoUsuario extends Component {
    static displayName = NuevoUsuario.name;
    constructor(props) {
        super(props);
        document.body.style.backgroundColor = '#FFFFFF';
        document.body.style.paddingTop = '53px';
        this.state = {
            mostrar: false,
            consulta: [],
            post: null
        };
    }

    render() {
        return (
            <div>
                <Formik
                    initialValues={{ dni: '', username: '', password: '', idrol: '', idempleado: '' }}

                    validationSchema={Yup.object().shape(
                        {
                            dni: Yup.string().required('Campo requerido.'),

                            //razonsocialcliente: Yup.string()
                            //    .when('razonsocialcliente', {
                            //        is: (val) => val == undefined,
                            //        then: Yup.string().required('Campo requerido.')
                            //    }),

                            //apellidocliente: Yup.string()
                            //    .when('apellidocliente', {
                            //        is: (val) => val == undefined,
                            //        then: Yup.string().required('Campo requerido.')
                            //    }),

                            //nombrecliente: Yup.string()
                            //    .when('nombrecliente', {
                            //        is: (val) => val == undefined,
                            //        then: Yup.string().required('Campo requerido.')
                            //    }),

                            username: Yup.string().required('Campo requerido.'),

                            password: Yup.string().required('Campo requerido.'),

                            idrol: Yup.string().required('Campo requerido.')

                        })}

                    onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                        setStatus();

                        userService.getByDni(values.dni)
                            .then(
                                consulta => {
                                    this.setState({ consulta: [consulta], mostrar: true });
                                    setSubmitting(false);
                                },
                                error => {
                                    setSubmitting(false);

                                    //if (error === 'Not Found') {
                                    //    userService.register(values).then(
                                    //        cli => {
                                    //            return cli;
                                    //        },
                                    //        error => {
                                    //            setSubmitting(false);
                                    //            setStatus(error);
                                    //        });
                                    //    if (error === 'Not Found') {
                                    //        swal({
                                    //            title: "Guardado con éxito",
                                    //            text: "Presione aceptar",
                                    //            icon: "success",
                                    //            button: "Aceptar"
                                    //        });
                                    //        error = '';
                                    //        this.post = 'ok';

                                    //    }
                                    //}
                                    //resetForm();
                                    setStatus(error);
                                })//.then(
                            //res => {
                            //    if (this.state.consulta.id !== '') {
                            //                values.idempleado = this.consulta.idempleado;
                            //                userService.register(values);
                            //            }
                            //        }
                            //);
                        //if (this.post !== 'ok') {
                        //    setStatus('Found');
                        //    this.post = null;
                        //}
                    }
                    }>
                    {({ errors, status, touched, isSubmitting }) => (

                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <Form>
                                        <div className="form-group">

                                            DNI Empleado:
                                                        <Field name="dni" type="text" className={'form-control'} />
                                            <ErrorMessage name="dni" component="div" className="invalid-feedback" />
                                            Usuario:
                                                        <Field name="username" type="text" className={'form-control'} />
                                            <ErrorMessage name="usernme" component="div" className="invalid-feedback" />
                                            Contraseña:
                                                        <Field name="password" type="text" className={'form-control'} />
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                            Id Rol:
                                                        <Field name="idrol" type="text" className={'form-control' + (errors.direccioncliente && touched.direccioncliente ? ' is-invalid' : '')} />
                                            <ErrorMessage name="idrol" component="div" className="invalid-feedback" />

                                        </div>

                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Guardar</button>
                                        </div>
                                        {status &&
                                            <div className={'alert alert-danger'}>El empleado ya posee un usuario asociado.</div>
                                        }
                                    </Form>

                                </div>
                            </div>
                        </div>
                    )}
                </Formik>
            </div>
        );
    }
}
