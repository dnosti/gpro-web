import './index.css';
import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import { Modal } from './components';
import { getHeader } from '../../../../utils';
import axios from 'axios';

class ProyectosView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: false,
      proyectos: []
    };
  }

  componentDidMount() {
    this.getProyectos();
  }

  render() {
    const { visible, loading, proyectos } = this.state;

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
        title: 'Ver info',
        key: 'info',
        render: item => {
          return (
            <Button
              onClick={() => this.proyectInfo(item)}
              >
              Ver
            </Button>
          );
        }
      }
    ];

    return(
      <div>
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
          handleModal={this.handleModal} />
      </div>
    );
  }

  getProyectos = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get('http://localhost:60932/proyectos/', getHeader());
  
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
      visible: !this.state.visible
    });
  }

  proyectInfo = (proyecto) => {

  }
}

export default ProyectosView;