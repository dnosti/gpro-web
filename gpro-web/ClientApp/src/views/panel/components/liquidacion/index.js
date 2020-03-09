import './index.css';
import React, { Component } from 'react';
import { Table, Button, Divider, message } from 'antd';
import { Modal } from './components';
import { getHeader } from '../../../../utils';
import axios from 'axios';

class UsuariosView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: false,
      creating: false,
      liquidaciones: []
    };
  }

  render() {
    const { visible, loading, liquidaciones } = this.state;

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
      }
    ];

    return (
      <div>
        <Button
          type='primary'
          icon='plus-circle'
          onClick={this.handleModal}>
          Crear Liquidación
        </Button>

        <Divider />

        <Table
          columns={columns}
          pagination={{ pageSize: 5 }}
          dataSource={liquidaciones}
          loading={loading}
          scroll={{ x: true }}
          rowKey='id'
          bordered
          locale={{ emptyText: "No hay liquidaciones" }} />

        <Modal
          visible={visible}
          handleModal={this.handleModal}
          crearLiquidacion={this.crearLiquidacion} />
      </div>
    );
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

  handleModal = () => {
    this.setState({
      visible: !this.state.visible
    });
  }
}

export default UsuariosView;