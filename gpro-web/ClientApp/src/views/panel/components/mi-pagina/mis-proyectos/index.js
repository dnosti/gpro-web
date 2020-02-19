import './index.css';
import React, { Component } from 'react';
import { Table, message } from 'antd';

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

    const columns = [
      {
        title: 'ID',
        dataIndex: 'idProyecto',
        key: 'idProyecto'
      },
      {
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
        key: 'estado'
      }
    ];

    return(
      <div>
        <Table
         columns={columns}
         dataSource={proyectos}
         loading={loading}
         scroll={{ x: true }}
         rowKey='idProyecto'
         bordered
         locale={{ emptyText: "No hay proyectos" }}
        />
      </div>
    );
  }

  getProyectos = async () => {
    try {
      this.setState({loading: true})
      console.log('currentUser: ' + localStorage.getItem('currentUser'));

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