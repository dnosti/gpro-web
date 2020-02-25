import React, { Component } from 'react';
import { Col, Input, Select, Button, message, Divider, InputNumber } from 'antd';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';

class CrearProyecto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proyectos: [],
      perfilEmpleados: [],

      proyectoIdProyecto: '',
      perfilEmpleadoIdPerfil: '',
      perfilEmpleadoIdEmpleado: '',
      descripcionTarea: '',
      horasEstimadasTarea: '',

      loading: false
    };
  }

  componentDidMount() {
    this.getProyectos();
  }

  render() {
    const { loading, proyectos } = this.state;

    return (
      <Col span={10} offset={4}>
        <h3>Crear y asignar Tarea</h3>
        <Divider />
        <h4>Seleccionar Proyecto</h4>
        <Select 
          style={{ width: '100%', marginBottom: 10 }} 
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

        <h4>Seleccionar Perfil-Empleado</h4>
        <Select 
          style={{ width: '100%', marginBottom: 10 }} 
          placeholder='Seleccionar'>
          {/* {
            empleados.map((empleado, index) => {
              return (
                <Select.Option 
                  key={index}
                  value={empleado.id}>
                  {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                </Select.Option>
              );
            })
          } */}
        </Select>

        <h4>Tipo de tarea</h4>
        <Input style={{ marginBottom: 10 }}/>

        <h4>Horas estimadas</h4>
        <InputNumber style={{ width: '100%' }} />

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
      </Col>
    );
  }

  onChange = (value, key) => {
    this.setState({ [key]: value });
  }

  getProyectos = async () => {
    try {
      const res = await axios.get('http://localhost:60932/proyectos/', getHeader());
      this.setState({ proyectos: res.data });
    } catch (error) {}
  }

}

export default CrearProyecto;