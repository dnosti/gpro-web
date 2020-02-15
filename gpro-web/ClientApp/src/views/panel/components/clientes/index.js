import './index.css';
import React, { Component } from 'react';
import { Row, Col, Table, Button, Form, Divider, message } from 'antd';
import { Modal } from './components';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import { FormItem } from '../../../../globalComponents';

class ClientesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: false,
      creating: false,
      dato: '',
      cuit: '',
      clientes: [],

      editando: false,
      cliente: null
    };
  }

  render() {
    const { visible, loading, clientes, dato, cuit, editando, cliente } = this.state;
    const columns = [
      {
        title: 'CUIT',
        dataIndex: 'idCliente',
        key: 'idCliente',
        sorter: (a, b) => {
          return a.idCliente - b.idCliente;
        },
      },
      {
        title: 'R. Social',
        dataIndex: 'razonSocialCliente',
        key: 'razonSocialCliente'
      },
      {
        title: 'Nombre y Apellido',
        key: 'fullname',
        sorter: (a, b) => {
          return a.nombreCliente - b.nombreCliente;
        },
        render: item => {
          return `${item.nombreCliente} ${item.apellidoCliente}`
        }
      },
      {
        title: 'Dirección',
        dataIndex: 'direccionCliente',
        key: 'direccionCliente',
      },
      {
        title: 'E-Mail',
        dataIndex: 'emailCliente',
        key: 'emailCliente',
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
          icon='safety-certificate'
          style={{ marginBottom: '20px' }}
          onClick={this.handleModal}>
          Crear cliente
        </Button>

        <Form
          onSubmit={this.handleSubmit}
          className='login-form'>
            
          <Row type='flex'>
            <Col span={12}>
              <FormItem 
                key='dato'
                label='Nombre/Apellido/Razón social:'
                name='dato'
                placeholder='Ingrese'
                value={dato}
                error={null}
                onChange={this.onChange}/>
            </Col>

            <Col span={11} offset={1}>
              <FormItem 
                key='cuit'
                name='cuit'
                label='cuit'
                placeholder='Ingrese'
                value={cuit}
                error={null}
                onChange={this.onChange}/>
            </Col>
          </Row>

          <div className='clientes-buttons'>
            <Button 
              type='primary' 
              icon='search'
              htmlType='submit'>
              Buscar
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => this.setState({ cuit: '', dato: '' })}>
              Limpiar
            </Button>
          </div>
        </Form>

        <Divider dashed />

        <Table 
          columns={columns} 
          pagination={{ pageSize: 5 }}
          dataSource={clientes}
          loading={loading}
          scroll={{ x: true }}
          rowKey='idCliente'
          bordered
          locale={{ emptyText: "No hay clientes" }} />

        <Modal 
          visible={visible}
          handleModal={this.handleModal}
          crearCliente={this.crearCliente}
          editando={editando}
          cliente={cliente}
          editarCliente={this.editarCliente} />
      </div>
    );
  }

  editarCliente = async (form) => {

    try {
      this.setState({ editando: true });
      const res = await axios.put('http://localhost:60932/cliente/update', form, getHeader());

      if (res.data) {
        message.success('Cliente actualizado con éxito!');
        this.handleModal();
      }
    } catch (error) {
      let messageError = 'Hubo un error al editar el cliente';

      if (!!error.response && !!error.response.data) {
        messageError = error.response.data.message;
      }

      message.error(messageError);
    }

    this.setState({ editando: false });
  }

  handleEditar = (cliente) => {
    this.setState({
      visible: true,
      cliente: cliente
    });
  }

  crearCliente = async (form) => {
    try {
      this.setState({ creating: true });
      const res = await axios.post('http://localhost:60932/cliente/new', form, getHeader());
      console.log('crear cliente');
      

      if (res.data) {
        message.success('Cliente creado con exito!');
        this.handleModal();
      }
    } catch (error) {
      let messageError = 'Hubo un error al crear el cliente';
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
    event.preventDefault();
    const { cuit, dato } = this.state;

    if (!cuit && !dato) {
      return message.warning('Complete formulario para realizar la busqueda');
    }

    let url;

    if (!!cuit) {
      url = `http://localhost:60932/cliente/cuit/${cuit}`
    } else {
      url = `http://localhost:60932/cliente/dato/${dato}`
    }

    this.handleRequest(url);
  }

  handleRequest = async (url) => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(url, getHeader());
      let data = res.data;

      if (!!this.state.cuit) {
        data = [data];
      }

      this.setState({ clientes: data });
    } catch (error) {
      let messageError = 'Hubo un error';

      if (error.response.data.message) {
        messageError = error.response.data.message;
      }

      if (error.response.status === 404) {
        messageError = 'No se encontro el cliente';
      }

      message.error(messageError);
    }
    this.setState({ loading: false });
  }

  handleModal = () => {
    this.setState({ visible: !this.state.visible });
  }
}

export default ClientesView;