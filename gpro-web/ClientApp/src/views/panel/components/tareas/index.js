import './index.css';
import React, { Component } from 'react';
import { Button, message, Divider, Table } from 'antd';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import { Modal } from './components';

class TareasComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      tareas: [],

      proyectos: [],
      perfiles: [],
      empleados: [],

      loading: false,
      visible: false,
      tarea: null
    };
  }

  componentDidMount() {
    this.getTareas();
    this.getProyectos();
    this.getEmpleados();
    this.getPerfiles();
  }

  render() {
    const { proyectos, perfiles, empleados, visible, loading, tarea, fetching, tareas } = this.state;

    const columns = [{
        title: 'Título del Proyecto',
        dataIndex: 'tituloProyecto',
        key: 'tituloProyecto',
      },{
        title: 'Nombre y Apellido del empleado',
        key: 'empleado',
        render: item => {
          return item.nombreEmpleado + ' ' + item.apellidoEmpleado;
        }
      },{
        title: 'Descripción',
        dataIndex: 'descripcionTarea',
        key: 'descripcionTarea',
      },{
        title: 'Horas estimadas',
        dataIndex: 'horasEstimadasTarea',
        key: 'horasEstimadasTarea',
      }, {
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
      <div className='tareas'> 
        <Button
          type='primary'
          icon='plus-circle'
          onClick={this.handleModal}>
          Crear Tarea
        </Button>

        <Divider />

        <Table
          columns={columns} 
          pagination={{ pageSize: 5 }}
          dataSource={tareas}
          loading={fetching}
          scroll={{ x: true }}
          rowKey='idTarea'
          bordered
          locale={{ emptyText: "No hay tareas" }} />

        <Modal 
          proyectos={proyectos}
          perfiles={perfiles}
          empleados={empleados}
          visible={visible}
          loading={loading}
          tarea={tarea}
          handleModal={this.handleModal}
          crearTarea={this.crearTarea}
          editarTarea={this.editarTarea} />

      </div>
    );
  }

  reset = () => {
    this.setState({
      proyectoIdProyecto: '',
      perfilEmpleadoIdEmpleado: '',
      perfilEmpleadoIdPerfil: '',
      descripcionTarea: '',
      horasEstimadasTarea: '',
      errors: {}
    });
  }

  handleEditar = (tarea) => {
    this.setState({
      visible: true,
      tarea
    });
  }

  crearTarea = async (form) => {
    try {
      this.setState({ loading: true });

      const res = await axios.post('http://localhost:60932/tarea/', form, getHeader());

      if (!!res.data) {
        message.success('Tarea generada con exito');
        this.handleModal();
        this.getTareas();
      }

    } catch (error) {
      let messageError = 'Hubo un error';
      if (error.response) {
        messageError = error.response.data.message;
      }

      message.error(messageError);
    }

    this.setState({ loading: false });
  }

  editarTarea = async (form) => {
    try {
      this.setState({ loading: true });

      const res = await axios.put('http://localhost:60932/tarea/', form, getHeader());

      if (!!res.data) {
        message.success('Tarea editada con exito');
        this.handleModal();
        this.getTareas();
      }

    } catch (error) {
      let messageError = 'Hubo un error';
      if (error.response) {
        messageError = error.response.data.message;
      }

      message.error(messageError);
    }

    this.setState({ loading: false });
  }

  handleModal = () => {
    this.setState({
      visible: !this.state.visible,
      tarea: null
    });
  }

  getTareas = async () => {
    try {
      this.setState({ fetching: true });
      const res = await axios.get('http://localhost:60932/tarea/', getHeader());
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.setState({ tareas: res.data.filter(t => t.idEmpleadoPm === currentUser.idEmpleado) });
    } catch (error) {}
    
    this.setState({ fetching: false });
  }

  getProyectos = async () => {
    try {
      const res = await axios.get('http://localhost:60932/proyectos/', getHeader());
      this.setState({ proyectos: res.data });
    } catch (error) {}
  }

  getEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:60932/empleado/', getHeader());
      this.setState({ empleados: res.data });
    } catch (error) {}
  }

  getPerfiles = async () => {
    try {
      const res = await axios.get('http://localhost:60932/perfiles/', getHeader());
      this.setState({ perfiles: res.data });
    } catch (error) {}
  }

}

export default TareasComponent;