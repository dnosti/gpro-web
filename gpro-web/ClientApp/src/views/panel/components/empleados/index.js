import './index.css';
import React, { Component } from 'react';
import { Row, Col, Table, Button, Form, Divider, message } from 'antd';
import { Modal } from './components';
import { getHeader } from '../../../../utils';
import axios from 'axios';
import moment from 'moment';
import { FormItem } from '../../../../globalComponents';

class EmpleadosView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: false,
      creating: false,
      dato: '',
      dni: '',
      empleados: [],

      editando: false,
      empleado: null
    };
  }

  render() {
    const { visible, loading, empleados, dato, dni, editando, empleado, creating } = this.state;

    const columns = [{
        title: 'DNI',
        dataIndex: 'dni',
        key: 'dni',
        sorter: (a, b) => {
          return a.dni - b.dni;
        },
      }, {
        title: 'Nombre y Apellido',
        key: 'fullname',
        sorter: (a, b) => {
          return a.nombreEmpleado - b.nombreEmpleado;
        },
        render: item => {
          return `${item.nombreEmpleado} ${item.apellidoEmpleado}`
        }
      }, {
        title: 'Fecha de ingreso',
        key: 'fechaIngreso',
        render: item => {
          return moment(item).format('DD/MM/YYYY');
        }
      }, {
        title: 'Dirección',
        dataIndex: 'domicilio',
        key: 'domicilio',
      }, {
        title: 'Localidad',
        key: 'localidad',
        render: item => {
          return `${item.localidad}, ${item.provincia}`
        }
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

    return(
      <div>
        <Button
          type='primary'
          icon='plus-circle'
          onClick={this.handleModal}>
          Crear Empleado
        </Button>

        <Divider />

        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 6 }}>
            <Form
              onSubmit={this.handleSubmit}
              className='login-form'>
                
              <FormItem 
                key='dato'
                label='Nombre/Apellido:'
                name='dato'
                placeholder='Ingrese'
                value={dato}
                error={null}
                onChange={this.onChange}/>

              <FormItem 
                key='dni'
                name='dni'
                label='DNI'
                placeholder='Ingrese'
                value={dni}
                error={null}
                onChange={this.onChange}/>

              <div className='empleados-buttons'>
                <Button
                  style={{ marginRight: '10px' }}
                  onClick={() => this.setState({ dni: '', dato: '' })}>
                  Limpiar
                </Button>
                <Button 
                  type='primary' 
                  icon='search'
                  htmlType='submit'>
                  Buscar
                </Button>
              </div>
            </Form>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 17, offset: 1 }}>
            <Table
              columns={columns} 
              pagination={{ pageSize: 5 }}
              dataSource={empleados}
              loading={loading}
              scroll={{ x: true }}
              rowKey='idEmpleado'
              bordered
              locale={{ emptyText: "No hay empleados" }} />
          </Col>
        </Row>

        <Modal 
          visible={visible}
          handleModal={this.handleModal}
          crearEmpleado={this.crearEmpleado}
          editando={editando}
          creating={creating}
          empleado={empleado}
          editarEmpleado={this.editarEmpleado} />
      </div>
    );
  }

  editarEmpleado = async (form) => {
    try {
      this.setState({ editando: true });
      const res = await axios.put('http://localhost:60932/empleado/update', form, getHeader());

      if (res.data) {
        message.success('Empleado actualizado con éxito');
        this.handleSubmit();
        this.handleModal();
      }        
    } catch (error) {
      let messageError = 'Hubo un error';
      if (error.response) {
        messageError = error.response.data.message || 'Hubo un error';
      }

      message.error(messageError);
    }

    this.setState({ editando: false });
  }

  handleEditar = (empleado) => {
    this.setState({
      visible: true,
      empleado: empleado
    });
  }

  crearEmpleado = async (form) => {
    try {
      this.setState({ creating: true });
      const res = await axios.post('http://localhost:60932/empleado/new', form, getHeader());

      if (res.data) {
        message.success('Empleado creado con exito!');
        this.handleModal();
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

  onChange = (value, key) => {
    this.setState({ [key]: value });
  }
  
  handleSubmit = (event) => {
    if (!!event) event.preventDefault();

    const { dni, dato } = this.state;
  
    if (!dni && !dato) {
      return message.warning('Complete formulario para realizar la busqueda');
    }
  
    let url;
  
    if (!!dni) {
      url = `http://localhost:60932/empleado/documento/${dni}`
    } else {
      url = `http://localhost:60932/empleado/empleados/${dato}`
    }
  
    this.handleRequest(url);
  }

  handleRequest = async (url) => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(url, getHeader());
      let data = res.data;
  
      if (!!this.state.dni) {
        data = [data];
      }
  
      this.setState({ empleados: data });
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
      empleado: null
    });
  }
}

export default EmpleadosView;