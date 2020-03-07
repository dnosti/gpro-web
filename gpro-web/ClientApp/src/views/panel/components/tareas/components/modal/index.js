import React, { Component } from 'react';
import { Modal, Form, Row, Col, Select, Input, InputNumber } from 'antd';
import * as Yup from 'yup';
import { omit, pick } from 'lodash';

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
    .nullable()
});

class TareaModal extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      proyectoIdProyecto: '',
      perfilEmpleadoIdEmpleado: '',
      perfilEmpleadoIdPerfil: '',
      descripcionTarea: '',
      horasEstimadasTarea: '',
      errors: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if (!!this.props.tarea) {
        this.setState({
          ...pick(this.props.tarea, [
            'proyectoIdProyecto',
            'perfilEmpleadoIdEmpleado',
            'perfilEmpleadoIdPerfil',
            'descripcionTarea',
            'horasEstimadasTarea']),
          errors: {}
        });
      } else {
        this.reset();
      }
    }
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

  render() {
    const { proyectos, perfiles, empleados, visible, loading, tarea, handleModal } = this.props;
    const { 
      proyectoIdProyecto, 
      perfilEmpleadoIdPerfil, 
      perfilEmpleadoIdEmpleado,
      descripcionTarea, 
      horasEstimadasTarea,
      errors
    } = this.state;
  
    return (
      <Modal
        title={!!tarea ? 'Editar Tarea' : 'Crear Tarea'}
        visible={visible}
        onOk={this.handleSubmit}
        okText='Confirmar'
        okButtonProps={{ 
          loading: loading, 
          disabled: loading
        }}
        onCancel={handleModal}
        cancelButtonProps={{ disabled: loading }}
        cancelText='Cancelar'
        width='50%'>

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

      </Modal>
    );
  }

  handleSubmit = async () => {
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

    if (!this.props.tarea) {
      this.props.crearTarea(data);
    } else {
      this.props.editarTarea({
        ...data,
        idTarea: this.props.tarea.idTarea
      });
    }
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
}

export default TareaModal;