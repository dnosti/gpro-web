import './index.css';
import React, { Component } from 'react';
import { Steps, message, Row, Col, Input, Select, Divider } from 'antd';
import { getHeader } from '../../../../utils';
import axios from 'axios';

const { Step } = Steps;
const { TextArea } = Input;

class CrearProyecto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      clientes: [],
      empleados: []
    };
  }

  componentDidMount() {
    this.getClientes();
    this.getEmpleados();
  }

  renderContent = () => {
    const { current, clientes, empleados } = this.state;

    if (current === 0) {
      return (
        <div>
          <Row type="flex" justify="center" align="top">
            <Col span={10}>
              <h4>Seleccionar cliente</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'
                onChange={this.selectChange}>
                  {
                    clientes.map((cliente, index) => {
                      return (
                        <Select.Option 
                          key={index}
                          value={cliente.id}>
                          {cliente.idCliente} - {cliente.razonSocialCliente}
                        </Select.Option>
                      );
                    })
                  }
              </Select>
            </Col>
            <Col span={12} offset={2}>
              <h4>Título del proyecto</h4>
              <Input />
            </Col>
          </Row>

          <Row style={{ marginTop: 20 }}>
            <Col>
              <h4>Descripción del proyecto</h4>
              <TextArea rows={4} />
            </Col>
          </Row>
        </div>
      );
    }

    if (current === 1) {
      return (
        <div>
          <Row>
            <Col span={8}>
              <h4>Tipo de tarea</h4>
              <Input />
            </Col>
            <Col span={8}>
              <h4>Seleccionar empleado</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'>
                  {
                    empleados.map((empleado, index) => {
                      return (
                        <Select.Option 
                          key={index}
                          value={empleado.id}>
                          {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                        </Select.Option>
                      );
                    })
                  }
              </Select>
            </Col>
            <Col span={8}>
              <h4>Seleccionar perfil</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'>
              </Select>
            </Col>
          </Row>
          <Divider/>

          <Row>
            <Col span={8}>
              <h4>Tipo de tarea</h4>
              <Input />
            </Col>
            <Col span={8}>
              <h4>Seleccionar empleado</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'>
                  {
                    empleados.map((empleado, index) => {
                      return (
                        <Select.Option 
                          key={index}
                          value={empleado.id}>
                          {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                        </Select.Option>
                      );
                    })
                  }
              </Select>
            </Col>
            <Col span={8}>
              <h4>Seleccionar perfil</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'>
              </Select>
            </Col>
          </Row>
          <Divider/>

          <Row>
            <Col span={8}>
              <h4>Tipo de tarea</h4>
              <Input />
            </Col>
            <Col span={8}>
              <h4>Seleccionar empleado</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'>
                  {
                    empleados.map((empleado, index) => {
                      return (
                        <Select.Option 
                          key={index}
                          value={empleado.id}>
                          {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                        </Select.Option>
                      );
                    })
                  }
              </Select>
            </Col>
            <Col span={8}>
              <h4>Seleccionar perfil</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'>
              </Select>
            </Col>
          </Row>
          <Divider/>

          <Row>
            <Col span={8}>
              <h4>Tipo de tarea</h4>
              <Input />
            </Col>
            <Col span={8}>
              <h4>Seleccionar empleado</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'>
                  {
                    empleados.map((empleado, index) => {
                      return (
                        <Select.Option 
                          key={index}
                          value={empleado.id}>
                          {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                        </Select.Option>
                      );
                    })
                  }
              </Select>
            </Col>
            <Col span={8}>
              <h4>Seleccionar perfil</h4>
              <Select 
                style={{ width: '100%' }} 
                placeholder='Seleccionar'>
              </Select>
            </Col>
          </Row>          
        </div>
      );
    }
  }

  render() {
    const { current } = this.state;

    return(
      <div>
        <Steps
          type='navigation'
          size='small'
          current={current}
          onChange={this.changeStep}
          style={stepStyle}>
          <Step status={this.renderStatus(0)} title='Proyecto' />
          <Step status={this.renderStatus(1)} title='Tareas' />
          <Step status={this.renderStatus(2)} title='Confirmar' />
        </Steps>

        { this.renderContent() }
      </div>
    );
  }

  getClientes = async () => {
    try {
      const res = await axios.get('http://localhost:60932/cliente/', getHeader());
      this.setState({ clientes: res.data });
    } catch (error) {}
  }

  getEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:60932/empleado/', getHeader());
      this.setState({ empleados: res.data });
    } catch (error) {}
  }

  fetch = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get('', getHeader());
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

  changeStep = current => {
    this.setState({ current });
  };

  renderStatus = step => {
    const { current } = this.state;
    if (step === current) return 'process';
    if (step < current) return 'finish';
    if (step > current) return 'wait';
  }

  selectChange = () => {

  }
}

const stepStyle = {
  marginBottom: 40,
  boxShadow: '0px -1px 0 0 #e8e8e8 inset',
};

export default CrearProyecto;