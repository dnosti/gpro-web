import './index.css';
import React, { Component } from 'react';
import { Table, message, Divider, Row, Col, Button } from 'antd';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import { Modal } from './components';

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
    const { loading, proyectos, tareas, loadingTareas, visible, tarea } = this.state;

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
        title: 'Tareas',
        key: 'tareas',
        render: item => {
          return (
            <Button onClick={() => this.getTareas(item)}>
              Ver mis tareas
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
            <Button onClick={() => this.agregarHoras(item)}>
              Agregar
            </Button>
          );
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
          <h3>Mis Tareas por Proyecto</h3>

          <Divider />

          <Table
            size='small'
            columns={columnsTareas}
            dataSource={tareas}
            loading={loadingTareas}
            scroll={{ x: true }}
            rowKey='idTarea'
            bordered
            locale={{ emptyText: 'No hay tareas' }}/>
        </Col>

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
}

export default PanelEmpleado;