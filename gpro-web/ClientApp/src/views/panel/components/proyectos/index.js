import './index.css';
import React, { Component } from 'react';
import { Table, Button, message, Divider } from 'antd';
import { Modal, ModalHoras, ModalOverBudget } from './components';
import { getHeader } from '../../../../utils';
import axios from 'axios';

class ProyectosView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      visibleHoras: false,
      visibleOverBudget: false,
      idProyecto: null,
      loading: false,
      creating: false,
      proyectos: [],
      proyecto: null
    };
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser.idRol === 1) return this.props.history.push('/clientesView');
    if (currentUser.idRol === 3) return this.props.history.push('/panelEmpleado');

    this.getProyectos();
  }

  render() {
    const { visible, loading, proyectos, creating, visibleHoras, visibleOverBudget, idProyecto, proyecto } = this.state;

    const columns = [{
          title: 'Título',
          dataIndex: 'tituloProyecto',
          key: 'titulo'
      },
      {
        title: 'Descripción',
        dataIndex: 'descripcionProyecto',
        key: 'descripcion'
      },
      {
        title: 'Estado',
        dataIndex: 'estadoProyecto',
        key: 'estadoProyecto'
      },
      {
        title: 'Horas Trabajadas',
        key: 'info',
        render: item => {
          return (
            <Button onClick={() => this.proyectInfo(item)}>
              Ver
            </Button>
          );
        }
      },
      {
        title: 'Horas Over Budget',
        key: 'overbudget',
        render: item => {
          return (
            <Button onClick={() => this.horasOverBudget(item)}>
              Informe semanal
            </Button>
          );
        }
      },
      {
        title: 'Editar',
        key: 'editar',
        render: item => {
          return (
            <Button 
              type='primary'
              onClick={() => this.editar(item)}>
              Editar
            </Button>
          );
        }
      }
    ];

    return(
      <div className='proyectos'>
        <Button 
          type='primary'
          icon='plus-circle'
          onClick={this.handleModal}>
          Crear Proyecto
        </Button>

        <Divider />
        
        <Table 
          columns={columns} 
          pagination={{ pageSize: 5 }}
          dataSource={proyectos}
          loading={loading}
          scroll={{ x: true }}
          rowKey='idProyecto'
          bordered
          locale={{ emptyText: "No hay proyectos" }} />

        <Modal 
          visible={visible}
          proyecto={proyecto}
          handleModal={this.handleModal}
          creating={creating}
          crearProyecto={this.crearProyecto} 
          editarProyecto={this.editarProyecto} />

        <ModalHoras
          visible={visibleHoras}
          idProyecto={idProyecto}
          handleModal={this.closeModal} />

        <ModalOverBudget
          visible={visibleOverBudget}
          idProyecto={idProyecto}
          handleModal={() => this.setState({ visibleOverBudget: false, idProyecto: null })} />
      </div>
    );
  }

  editar = (proyecto) => {
    this.setState({
      visible: true,
      proyecto
    });
  }

  getProyectos = async () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    try {
      this.setState({ loading: true });
      const res = await axios.get(`http://localhost:60932/proyectos/${user.idEmpleado}`, getHeader());
  
      this.setState({ proyectos: res.data });
    } catch (error) {
      let messageError = 'Hubo un error';
    
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error';
      }

      message.error(messageError);
    }

    this.setState({ loading: false });
  }

  handleModal = () => {
    this.setState({ 
      visible: !this.state.visible,
      proyecto: null
    });
  }

  proyectInfo = (proyecto) => {
    this.setState({
      idProyecto: proyecto.idProyecto,
      visibleHoras: true
    });
  }

  closeModal = () => {
    this.setState({ 
      idProyecto: null, 
      visibleHoras: false 
    });
  }

  crearProyecto = async (form) => {
    const { clienteId, tituloProyecto, descripcionProyecto, estadoProyecto } = form;

    if (!clienteId || !tituloProyecto || !descripcionProyecto || !estadoProyecto) {
      return message.error('Debe completar todos los datos');
    }

    try {
      this.setState({ creating: true });
      const res = await axios.post('http://localhost:60932/proyectos/',
        {
          ...form,
          idEmpleadoPm: JSON.parse(localStorage.getItem('currentUser')).idEmpleado
        },
        getHeader());
      
      if (res.data) {
        message.success('Poyecto creado con exito');
        this.handleModal();
        this.getProyectos();
      }
    } catch (error) {
      console.log('error creando: ', error)
    }
    this.setState({ creating: false });
  }

  editarProyecto = async (form) => {
    const { clienteId, tituloProyecto, descripcionProyecto, estadoProyecto, idProyecto } = form;

    if (!clienteId || !tituloProyecto || !descripcionProyecto || !estadoProyecto) {
      return message.error('Debe completar todos los datos');
    }

    try {
      this.setState({ creating: true });
      await axios.put(`http://localhost:60932/proyectos/${idProyecto}`,
        {
          ...form,
          idEmpleadoPm: JSON.parse(localStorage.getItem('currentUser')).idEmpleado
        },
        getHeader());
      
      message.success('Proyecto editado con exito');
      this.setState({ proyecto: null });
      this.handleModal();
      this.getProyectos();

    } catch (error) {
      console.log('error editando: ', error)
    }
    this.setState({ creating: false });
  }

  horasOverBudget = async (item) => {
    this.setState({
      idProyecto: item.idProyecto,
      visibleOverBudget: true
    });
  }
}

export default ProyectosView;