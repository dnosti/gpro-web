import React, { Component } from 'react';
import { Modal, Form, message, Select, Row, Col, DatePicker } from 'antd';
import * as Yup from 'yup';
import { omit } from 'lodash';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';
import moment from 'moment';

const validateSchema = Yup.object().shape({
  idEmpleado: Yup.string()
    .required('Campo requerido.'),

  fechaDesde: Yup.date()
    .required('Campo requerido.')
    .nullable(),

  fechaHasta: Yup.date()
    .required('Campo requerido.')
    .nullable(),

});

class LiquidacionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      empleados: [],
      form: {
        idEmpleado: '',
        fechaDesde: null,
        fechaHasta: null
      },
      errors: {}
    }
  }

  componentDidMount() {
    this.getEmpleados();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      form: {
        idEmpleado: '',
        fechaDesde: null,
        fechaHasta: null
      }
    });
  }

  render() {
    const { visible, handleModal, creating } = this.props;
    const { form, errors, empleados } = this.state;

    return (
      <Modal
        title='Crear Liquidacion'
        visible={visible}
        onOk={this.handleSubmit}
        okText='Confirmar'
        okButtonProps={{
          loading: creating,
          disabled: creating
        }}
        onCancel={handleModal}
        cancelButtonProps={{ disabled: creating }}
        cancelText='Cancelar'
        width='50%'>
        <Form>
          <Row>
            
            <Col span={24}>
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

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label='Fecha de inicio'
                hasFeedback
                validateStatus={!!errors.fechaDesde ? 'error' : null}
                help={errors.fechaDesde}>
                <DatePicker 
                  size='large'
                  value={form.fechaDesde}
                  disabledDate={this.disabledDate}
                  onChange={fecha => this.onChange(fecha, 'fechaDesde')} />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label='Fecha de fin'
                hasFeedback
                validateStatus={!!errors.fechaHasta ? 'error' : null}
                help={errors.fechaHasta}>
                <DatePicker 
                  size='large'
                  value={form.fechaHasta}
                  disabledDate={this.disabledDate}
                  onChange={fecha => this.onChange(fecha, 'fechaHasta')} />
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
    const { form, errors } = this.state;
    try {
      // VALIDO CON YUP
      await validateSchema.validate(form, { abortEarly: false });

      this.props.crearLiquidacion(form);
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

}

export default LiquidacionModal;