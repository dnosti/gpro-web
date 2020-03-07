import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';
import moment from 'moment';

class EmpleadosModal extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      loading: false,
      horas: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.getHoras();
    }
  }

  render() {
    const { visible, handleModal } = this.props;
    const { loading, horas } = this.state;

    const columns = [{
        title: 'Empleado',
        key: 'empleado',
        render: item => {
          if (!!item.nombre)
            return `${item.nombre} ${item.apellido}`;
          return '-';
        }
      }, {
          title: 'Horas trabajadas',
          dataIndex: 'horasPerfil',
          key: 'horasPerfil'
      }, {
        title: 'Valor hora',
        dataIndex: 'valorHora',
        key: 'valorHora',
        render: valor => {
          return `$${valor}`;
        }
      }, {
        title: 'Descripción',
        dataIndex: 'descripcionPerfil',
        key: 'descripcionPerfil'
      }, {
        title: 'Fecha',
        dataIndex: 'fechaHorasTrab',
        key: 'fechaHorasTrab',
        render: fecha => {
          return moment(fecha).format('DD/MM/YYYY hh:mm')
        }
      }
    ];

    return (
      <Modal
        title='Horas over budget'
        visible={visible}
        okText='Cerrar'
        onOk={handleModal}
        okButtonProps={{ 
          disabled: loading,
          loading: loading
        }}
        onCancel={handleModal}
        cancelButtonProps={{ 
          style: { display: 'none' }
        }}
        width='95%'>
        
        <Table 
          size='small'
          columns={columns} 
          pagination={{ pageSize: 5 }}
          dataSource={horas}
          loading={loading}
          scroll={{ x: true }}
          rowKey='fechaHorasTrab'
          bordered
          locale={{ emptyText: 'No hay horas' }} /> 

      </Modal>
    );
  }

  getHoras = async () => {
    const { idProyecto } = this.props;

    if (!idProyecto) {
      return message.warn('No se encontro el proyecto');
    }

    this.setState({ loading: true });
    try {
      let inicio = moment(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
      let fin = moment().toISOString();
      const res = await axios.get(`http://localhost:60932/horatrabajadas/overbudget/${idProyecto}/${inicio}/${fin}`, getHeader());

      this.setState({ horas: res.data.sumaPorPerfil });
    } catch (error) {}
    this.setState({ loading: false });
  }
}

export default EmpleadosModal;