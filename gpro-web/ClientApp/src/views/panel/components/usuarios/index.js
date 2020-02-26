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

      editando: false,
      usuario: null
    };
  }

  render() {
    const { visible, loading, empleados, dni, apellidoEmpleado, nombreEmpleado, editando, usuario } = this.state;

    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',

      },
      {
        title: 'DNI',
        dataIndex: 'dni',
        key: 'dni',
      },
      {
        title: 'Nombre y Apellido',
        key: 'fullname',
        sorter: (a, b) => {
            return a.nombreEmpleado - b.nombreEmpleado;
        },
        render: item => {
            return `${item.nombreEmpleado} ${item.apellidoEmpleado}`
        }
      },
      {
        title: 'Usuario',
        dataIndex: 'username',
        key: 'username',

      },
      {
        title: 'Id Empl.',
        dataIndex: 'idEmpleado',
        key: 'idEmpleado',
      },
      {
        title: 'Rol',
        dataIndex: 'idRol',
        key: 'idRol',
        render: data => {
          if (data === 1) return 'Admin'
          if (data === 2) return 'PM'
          if (data === 3) return 'Member'
          return data;
        }
      },
      {
        title: 'Editar',
        key: 'editar',
        render: item => {
          return (
            <Button
              onClick={() => this.handleEditar(item)}>
              Editar
            </Button>
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

        <Form
          onSubmit={this.handleSubmit}
          className='login-form'>

          <Row type='flex'>
            <Col xs={{ span: 24 }} lg={{ span: 7 }}>
              <FormItem
                key='apellidoEmpleado'
                label='Apellido:'
                name='apellidoEmpleado'
                placeholder='Ingrese'
                value={apellidoEmpleado}
                error={null}
                onChange={this.onChange} />
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 7, offset: 1 }}>
              <FormItem
                key='nombreEmpleado'
                label='Nombre:'
                name='nombreEmpleado'
                placeholder='Ingrese'
                value={nombreEmpleado}
                error={null}
                onChange={this.onChange} />
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 8, offset: 1 }}>
              <FormItem
                key='dni'
                name='dni'
                label='DNI'
                placeholder='Ingrese'
                value={dni}
                error={null}
                onChange={this.onChange} />
            </Col>
          </Row>

          <div className='empleados-buttons'>
            <Button
              type='primary'
              icon='search'
              htmlType='submit'>
              Buscar
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => this.setState({ dni: '', apellidoEmpleado: '', nombreEmpleado })}>
              Limpiar
            </Button>
          </div>
        </Form>

        <Table
          columns={columns}
          pagination={{ pageSize: 5 }}
          dataSource={empleados}
          loading={loading}
          scroll={{ x: true }}
          rowKey='id'
          bordered
          locale={{ emptyText: "No hay usuarios" }} />

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
      if (res.status == 200) {
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

  crearUsuario = async (form) => {
    try {
      this.setState({ creating: true });
      const res = await axios.post('http://localhost:60932/usuarios/register', form, getHeader());

      if (res.status == 200) {
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

    const { dni, apellidoEmpleado, nombreEmpleado } = this.state;

    if (!dni && !apellidoEmpleado) {
      return message.warning('Complete formulario para realizar la busqueda');
    } else if ((dni && apellidoEmpleado) || (dni && nombreEmpleado)) {
      return message.warning('Busque solo por Apellido y Nombre o por DNI');
    } else if (!dni && (!apellidoEmpleado || !nombreEmpleado)) {
      return message.warning('Complete formulario para realizar la busqueda');
    }

    let url;

    if (!!dni) {
      url = `http://localhost:60932/usuarios/dni/${dni}`
    } else {
      url = `http://localhost:60932/usuarios/apynom/${apellidoEmpleado}/${nombreEmpleado}`
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