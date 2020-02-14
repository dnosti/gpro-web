import './index.css';
import React, { Component } from 'react';
import { Row, Col, Form, Button, Icon, message } from 'antd';
import Logo from '../../assets/logo-gpro.png';
import { FormItem } from '../../globalComponents';
import * as Yup from 'yup';
import { omit } from 'lodash';
import axios from 'axios';
import { url } from '../../utils';

const validateSchema = Yup.object().shape({
  username: Yup.string()
    .required('Debe ingresar nombre de usuario'),

  password: Yup.string()
    .required('Debe ingresar su contraseña')
});

export class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: ''
      },
      errors: {},
      loading: false
    };
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // AUTH
    if (!!currentUser) {
      this.props.history.push('/');
    }
  }

  renderIcon = key => {
    if (key === 'email') {
      return '@';
    }

    return (
      <Icon type='lock' />
    );
  }

  render() {
    const { form, errors, loading } = this.state;

    return (
      <Row className='login'>
        <Col>
          <img 
            src={Logo} 
            alt=''
            className='login-logo' />
        </Col>

        <Col>
          <h3 className='login-title'>Bienvenid@ a GPRO</h3>

          <Form
            onSubmit={this.handleSubmit}
            className='login-form'>

            {
              Object.keys(form).map((key, index) => {
                let placeholder = '';
                if (key === 'username') placeholder = 'Usuario';
                if (key === 'password') placeholder = 'Contraseña';
                return (
                  <FormItem 
                    prefix={this.renderIcon(key)}
                    key={index}
                    name={key}
                    placeholder={placeholder}
                    value={form[key]}
                    error={errors[key]}
                    onChange={this.onChange}/>
                );
              })
            }

            <Button 
              loading={loading}
              type='primary' 
              htmlType='submit'>
              Iniciar sesión
            </Button>
          </Form>

          <div>
            <p className='login-copyright'>
              GPRO. Copyright (c) 2020 Lisandro Caceres, Mariano Durand Mansilla, Dardo Nosti, Villarraza Juan Manuel.
              Licensed under the MIT license.
              <br />Versi&oacute;n 0.1. Enero 2020.
            </p>
          </div>
        </Col>
      </Row>
    );
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { form } = this.state;
    try {
      // VALIDO CON YUP
      await validateSchema.validate(form, { abortEarly: false });

      this.handleLogin();

    } catch (error) {
      let errors = {};

      error.inner.forEach(error => {
        errors[error.path] = error.message;
      });

      this.setState({ errors });
    }
  }

  handleLogin = async () => {
    const { form } = this.state;

    this.setState({ loading: true });

    try {
      const res = await axios.post(`${url}/usuarios/authenticate`, form);

      if (!!res.data) {
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        return this.props.history.push('/');
      }

    } catch (error) {
      let messageError = 'Hubo un error';
      if (error.response) {
        messageError = error.response.data.message;
      }

      message.error(messageError);
    }

    this.setState({ loading: false });
  }

  onChange = (value, key) => {
    const { errors, form } = this.state;
    // SI EL PARAM TIENE ERROR, LO BORRO
    if (errors[key]) {
      let _errors = omit(errors, key);
      this.setState({
        errors: _errors
      });
    }
    // CAMBIO STATE DEL PARAM
    this.setState({
      form: Object.assign({}, form, {
        [key]: value
      })
    });
  }
}

export default Login;