import './index.css';
import React, { Component } from 'react';
import { Table, message, Divider } from 'antd';
import { getHeader } from '../../../../../utils';
import axios from 'axios';

class MisProyectosView extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      proyectos: []
    };
  }

  componentDidMount() {
    this.getProyectos();
  }

  render() {
    const { loading, proyectos } = this.state;

    const columns = [{
        title: 'ID',
        dataIndex: 'idProyecto',
        key: 'idProyecto'
      }, {
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
      }
    ];

    return(
      <div>
        <h3>Mis Proyectos</h3>

        <Divider />

        <Table
         columns={columns}
         dataSource={proyectos}
         loading={loading}
         scroll={{ x: true }}
         rowKey='idProyecto'
         bordered
         locale={{ emptyText: 'No hay proyectos' }}/>
      </div>
    );
  }

  getProyectos = async () => {
    try {
      this.setState({loading: true})

      var currentUser = localStorage.getItem('currentUser');
      var userInfo = JSON.parse(currentUser);
      var idEmpleado = userInfo.idEmpleado;

      const res = await axios.get(`http://localhost:60932/empleado/proyectos/${idEmpleado}`, getHeader());

      this.setState({ proyectos: res.data })

    } catch (error) {
      let messageError = 'Hubo un error';
    
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error';
      }

      message.error(messageError);
    }

    this.setState({ loading: false });
  }

}

export default MisProyectosView;