import React, { Component } from 'react';
import { Modal, Form, Row, Col } from 'antd';
import * as Yup from 'yup';
import { omit } from 'lodash';
import { FormItem } from '../../../../../../globalComponents';

const validateSchema = Yup.object().shape({
  idCliente: Yup.string()
    .min(11, 'Formato incorrecto')
    .max(11, 'Formato incorrecto')
    .required('Campo requerido'),

  // razonSocialCliente: Yup.string()
  //   .required('Campo requerido'),

  nombreCliente: Yup.string()
    .required('Campo requerido'),

  apellidoCliente: Yup.string()
    .required('Campo requerido'),

  direccionCliente: Yup.string()
    .required('Campo requerido'),

  telefonoCliente: Yup.string()
    .required('Campo requerido'),

  emailCliente: Yup.string()
    .required('Campo requerido')
    .email('Formato de email incorrecto')
});

class ProyectoModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        idCliente: '',
        razonSocialCliente: '',
        apellidoCliente: '',
        nombreCliente: '',
        direccionCliente: '',
        telefonoCliente: '',
        emailCliente: ''
      },
      errors: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if (!!this.props.cliente) {
        this.setState({
          form: omit(this.props.cliente, ['lazyLoader','proyecto'])
        });
      } else {
        this.reset();
      }
    }
  }

  reset = () => {
    this.setState({
      form: {
        idCliente: '',
        razonSocialCliente: '',
        apellidoCliente: '',
        nombreCliente: '',
        direccionCliente: '',
        telefonoCliente: '',
        emailCliente: ''
      }
    });
  }

  render() {
    const { visible, handleModal, creating, editando, cliente } = this.props;
    const { form, errors } = this.state;

    return (
      <Modal
        title={!!cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                label='CUIT'
                name='idCliente'
                type='number'
                placeholder='idCliente'
                value={form.idCliente}
                error={errors.idCliente}
                onChange={this.onChange}/>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Razon Social'
                name='razonSocialCliente'
                placeholder='razonSocialCliente'
                value={form.razonSocialCliente}
                error={errors.razonSocialCliente}
                onChange={this.onChange}/>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Apellido'
                name='apellidoCliente'
                placeholder='apellidoCliente'
                value={form.apellidoCliente}
                error={errors.apellidoCliente}
                onChange={this.onChange}/>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Nombre'
                name='nombreCliente'
                placeholder='nombreCliente'
                value={form.nombreCliente}
                error={errors.nombreCliente}
                onChange={this.onChange}/>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Direccion'
                name='direccionCliente'
                placeholder='direccionCliente'
                value={form.direccionCliente}
                error={errors.direccionCliente}
                onChange={this.onChange}/>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='Telefono'
                name='telefonoCliente'
                type='number'
                placeholder='telefonoCliente'
                value={form.telefonoCliente}
                error={errors.telefonoCliente}
                onChange={this.onChange}/>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }} style={{ paddingLeft: 5, paddingRight: 5 }}>
              <FormItem
                label='E-mail'
                name='emailCliente'
                placeholder='emailCliente'
                value={form.emailCliente}
                error={errors.emailCliente}
                onChange={this.onChange}/>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }

  handleSubmit = async () => {
    const { form } = this.state;
    try {
      // VALIDO CON YUP
      await validateSchema.validate(form, { abortEarly: false });

      if (!!this.props.cliente) {
        return this.props.editarCliente(form);
      }

      this.props.crearCliente(form);
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
}

export default ProyectoModal;