import React, { Component } from 'react';
import { Modal, Form, message, Select, Row, Col } from 'antd';
import * as Yup from 'yup';
import { omit } from 'lodash';
import { FormItem } from '../../../../../../globalComponents';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';

const validateSchema = Yup.object().shape({

  username: Yup.string()
    .required('Campo requerido.'),

  idEmpleado: Yup.string()
    .required('Campo requerido.'),

  idRol: Yup.string()
    .required('Campo requerido.'),

});

class UsuariosModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      empleados: [],
      rols: [],

      form: {
        id: '',
        username: '',
        password: '',
        idEmpleado: '',
        idRol: '',
      },
      errors: {}
    }
  }

  componentDidMount() {
    this.getEmpleados();
    this.getRols();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if (!!this.props.usuario) {
        this.setState({
          form: {
            ...this.props.usuario,
            password: ''
          }
        });
      } else {
        this.reset();
      }
    }
  }

  reset = () => {
    this.setState({
      form: {
        id: '',
        username: '',
        password: '',
        idEmpleado: '',
        idRol: ''
      }
    });
  }

  render() {
    const { visible, handleModal, creating, editando, usuario } = this.props;
    const { form, errors, empleados, rols } = this.state;

    return (
      <Modal
        title={!!usuario ? 'Editar usuario' : 'Nuevo usuario'}
        visible={visible}
        onOk={this.handleSubmit}
        okText='Confirmar'
        okButtonProps={{
          loading: creating || editando,
          disabled: creating || editando
        }}
        onCancel={handleModal}
        cancelButtonProps={{ disabled: creating || editando }}
        cancelText='Cancelar'
        width='50%'>
        <Form>
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Usuario'
                name='username'
                placeholder='Usuario'
                value={form.username}
                error={errors.username}
                onChange={this.onChange} />
            </Col>
            
            {
              !usuario &&
              <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
                <Form.Item
                  label='Empleado'
                  hasFeedback
                  validateStatus={!!errors.idEmpleado ? 'error' : null}
                  help={errors.idEmpleado}>
                  <Select
                    size='large'
                    style={{ width: '100%' }}
                    value={form.idEmpleado}
                    onChange={value => this.onChange(value, 'idEmpleado')}>
                    {
                      empleados.map((empleado, index) => {
                        return (
                          <Select.Option
                            key={index}
                            value={empleado.idEmpleado}>
                            {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                          </Select.Option>
                        );
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            }

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <Form.Item
                label='Rol'
                hasFeedback
                validateStatus={!!errors.idRol ? 'error' : null}
                help={errors.idRol}>
                <Select
                  size='large'
                  style={{ width: '100%' }}
                  value={form.idRol}
                  onChange={value => this.onChange(value, 'idRol')}>
                  {
                    rols.map((rol, index) => {
                      return (
                        <Select.Option
                          key={index}
                          value={rol.id}>
                          {rol.rol1}
                        </Select.Option>
                      );
                    })
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Contraseña'
                name='password'
                placeholder='Contraseña'
                value={form.password}
                error={errors.password}
                onChange={this.onChange} />
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
  
  handleSubmit = async () => {
    const { form, errors } = this.state;
    try {
      // VALIDO CON YUP
      await validateSchema.validate(form, { abortEarly: false });

      if (!!this.props.usuario) {
        return this.props.editarUsuario(form);
      }

      if (!form.password) {
        this.setState({
          errors: {
            ...errors,
            password: 'Password requerido'
          }
        })
        return message.error('Ingrese password')
      }
      form.id = '0';
      this.props.crearUsuario(form);
    } catch (error) {
      let errors = {};

      error.inner.forEach(error => {
        errors[error.path] = error.message;
        
      });

      this.setState({ errors });
    }
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

  getEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:60932/empleado/', getHeader());
      this.setState({ empleados: res.data });
    } catch (error) {}
  }

  getRols = async () => {
    try {
      const res = await axios.get('http://localhost:60932/rols/', getHeader());
      this.setState({ rols: res.data });
    } catch (error) {}
  }
}

export default UsuariosModal;