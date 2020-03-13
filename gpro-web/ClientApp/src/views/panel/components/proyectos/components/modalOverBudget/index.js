import React, { Component } from 'react';
import { Modal, Table, message, Button, Divider, Row, Col } from 'antd';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';
import moment from 'moment';
import { PDFExport } from '@progress/kendo-react-pdf';

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
          key: 'horasPerfil',
          render: item => item - 8
      }, {
        title: 'Valor hora',
        dataIndex: 'valorHora',
        key: 'valorHora',
        render: valor => {
          return `$${valor} + ${valor / 2} (50%)`;
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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div><b>Desde: {moment(Date.now() - 7 * 24 * 3600 * 1000).format('DD/MM/YYYY')}</b></div>
          <div><b>Hasta: {moment().format('DD/MM/YYYY')}</b></div>
        </div>

        <Button 
          type='primary'
          icon='file-pdf'
          style={{ marginBottom: 10 }}
          onClick={this.exportPDFWithComponent}>
          Generar PDF
        </Button>
        
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
                
        <div style={{ position: 'absolute', left: '-1000px', top: 0 }}>
          <PDFExport 
            ref={(component) => this.pdfExportComponent = component} 
            paperSize='A4'
            fileName='overbudget.pdf'
            allPages={true}>
            
            
            <div style={styles.pdfHeader}>
              <Row style={{ height: 75 }}>
                <Col span={10} >
                  <div style={styles.imgDiv}>
                    <img style={styles.img} src={require('../../../../../../assets/logo-gpro-navbar.png')} alt='Bitsign'/>
                  </div>
                </Col>
                <Col span={14} style={{
                  paddingTop: 30,
                  height: 75 }}>
                  <h3 style={{ color: '#fff' }}>INFORME HORAS OVERBUDGET</h3>
                </Col>
              </Row>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div><b  style={{ color: '#fff' }}>Desde: {moment(Date.now() - 7 * 24 * 3600 * 1000).format('DD/MM/YYYY')}</b></div>
                <div><b  style={{ color: '#fff' }}>Hasta: {moment().format('DD/MM/YYYY')}</b></div>
              </div>
            </div>

            <div style={styles.pdfBody}>
              {
                horas.map((item, index) => {
                  return (
                    <div key={index}>
                      <div> Empleado: {`${item.nombre} ${item.apellido}`}</div>
                      <div> Cantidad de Horas: {item.horasPerfil - 8}</div>
                      <div> Valor: ${item.valorHora} + {item.valorHora / 2} (50%)</div>
                      <div> Descripcion: {item.descripcionPerfil}</div>
                      <div> Estado: {item.estadoHorasTrab}</div>
                      <div> Fecha: {moment(item.fechaHorasTrab).format('DD/MM/YYYY')}</div>

                      <Divider />
                    </div>
                  )
                })
              }
            </div>

          </PDFExport>
        </div>

      </Modal>
    );

    
  }

  exportPDFWithComponent = () => {
    this.pdfExportComponent.save();
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

  exportPDF = () => {
    this.pdfExportComponent.save();
  }
}

const styles = {
  pdfHeader: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottom: '1px solid #888',
    color: '#888',
    backgroundColor: '#0741AD'
  },
  imgDiv: {

  },
  img: {
    width: 150
  },
  pdfBody: {
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30
  }
}

export default EmpleadosModal;