import React, { Component } from 'react';
import { Modal, Table, Row, Col, Divider, Tabs, Select, DatePicker, message, Button, Spin, Alert } from 'antd';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';
import moment from 'moment';

class EmpleadosModal extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      loading: false,
      loadingPeriodo: false,
      
      horas: [],
      totalHorasRec: null,
      
      form: {}
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.getHoras();
    }
  }

  render() {
    const { visible, handleModal } = this.props;
    const { loading, horas, form, loadingPeriodo, totalHorasRec } = this.state;

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
      },
      {
        title: 'Estado',
        dataIndex: 'estadoHorasTrab',
        key: 'estadoHorasTrab'
      }, {
        title: 'Fecha',
        dataIndex: 'fechaHorasTrab',
        key: 'fechaHorasTrab',
        render: fecha => {
          return moment(fecha).format('DD/MM/YYYY')
        }
      }
    ];
    
    let perfiles = {};
    let totalHorasAdeudadas = 0;

    horas.forEach(element => {
      if (!perfiles[element.idPerfil]) {
        if (element.estadoHorasTrab === 'Adeudadas') {
          totalHorasAdeudadas += element.horasTotales;
        }
        perfiles[element.idPerfil] = {
          horasTotales: element.horasTotales,
          horasEstimadas: element.horasEstimadas,
          valorHora: element.valorHora,
          descripcionPerfil: element.descripcionPerfil
        };
      }
    });
    
    let alertString = '';

    if (totalHorasRec === null) alertString = 'Complete el formulario';

    if (totalHorasRec === 0) alertString = 'No posee horas cargadas en ese período';

    if (totalHorasRec > 0) alertString = `Total horas: ${totalHorasRec}`;

    return (
      <Modal
        title='Horas trabajadas'
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
        
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Por perfil" key="1">
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 14 }}>
                <Table 
                  size='small'
                  columns={columns} 
                  pagination={{ pageSize: 5 }}
                  dataSource={horas}
                  loading={loading}
                  scroll={{ x: true }}
                  rowKey='horasEstimadas'
                  bordered
                  locale={{ emptyText: 'No hay horas' }} /> 
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 9, offset: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>Detalle por perfil: </h4>
                  <h4>Total horas adeudadas: {totalHorasAdeudadas}</h4>
                </div>
                <Divider />

                <Row>
                  {
                    Object.keys(perfiles).map((e, index) => {
                      let element = perfiles[e];
                      return (
                        <Col span={12} key={index} style={{ padding: 10 }}>
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
          </Tabs.TabPane>

          <Tabs.TabPane tab="Por período" key="2">
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <h3>Seleccionar Perfil</h3>
                <Select 
                  size='large'
                  style={{ width: '100%' }} 
                  placeholder='Seleccionar'
                  value={form.idPerfil}
                  onChange={id => this.onChange(id, 'idPerfil')}>
                    {
                      Object.keys(perfiles).map((e, index) => {
                        return (
                          <Select.Option 
                            key={index}
                            value={e}>
                            {perfiles[e].descripcionPerfil}
                          </Select.Option>
                        );
                      })
                    }
                </Select>
                
                <h3 style={{ marginTop: 10 }}>Fecha inicio</h3>
                <DatePicker 
                  size='large'
                  value={form.inicio}
                  disabledDate={this.disabledDate}
                  onChange={fecha => this.onChange(fecha, 'inicio')} />

                <h3 style={{ marginTop: 10 }}>Fecha fin</h3>
                <DatePicker 
                  size='large'
                  value={form.fin}
                  disabledDate={this.disabledDate}
                  onChange={fecha => this.onChange(fecha, 'fin')} />

                <Button 
                  type='primary'
                  style={{ marginTop: 10, width: '100%' }}
                  onClick={this.getHorasPeriodo}>
                  Buscar
                </Button>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 11, offset: 1 }}>
                <Spin spinning={loadingPeriodo}>
                  <Alert 
                    message={alertString} 
                    type='info'/>
                </Spin>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>

      </Modal>
    );
  }

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  getHoras = async () => {
    this.setState({ 
      loading: true,
      horas: [],
      totalHorasRec: null,
      form: {}
    });
    try {
      const res = await axios.get(`http://localhost:60932/horatrabajadas/porProy/${this.props.idProyecto}`, getHeader());
      this.setState({ horas: res.data.sumaPorPerfil });
    } catch (error) {}
    this.setState({ loading: false });
  }

  onChange = (value, key) => {
    this.setState({
      form: Object.assign({}, this.state.form, {
        [key]: value
      })
    });
  }

  getHorasPeriodo = async () => {
    const { form } = this.state;

    if (!form.idPerfil || !form.inicio || !form.fin) {
      return message.warn('Debe completar todo el formulario');
    }

    this.setState({ loadingPeriodo: true });
    try {
      let inicio = form.inicio.toISOString();
      let fin = form.fin.toISOString();
      const res = await axios.get(`http://localhost:60932/horatrabajadas/porfecha/${form.idPerfil}/${inicio}/${fin}`, getHeader());

      this.setState({ totalHorasRec: res.data.totalHorasRec });
    } catch (error) {}
    this.setState({ loadingPeriodo: false });
  }
}

export default EmpleadosModal;