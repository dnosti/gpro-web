import React, { Component } from 'react';
import { Modal, Form, message, InputNumber, DatePicker } from 'antd';
import * as Yup from 'yup';
import { omit } from 'lodash';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';
import moment from 'moment';  

const validateSchema = Yup.object().shape({

  catidadHorasTrab: Yup.number()
    .min(1, 'Min 1')
    .max(10, 'Max 10')
    .required('Campo requerido.')
    .nullable(),

  fechaHorasTrab: Yup.object()
    .required('Campo requerido.')
    .nullable(),

});

class UsuariosModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creando: false,

      form: {
        perfilIdPerfil: '',
        idEmpleado: '',
        proyectoIdProyecto: '',
        tareaIdTarea: '',
        catidadHorasTrab: null,
        fechaHorasTrab: null,
        estadoHorasTrab: 'Adeudadas'
      },

      errors: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if (!!this.props.tarea) {
        const { 
          perfilEmpleadoIdPerfil,
          perfilEmpleadoIdEmpleado,
          proyectoIdProyecto,
          idTarea
        } = this.props.tarea;
        this.setState({
          form: {
            ...this.state.form,
            perfilIdPerfil: perfilEmpleadoIdPerfil,
            idEmpleado: perfilEmpleadoIdEmpleado,
            proyectoIdProyecto: proyectoIdProyecto,
            tareaIdTarea: idTarea,
            catidadHorasTrab: null,
            fechaHorasTrab: null
          }
        });
      }
    }
  }

  render() {
    const { visible, handleModal } = this.props;
    const { form, errors, creando } = this.state;

    return (
      <Modal
        title='Cargar Horas Trabajadas'
        visible={visible}
        onOk={this.handleSubmit}
        okText='Confirmar'
        okButtonProps={{
          loading: creando,
          disabled: creando
        }}
        onCancel={handleModal}
        cancelButtonProps={{ disabled: creando }}
        cancelText='Cancelar'
        width='50%'>
        <Form>
          
          <Form.Item
            label='Cantidad de horas'
            hasFeedback
            validateStatus={!!errors.catidadHorasTrab ? 'error' : null}
            help={errors.catidadHorasTrab}>
            <InputNumber
              value={form.catidadHorasTrab}
              min={1}
              max={10}
              onChange={value => this.onChange(value, 'catidadHorasTrab')}
              style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label='Fecha'
            hasFeedback
            validateStatus={!!errors.fechaHorasTrab ? 'error' : null}
            help={errors.fechaHorasTrab}>
            <DatePicker 
              value={form.fechaHorasTrab}
              disabledDate={this.disabledDate}
              onChange={fecha => this.onChange(fecha, 'fechaHorasTrab')} />
          </Form.Item>

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
      await validateSchema.validate(form, { abortEarly: false });

      this.crearHoras();
    } catch (error) {
      let errors = {};

      error.inner.forEach(error => {
        errors[error.path] = error.message;
        
      });

      this.setState({ errors });
    }
  }

  crearHoras = async () => {
    try {
      this.setState({ creando: true });

      const res = await axios.post('http://localhost:60932/horatrabajadas', this.state.form, getHeader());

      if (res.data) {
        message.success('Horas cargadas con exito!');
        this.props.handleModal();
      }

    } catch (error) {
      let messageError = 'Hubo un error';
    
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error';
      }

      message.error(messageError);
    }

    this.setState({ creando: false });
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

export default UsuariosModal;