import './index.css';
import React, { Component } from 'react';
import { Table, Button, Divider, message } from 'antd';
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
            fileName='liquidacion.pdf'
            allPages={true}>
            
            <div style={styles.pdfHeader}>
              <h3>Informe de Liquidación</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div><b>Desde: {moment(liquidacion.fechaDesde).format('DD/MM/YYYY')}</b></div>
                <div><b>Hasta: {moment(liquidacion.fechaHasta).format('DD/MM/YYYY')}</b></div>
              </div>
            </div>

            <div style={styles.pdfBody}>
              <div>Empleado: {liquidacion.nombreEmpleado} {liquidacion.apellidoEmpleado}</div>
              <div>Cantidad de horas: {liquidacion.cantHorasTrab}</div>
              <div>Horas overbudget: {liquidacion.horasOverBudget}</div>
              <div>Porcentaje por escala horas: {liquidacion.porcentajeHoras}%</div>
              <div>Cantidad de perfiles: {liquidacion.cantPerfiles}</div>
              <div>Porcentaje por perfiles: {liquidacion.porcentajePerfil}%</div>
              <div>Porcentaje por antiguedad: {liquidacion.porcentaje}</div>
              <div>Importe total: {liquidacion.importe}</div>
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
    position: 'absolute', 
    top: '20px', 
    left: '30px',
    right: '30px',
    borderBottom: '1px solid #888',
    color: '#888'
  },
  pdfBody: {
    marginTop: '100px',
    marginLeft: '30px',
    marginRight: '30px'
  }
}

export default UsuariosView;