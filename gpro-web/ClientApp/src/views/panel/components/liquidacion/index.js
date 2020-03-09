import './index.css';
import React, { Component } from 'react';
import { Table, Button, Divider, message } from 'antd';
import { Modal } from './components';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import moment from 'moment';

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

  componentDidMount() {
    this.getLiquidaciones();
  }

  render() {
    const { visible, loading, liquidaciones } = this.state;

    const columns = [{
        title: 'Empleado',
        key: 'empleado',
        render: item => item.nombreEmpleado + ' ' + item.apellidoEmpleado
      }, {
        title: 'Desde',
        dataIndex: 'fechaDesde',
        key: 'fechaDesde',
        render: item => moment(item).format('DD/MM/YYYY')
      }, {
        title: 'Hasta',
        dataIndex: 'fechaHasta',
        key: 'fechaHasta',
        render: item => moment(item).format('DD/MM/YYYY')
      }, {
        title: 'Importe',
        dataIndex: 'importe',
        key: 'importe',
        render: item => '$'+item
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

  crearLiquidacion = async (form) => {
    try {
      this.setState({ creating: true });
      const res = await axios.post('http://localhost:60932/liquidacion', form, getHeader());

      if (res.status === 200) {
        message.success('Liquidacion creada con exito!');
        this.handleModal();
        this.getLiquidaciones();
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

  getLiquidaciones = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get('http://localhost:60932/liquidacion/', getHeader());
      this.setState({ liquidaciones: res.data });
    } catch (error) {}

    this.setState({ loading: false });
  }
}

export default UsuariosView;