import './index.css';
import React, { Component } from 'react';
import { Table, Button, Divider, message, Col, Row } from 'antd';
import { Modal } from './components';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import moment from 'moment';
import { PDFExport } from '@progress/kendo-react-pdf';

class UsuariosView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: false,
      creating: false,
      liquidaciones: [],

      liquidacion: {}
    };
  }

  componentDidMount() {
    this.getLiquidaciones();
  }

  render() {
    const { visible, loading, liquidaciones, liquidacion } = this.state;

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
        title: 'Cantidad Horas',
        dataIndex: 'cantHorasTrab',
        key: 'cantHorasTrab'
      }, {
        title: 'Importe',
        dataIndex: 'importe',
        key: 'importe',
        render: item => '$'+item
      }, {
        title: 'PDF',
        key: 'pdf',
        render: item => <Button icon='file-pdf' onClick={() => this.generarInforme(item)}>
          Generar Informe
        </Button>
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

        <div style={{ position: 'absolute', left: '-1000px', top: 0 }}>
          <PDFExport 
            ref={(component) => this.pdfExportComponent = component} 
            paperSize='A4'
            fileName='liquidacion.pdf'>
            
            <div style={styles.pdfHeader}>
              <Row style={{ height: 75 }}>
                <Col span={10} >
                  <div style={styles.imgDiv}>
                    <img style={styles.img} src={require('../../../../assets/logo-gpro-navbar.png')} alt='Bitsign'/>
                  </div>
                </Col>
                <Col span={14} style={{
                  paddingTop: 30,
                  height: 75 }}>
                  <h3 style={{ color: '#fff' }}>INFORME DE LIQUIDACION</h3>
                </Col>
              </Row>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div><b style={{ color: '#fff' }}>Desde: {moment(liquidacion.fechaDesde).format('DD/MM/YYYY')}</b></div>
                <div><b style={{ color: '#fff' }}>Hasta: {moment(liquidacion.fechaHasta).format('DD/MM/YYYY')}</b></div>
              </div>
            </div>

            <div style={styles.pdfBody}>
              <div>Empleado: {liquidacion.nombreEmpleado} {liquidacion.apellidoEmpleado}</div>
              <div>Cantidad de horas: {liquidacion.cantHorasTrab}</div>
              <div>Horas overbudget: {liquidacion.horasOverBudget}</div>
              <div>Porcentaje por escala horas: {liquidacion.porcentajeHoras}%</div>
              <div>Cantidad de perfiles: {liquidacion.cantPerfiles}</div>
              <div>Porcentaje por perfiles: {liquidacion.porcentajePerfil}%</div>
              <div>Porcentaje por antiguedad: {liquidacion.porcentaje}%</div>
              <div style={{ float: 'right', marginTop: 10, color: '#000' }}>Importe total: ${liquidacion.importe}</div>
            </div>

            <div style={styles.pdfFooter}>
              GPRO. Lisandro Caceres, Mariano Durand Mansilla, Dardo Nosti, Juan Manuel Villarrazza. Licensed under the MIT license
            </div>
          </PDFExport>
        </div>

      </div>
    );
  }

  generarInforme = (item) => {
    this.setState({
      liquidacion: item
    }, () => {
      setTimeout(
        this.exportPDFWithComponent(),
        500
      );
    });
  }

  exportPDFWithComponent = () => {
    this.pdfExportComponent.save();
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
    marginRight: 30,
    height: 600
  },
  pdfFooter: {
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
    borderTop: '1px solid #888',
    display: 'flex',
    justifyContent: 'center'
  }
}

export default UsuariosView;