import React, { Component } from 'react';
import { Modal, Table, Row, Col, Divider } from 'antd';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';
import moment from 'moment';

class EmpleadosModal extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      loading: false,
      horas: []
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
    
    let perfiles = {};

    horas.forEach(element => {
      if (!perfiles[element.idPerfil]) {
        perfiles[element.idPerfil] = {
          horasTotales: element.horasTotales,
          horasEstimadas: element.horasEstimadas,
          valorHora: element.valorHora,
          descripcionPerfil: element.descripcionPerfil
        };
      }
    });

    return (
      <Modal
        title='Horas trabajadas por perfil'
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
        
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 14 }}>
            <Table 
              columns={columns} 
              pagination={{ pageSize: 5 }}
              dataSource={horas}
              loading={loading}
              scroll={{ x: true }}
              rowKey='fechaHorasTrab'
              bordered
              locale={{ emptyText: 'No hay horas' }} /> 
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 9, offset: 1 }}>
            <h3>Detalles: </h3>
            <Divider />

            <Row>
              {
                Object.keys(perfiles).map((e, index) => {
                  let element = perfiles[e];
                  return (
                    <Col xs={{ span: 24 }} lg={{ span: 12 }} key={index} style={{ padding: 10 }}>
                      <h4>Perfil: {element.descripcionPerfil}</h4>
                      <b>Horas estimadas: {element.horasEstimadas}</b><br/>
                      <b>Horas acumuladas: {element.horasTotales}</b><br/>
                      <b>Horas restantes: {element.horasEstimadas - element.horasTotales}</b><br/>
                      <b>Valor: ${element.valorHora}</b><br/>
                    </Col>
                  );
                })
              }
            </Row>
            
          </Col>
        </Row>

      </Modal>
    );
  }

  getHoras = async () => {
    this.setState({ loading: true });
    try {
      const res = await axios.get(`http://localhost:60932/horatrabajadas/byproy/${this.props.idProyecto}`, getHeader());
      this.setState({ horas: res.data.sumaPorPerfil });
    } catch (error) {}
    this.setState({ loading: false });
  }
}

export default EmpleadosModal;