import './index.css';
import React, { Component } from 'react';
import { Table, message, Divider, Row, Col, Button, Modal as ModalAnt } from 'antd';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import { Modal } from './components';
import moment from 'moment';

class PanelEmpleado extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      loadingTareas: false,
      proyectos: [],
      tareas: [],

      visible: false,
      tarea: null
    };
  }

  componentDidMount() {
    this.getProyectos();
  }

  render() {
    const { 
      loading, proyectos, 
      tareas, loadingTareas, 
      visible, tarea, 
      horas, visibleHoras, loadingHoras } = this.state;

    const columns = [{
        title: 'Título',
        dataIndex: 'tituloProyecto',
        key: 'titulo'
      }, {
        title: 'Descripción',
        dataIndex: 'descripcionProyecto',
        key: 'descripcion'
      }, {
        title: 'Estado',
        dataIndex: 'estadoProyecto',
        key: 'estado'
      }, {
        title: 'Perfil en proyecto',
        dataIndex: 'descripcionPerfil',
        key: 'descripcionPerfil'
      }, {
        title: 'Tarea',
        key: 'tareas',
        render: item => {
          return (
            <Button onClick={() => this.getTareas(item)}>
              Ver tarea
            </Button>
          );
        }
      }
    ];

    const columnsTareas = [{
        title: 'Descripción',
        dataIndex: 'descripcionTarea',
        key: 'descripcionTarea'
      }, {
        title: 'Horas estimadas',
        dataIndex: 'horasEstimadasTarea',
        key: 'horasEstimadasTarea'
      }, {
        title: 'Horas Trabajadas',
        key: 'info',
        render: item => {
          return (
            <div>
              <Button onClick={() => this.agregarHoras(item)}>
                Agregar
              </Button>
              <Button 
                type='primary'
                style={{ marginLeft: 4 }}
                onClick={() => this.verHoras(item)}>
                Ver
              </Button>
            </div>
          );
        }
      }
    ];

    const columnsHoras = [{
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

    return(
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 13 }} style={{ paddingRight: 10 }}>
          <h3>Mis Proyectos</h3>

          <Divider />

          <Table
            size='small'
            columns={columns}
            dataSource={proyectos}
            loading={loading}
            scroll={{ x: true }}
            rowKey='idProyecto'
            bordered
            locale={{ emptyText: 'No hay proyectos' }}/>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 11 }} style={{ paddingLeft: 10 }}>
          <h3>Tarea por Proyecto</h3>

          <Divider />

          <Table
            size='small'
            columns={columnsTareas}
            dataSource={tareas}
            loading={loadingTareas}
            scroll={{ x: true }}
            rowKey='idTarea'
            bordered
            locale={{ emptyText: 'No hay tarea' }}/>
        </Col>

        <ModalAnt
          title='Horas trabajadas'
          visible={visibleHoras}
          okText='Cerrar'
          onOk={() => this.setState({ visibleHoras: !visibleHoras })}
          okButtonProps={{ 
            disabled: loading,
            loading: loading
          }}
          onCancel={() => this.setState({ visibleHoras: !visibleHoras })}
          cancelButtonProps={{ 
            style: { display: 'none' }
          }}
          width='95%'>
          
          <Table 
            size='small'
            columns={columnsHoras} 
            pagination={{ pageSize: 5 }}
            dataSource={horas}
            loading={loadingHoras}
            scroll={{ x: true }}
            rowKey='fechaHorasTrab'
            bordered
            locale={{ emptyText: 'No hay horas' }} /> 

        </ModalAnt>

        <Modal
          visible={visible}
          handleModal={this.handleModal}
          tarea={tarea} />
      </Row>
    );
  }

  getProyectos = async () => {
    try {
      this.setState({loading: true});

      var currentUser = localStorage.getItem('currentUser');
      var userInfo = JSON.parse(currentUser);
      var idEmpleado = userInfo.idEmpleado;

      const res = await axios.get(`http://localhost:60932/empleado/proyectos/${idEmpleado}`, getHeader());

      this.setState({ proyectos: res.data });

    } catch (error) {
      let messageError = 'Hubo un error cargando los proyectos';
    
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error cargando los proyectos';
      }

      message.error(messageError);
    }

    this.setState({ loading: false });
  }

  getTareas = async (item) => {
    const { idEmpleado, idProyecto } = item;
    try {
      this.setState({ loadingTareas: true });

      const res = await axios.get(`http://localhost:60932/empleado/tareas/${idEmpleado}/${idProyecto}`, getHeader());

      this.setState({ tareas: res.data });

    } catch (error) {
      let messageError = 'Hubo un error cargando las tareas';
    
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error cargando las tareas';
      }

      message.error(messageError);
    }

    this.setState({ loadingTareas: false });
  }

  agregarHoras = (item) => {
    this.setState({
      visible: true,
      tarea: item
    });
  }

  handleModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  verHoras = async (item) => {
    this.setState({ visibleHoras: true });
    
    try {
      this.setState({ loadingHoras: true });

      const res = await axios.get(`http://localhost:60932/horatrabajadas/empleado/
        ${item.perfilEmpleadoIdPerfil}/${item.proyectoIdProyecto}`, 
        getHeader());

      this.setState({ horas: res.data.sumaPorPerfil });

    } catch (error) {
      let messageError = 'Hubo un error cargando las horas';
    
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error cargando las horas';
      }

      message.error(messageError);
    }

    this.setState({ loadingHoras: false });
  }
}

export default PanelEmpleado;