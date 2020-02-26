import './index.css';
import React, { Component } from 'react';
import { Table, message, Divider } from 'antd';
import { getHeader } from '../../../../../utils';
import axios from 'axios';

class MisTareasView extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      tareas: []
    };
  }

  componentDidMount() {
    this.getTareas();
  }

  render() {
    const { loading, tareas } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'idTarea',
        key: 'idTarea'
      },
      {
        title: 'Descripción',
        dataIndex: 'descripcionTarea',
        key: 'descripcionTarea'
      },
      {
        title: 'Horas estimadas',
        dataIndex: 'horasEstimadasTarea',
        key: 'horasEstimadasTarea'
      }
    ];

    return(
      <div>
        <h3>Mis Tareas</h3>

        <Divider />

        <Table
         columns={columns}
         dataSource={tareas}
         loading={loading}
         scroll={{ x: true }}
         rowKey='idTarea'
         bordered
         locale={{ emptyText: 'No hay tareas' }}/>
      </div>
    );
  }

  getTareas = async () => {
    try {
      this.setState({loading: true})

      var currentUser = localStorage.getItem('currentUser');
      var userInfo = JSON.parse(currentUser);
      var idEmpleado = userInfo.id;

      const res = await axios.get(`http://localhost:60932/empleado/tareas/${idEmpleado}`, getHeader());

      this.setState({ tareas: res.data })

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

export default MisTareasView;