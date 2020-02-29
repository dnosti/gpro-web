import './index.css';
import React, { Component } from 'react';
import { Row, Col, Table, Button, Form, Divider, message } from 'antd';
import { Modal } from './components';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import { FormItem } from '../../../../globalComponents';

class UsuariosView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: false,
      creating: false,
      dni: '',
      apellidoEmpleado: '',
      nombreEmpleado: '',
      empleados: [],
      dato: '',
      editando: false,
      usuario: null
    };
  }

  render() {
    const { visible, loading, empleados, dni, editando, usuario, dato } = this.state;

    const columns = [{
        title: 'DNI',
        dataIndex: 'dni',
        key: 'dni',
      }, {
        title: 'Nombre y Apellido',
        key: 'fullname',
        sorter: (a, b) => {
            return a.nombreEmpleado - b.nombreEmpleado;
        },
        render: item => {
            return `${item.nombreEmpleado} ${item.apellidoEmpleado}`
        }
      }, {
        title: 'Usuario',
        dataIndex: 'username',
        key: 'username',

      }, {
        title: 'Id Empl.',
        dataIndex: 'idEmpleado',
        key: 'idEmpleado',
      }, {
        title: 'Rol',
        dataIndex: 'idRol',
        key: 'idRol',
        render: data => {
          if (data === 1) return 'Admin'
          if (data === 2) return 'PM'
          if (data === 3) return 'Member'
          return data;
        }
      }, {
        title: 'Acciones',
        key: 'acciones',
        render: item => {
          return (
            <div>
              <Button
                onClick={() => this.handleEditar(item)}>
                Editar
              </Button> <Button
                onClick={() => this.handleEliminar(item)}>
                Eliminar
              </Button>
            </div>
          );
        }
      }
    ];

    return (
      <div>
        <Button
          type='primary'
          icon='plus-circle'
          onClick={this.handleModal}>
          Crear Usuario
        </Button>

        <Divider />
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 6 }}>
            <Form
              onSubmit={this.handleSubmit}
              className='login-form'>

              <FormItem
                key='dato'
                label='Apellido y/o nombre: '
                name='dato'
                placeholder='Ingrese'
                value={dato}
                error={null}
                onChange={this.onChange} />

              <FormItem
                key='dni'
                name='dni'
                label='DNI'
                placeholder='Ingrese'
                value={dni}
                error={null}
                onChange={this.onChange} />

              <div className='empleados-buttons'>
                <Button
                  style={{ marginRight: '10px' }}
                  onClick={() => this.setState({ dni: '', dato: '' })}>
                  Limpiar
                </Button>
                <Button
                  type='primary'
                  icon='search'
                  htmlType='submit'>
                  Buscar
                </Button>
              </div>
            </Form>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 17, offset: 1 }}>
            <Table
              columns={columns}
              pagination={{ pageSize: 5 }}
              dataSource={empleados}
              loading={loading}
              scroll={{ x: true }}
              rowKey='id'
              bordered
              locale={{ emptyText: "No hay usuarios" }} />
          </Col>
        </Row>

        <Modal
          visible={visible}
          handleModal={this.handleModal}
          crearUsuario={this.crearUsuario}
          editando={editando}
          usuario={usuario}
          editarUsuario={this.editarUsuario} />
      </div>
    );
  }

  editarUsuario = async (form) => {
    try {
      this.setState({ editando: true });
      const res = await axios.put(`http://localhost:60932/usuarios/${form.id}`, form, getHeader());
      if (res.status === 200) {
        message.success('Usuario actualizado con éxito');
        this.handleSubmit();
        this.handleModal();
      }
    } catch (error) {
      let messageError = 'Hubo un error';
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error';
      }

      message.error(messageError);
    }

    this.setState({ editando: false });
  }

  handleEditar = (usuario) => {
    this.setState({
      visible: true,
      usuario: usuario
    });
  }

  handleEliminar = async (usuario) => {
    try{
      this.setState({ creating: true });
      const res = await axios.delete(`http://localhost:60932/usuarios/${usuario.id}`, getHeader());
      if (res.status === 200) {
        message.success('Usuario eliminado con éxito');
        this.handleSubmit();
      }
    }catch(error) {
      let messageError = 'Hubo un error';
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error';
      }
      message.error(messageError);
    }
  }
  crearUsuario = async (form) => {
    try {
      this.setState({ creating: true });
      const res = await axios.post('http://localhost:60932/usuarios/register', form, getHeader());

      if (res.status === 200) {
        message.success('Usuario creado con exito!');
        this.handleModal();
      }
    } catch (error) {
      let messageError = 'Hubo un error';
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error';
      }

      message.error(messageError);
    }

    this.setState({ creating: false });
  }

  onChange = (value, key) => {
    this.setState({ [key]: value });
  }

  handleSubmit = (event) => {
    if (!!event) event.preventDefault();

    const { dni, dato } = this.state;

    if (!dni && !dato) {
      return message.warning('Complete formulario para realizar la busqueda');
    } else if (dni && dato) {
      return message.warning('Busque solo por Apellido y Nombre o por DNI');
    }

    let url;

    if (!!dni) {
      url = `http://localhost:60932/usuarios/dni/${dni}`
    } else {
      url = `http://localhost:60932/usuarios/apynom/${dato}`
    }

    this.handleRequest(url);
  }

  handleRequest = async (url) => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(url, getHeader());
      let data = res.data;

      //if (!!this.state.dni) {
      //    data = [data];
      //}

      this.setState({ empleados: data });
    } catch (error) {
      let messageError = 'Hubo un error';

      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error';
      }

      message.error(messageError);
    }

    this.setState({ loading: false });
  }

  handleModal = () => {
    this.setState({
      visible: !this.state.visible,
      usuario: null
    });
  }
}

export default UsuariosView;