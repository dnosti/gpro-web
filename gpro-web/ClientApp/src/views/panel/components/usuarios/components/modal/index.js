import React, { Component } from 'react';
import { Modal, Form, message } from 'antd';
import * as Yup from 'yup';
import { omit } from 'lodash';
import { FormItem } from '../../../../../../globalComponents';

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
    const { form, errors } = this.state;

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

          {
            Object.keys(form).map((key, index) => {
                if (!(key === 'id' || 
                (!!usuario && key === 'idEmpleado') || 
                key === 'apellidoEmpleado' || 
                key === 'nombreEmpleado' || 
                key === 'dni')) {
                  
                  return (
                    <FormItem
                      label={key}
                      key={index}
                      name={key}
                      placeholder={key}
                      value={form[key]}
                      error={errors[key]}
                      onChange={this.onChange} />
                  );
                }
            })
          }

        </Form>
      </Modal>
    );
  }
  
  handleSubmit = async () => {
    console.log();
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
      console.log(error);
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

export default UsuariosModal;