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
    .required('Campo requerido.'),
  
  telefono: Yup.string()
    .required('Campo requerido.'),
  
  domicilio: Yup.string()
    .required('Campo requerido.'),
  
  localidad: Yup.string()
    .required('Campo requerido.'),
  
  provincia: Yup.string()
    .required('Campo requerido.'),
  
  dni: Yup.string()
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
                label='CUIT'
                name='idCliente'
                placeholder='idCliente'
                value={form.idCliente}
                error={errors.idCliente}
                onChange={this.onChange}/>
            </Col>
          </Row>
          
          {
            Object.keys(form).map((key, index) => {
              let type='text';

              if (key === 'fechaIngreso') {
                return (
                  <div key={index}>
                    <p>Fecha de ingreso:</p>
                    <DatePicker 
                      value={form.fechaIngreso}
                      onChange={fecha => this.onChange(fecha, 'fechaIngreso')} />
                  </div>
                );
              }

              if (key !== 'idEmpleado') {
                return (
                  <FormItem
                    label={key}
                    key={index}
                    name={key}
                    type={type}
                    placeholder={key}
                    value={form[key]}
                    error={errors[key]}
                    onChange={this.onChange}/>
                );
              }

              return null;
            })
          }
  
        </Form>
      </Modal>
    );
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