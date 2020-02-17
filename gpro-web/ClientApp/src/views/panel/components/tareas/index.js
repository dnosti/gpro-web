import './index.css';
import React, { Component } from 'react';
import { Row, Col, Input, Select, Button, message } from 'antd';
import { getHeader } from '../../../../utils';
import axios from 'axios';

const { TextArea } = Input;

class CrearProyecto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      empleados: [],
      proyectos: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getEmpleados();
    this.getProyectos();  
  }

  render() {
    const { loading, empleados, proyectos } = this.state;

    return(
      <div>
        <Row>
          <Col span={10}>
            <h4>Seleccionar proyecto</h4>
            <Select 
              style={{ width: '100%' }} 
              placeholder='Seleccionar'>
                {
                  proyectos.map((proyecto, index) => {
                    return (
                      <Select.Option 
                        key={index}
                        value={proyecto.idProyecto}>
                        {proyecto.idProyecto} - {proyecto.tituloProyecto}
                      </Select.Option>
                    );
                  })
                }
            </Select>
          </Col>
          <Col span={10} offset={2}>
            <h4>Tipo de tarea</h4>
            <Input />
          </Col>
          <Col span={10} style={{ marginTop: 20 }}>
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
          <Col span={10} offset={2} style={{ marginTop: 20 }}>
            <h4>Seleccionar perfil</h4>
            <Select 
              style={{ width: '100%' }} 
              placeholder='Seleccionar'>
                <Select.Option 
                  key='Analista'
                  value='Analista'>
                  Analista
                </Select.Option>
                <Select.Option 
                  key='Desarrollador'
                  value='Desarrollador'>
                  Desarrollador
                </Select.Option>
                <Select.Option 
                  key='Tester'
                  value='Tester'>
                  Tester
                </Select.Option>
                <Select.Option 
                  key='Implementador'
                  value='Implementador'>
                  Implementador
                </Select.Option>
                <Select.Option 
                  key='Capacitador'
                  value='Capacitador'>
                  Capacitador
                </Select.Option>
                <Select.Option 
                  key='Supervisor'
                  value='Supervisor'>
                  Supervisor
                </Select.Option>
            </Select>
          </Col>
        </Row>

        <Button.Group style={{ marginTop: 20, float: 'right' }}>
          <Button 
            type='danger' 
            disabled={loading}
            //onClick={this.reset}
            >
            Limpiar
          </Button>
          <Button 
            loading={loading}
            disabled={loading}
            type='primary' 
            //onClick={this.crear}
            >
            Crear
          </Button>
        </Button.Group>
      </div>
    );
  }


  onChange = (value, key) => {
    this.setState({ [key]: value });
  }

  getEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:60932/empleado/', getHeader());
      this.setState({ empleados: res.data });
    } catch (error) {}
  }

  getProyectos = async () => {
    try {
      const res = await axios.get('http://localhost:60932/proyectos/', getHeader());
  
      this.setState({ proyectos: res.data });
    } catch (error) {}
  }

}

export default CrearProyecto;