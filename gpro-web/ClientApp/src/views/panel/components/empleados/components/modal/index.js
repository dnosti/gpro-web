import React, { Component } from 'react';
import { Modal, Form, DatePicker, Row, Col } from 'antd';
import * as Yup from 'yup';
import { omit } from 'lodash';
import moment from 'moment';
import { FormItem } from '../../../../../../globalComponents';

const validateSchema = Yup.object().shape({
  apellidoEmpleado: Yup.string()
    .required('Campo requerido.'),
  
  nombreEmpleado: Yup.string()
    .required('Campo requerido.'),
  
  fechaIngreso: Yup.date()
    .required('Campo requerido.')
    .nullable(),
  
  telefono: Yup.string()
    .required('Campo requerido.'),
  
  domicilio: Yup.string()
    .required('Campo requerido.'),
  
  localidad: Yup.string()
    .required('Campo requerido.'),
  
  provincia: Yup.string()
    .required('Campo requerido.'),
  
  dni: Yup.string()
    .min(6, 'Formato incorrecto')
    .max(8, 'Formato incorrecto')
    .required('Campo requerido.'),

  nacionalidad: Yup.string()
    .required('Campo requerido.')
});

class EmpleadosModal extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      form: {
        apellidoEmpleado: '',
        nombreEmpleado: '',
        fechaIngreso: null,
        domicilio: '',
        telefono: '',
        localidad: '',
        provincia: '',
        dni: '',
        nacionalidad: ''
      },
      errors: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if (!!this.props.empleado) {
        this.setState({
          form: {
            ...this.props.empleado,
            fechaIngreso: moment(this.props.empleado.fechaIngreso)
          },
          errors: {}
        });
      } else {
        this.reset();
      }
    }
  }

  reset = () => {
    this.setState({
      form: {
        apellidoEmpleado: '',
        nombreEmpleado: '',
        fechaIngreso: null,
        domicilio: '',
        telefono: '',
        localidad: '',
        provincia: '',
        dni: '',
        nacionalidad: ''
      },
      errors: {}
    });
  }

  render() {
    const { visible, handleModal, creating, editando, empleado } = this.props;
    const { form, errors } = this.state;
  
    return (
      <Modal
        title={!!empleado ? 'Editar empleado' : 'Nuevo empleado'}
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
                label='Nombre'
                name='nombreEmpleado'
                placeholder='nombreEmpleado'
                value={form.nombreEmpleado}
                error={errors.nombreEmpleado}
                onChange={this.onChange}/>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Apellido'
                name='apellidoEmpleado'
                placeholder='apellidoEmpleado'
                value={form.apellidoEmpleado}
                error={errors.apellidoEmpleado}
                onChange={this.onChange}/>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='DNI'
                name='dni'
                type='number'
                placeholder='dni'
                value={form.dni}
                error={errors.dni}
                onChange={this.onChange}/>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Domicilio'
                name='domicilio'
                placeholder='domicilio'
                value={form.domicilio}
                error={errors.domicilio}
                onChange={this.onChange}/>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Nacionalidad'
                name='nacionalidad'
                placeholder='nacionalidad'
                value={form.nacionalidad}
                error={errors.nacionalidad}
                onChange={this.onChange}/>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Localidad'
                name='localidad'
                placeholder='localidad'
                value={form.localidad}
                error={errors.localidad}
                onChange={this.onChange}/>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Provincia'
                name='provincia'
                placeholder='provincia'
                value={form.provincia}
                error={errors.provincia}
                onChange={this.onChange}/>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Telefono'
                name='telefono'
                type='number'
                placeholder='telefono'
                value={form.telefono}
                error={errors.telefono}
                onChange={this.onChange}/>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <Form.Item
                label='Fecha de ingreso'
                hasFeedback
                validateStatus={!!errors.fechaIngreso ? 'error' : null}
                help={errors.fechaIngreso}>
                <DatePicker 
                  size='large'
                  disabledDate={this.disabledDate}
                  value={form.fechaIngreso}
                  onChange={fecha => this.onChange(fecha, 'fechaIngreso')} />
              </Form.Item>
            </Col>
          </Row>  
        </Form>
      </Modal>
    );
  }

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  handleSubmit = async () => {
    const { form } = this.state;
    try {
      // VALIDO CON YUP
      await validateSchema.validate(form, { abortEarly: false });

      if (!!this.props.empleado) {
        return this.props.editarEmpleado(form);
      }

      this.props.crearEmpleado(form);
    } catch (error) {
      let errors = {};

      error.inner.forEach(error => {
        errors[error.path] = error.message;
      });
  
      this.setState({ errors });
    }
  }

  onChange = (value, key) => {
    if (key === 'nombreEmpleado' || key === 'apellidoEmpleado' || key === 'provincia'
      || key === 'nacionalidad' || key === 'localidad') {
      const valid = /^$|^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(value)
      
      if (!valid) return
    }

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

export default EmpleadosModal;