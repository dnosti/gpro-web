import './index.css';
import React, { Component } from 'react';
import { Select, Button, message, Divider, Input, InputNumber, Form, Row, Col } from 'antd';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import * as Yup from 'yup';
import { omit } from 'lodash';

const validateSchema = Yup.object().shape({
  proyectoIdProyecto: Yup.string()
    .required('Debe seleccionar un proyecto'),

  perfilEmpleadoIdEmpleado: Yup.string()
    .required('Debe seleccionar un empleado'),

  perfilEmpleadoIdPerfil: Yup.string()
    .required('Debe seleccionar un perfil'),

  descripcionTarea: Yup.string()
    .required('Debe ingresar una descripción'),

  horasEstimadasTarea: Yup.string()
    .required('Debe ingresar horas estimadas')
});

class CrearProyecto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proyectos: [],
      perfiles: [],
      empleados: [],

      proyectoIdProyecto: '',
      perfilEmpleadoIdEmpleado: '',
      perfilEmpleadoIdPerfil: '',
      descripcionTarea: '',
      horasEstimadasTarea: '',

      loading: false,
      errors: {}
    };
  }

  componentDidMount() {
    this.getProyectos();
    this.getEmpleados();
    this.getPerfiles();
  }

  render() {
    const { loading, proyectos, empleados, perfiles, errors } = this.state;
    const { 
      proyectoIdProyecto, 
      perfilEmpleadoIdPerfil, 
      perfilEmpleadoIdEmpleado,
      descripcionTarea, 
      horasEstimadasTarea 
    } = this.state;

    return (
      <div className='tareas'> 
        <h3>Crear y asignar Tarea</h3>

        <Divider />

        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Form.Item
              label='Seleccionar Proyecto'
              hasFeedback
              validateStatus={!!errors.proyectoIdProyecto ? 'error' : null}
              help={errors.proyectoIdProyecto}>
              <Select 
                style={{ width: '100%' }}
                value={proyectoIdProyecto}
                onChange={value => this.onChange(value, 'proyectoIdProyecto')}>
                {
                  proyectos.map((proyecto, index) => {
                    return (
                      <Select.Option 
                        key={index}
                        value={proyecto.idProyecto}>
                        {proyecto.idProyecto} - {proyecto.tituloProyecto}
                      </Select.Option>
                    );
                  })
                }
              </Select>
            </Form.Item>    
          </Col>

          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Form.Item
              label='Horas estimadas'
              hasFeedback
              validateStatus={!!errors.horasEstimadasTarea ? 'error' : null}
              help={errors.horasEstimadasTarea}>
              <InputNumber 
                value={horasEstimadasTarea}
                onChange={value => this.onChange(value, 'horasEstimadasTarea')}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Form.Item
              label='Seleccionar Empleado'
              hasFeedback
              validateStatus={!!errors.perfilEmpleadoIdEmpleado ? 'error' : null}
              help={errors.perfilEmpleadoIdEmpleado}>
              <Select
                style={{ width: '100%' }}
                value={perfilEmpleadoIdEmpleado}
                onChange={value => this.onChange(value, 'perfilEmpleadoIdEmpleado')}>
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
              label='Seleccionar Perfil'
              hasFeedback
              validateStatus={!!errors.perfilEmpleadoIdPerfil ? 'error' : null}
              help={errors.perfilEmpleadoIdPerfil}>
              <Select
                style={{ width: '100%' }}
                value={perfilEmpleadoIdPerfil}
                onChange={value => this.onChange(value, 'perfilEmpleadoIdPerfil')}>
                {
                  perfiles.map((perfil, index) => {
                    return (
                      <Select.Option
                      key={index}
                      value={perfil.idPerfil}>
                      {perfil.descripcionPerfil}
                      </Select.Option>
                    );
                  })
                }
              </Select>
            </Form.Item>
          </Col>

          <Col xs={{ span: 24 }}
            lg={{ span: 12 }}>
            <Form.Item
              label='Descripción Tarea'
              hasFeedback
              validateStatus={!!errors.descripcionTarea ? 'error' : null}
              help={errors.descripcionTarea}>
              <Input.TextArea 
                style={{ marginBottom: 10 }}
                value={descripcionTarea}
                onChange={event => this.onChange(event.target.value, 'descripcionTarea')}/>
            </Form.Item>
          </Col>
        </Row>
        
        <div className='empleados-buttons'>
          <Button
            style={{ marginRight: '10px' }}
            disabled={loading}
            onClick={this.reset}>
            Limpiar
          </Button>

          <Button
            loading={loading}
            disabled={loading}
            type='primary'
            icon='plus-circle'
            onClick={this.crearTarea}>
            Crear
          </Button>
        </div>
      </div>
    );
  }

  reset = () => {
    this.setState({
      proyectoIdProyecto: '',
      perfilEmpleadoIdEmpleado: '',
      perfilEmpleadoIdPerfil: '',
      descripcionTarea: '',
      horasEstimadasTarea: '',
      errors: {}
    });
  }

  crearTarea = async () => {
    const { 
      proyectoIdProyecto,
      perfilEmpleadoIdEmpleado,
      perfilEmpleadoIdPerfil,
      descripcionTarea,
      horasEstimadasTarea 
    } = this.state;

    const data = {
      proyectoIdProyecto,
      perfilEmpleadoIdEmpleado,
      perfilEmpleadoIdPerfil,
      descripcionTarea,
      horasEstimadasTarea 
    }

    try {
      await validateSchema.validate(data, { abortEarly: false });
    } catch (error) {
      let errors = {};
      error.inner.forEach(error => {
        errors[error.path] = error.message;
      });
      return this.setState({ errors });
    }
    
    try {
      this.setState({ loading: true });

      const res = await axios.post('http://localhost:60932/tarea/', data, getHeader());

      if (!!res.data) message.success('Perfil Empleado generado con exito');

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
    const { errors } = this.state;

    if (errors[key]) {
      let _errors = omit(errors, key);
      this.setState({
        errors: _errors
      });
    }

    this.setState({ [key]: value });
  }

  getProyectos = async () => {
    try {
      const res = await axios.get('http://localhost:60932/proyectos/', getHeader());
      this.setState({ proyectos: res.data });
    } catch (error) {}
  }

  getEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:60932/empleado/', getHeader());
      this.setState({ empleados: res.data });
    } catch (error) {}
  }

  getPerfiles = async () => {
    try {
      const res = await axios.get('http://localhost:60932/perfiles/', getHeader());
      this.setState({ perfiles: res.data });
    } catch (error) {}
  }

}

export default CrearProyecto;