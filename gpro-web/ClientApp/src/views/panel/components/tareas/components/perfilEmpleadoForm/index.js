import React, { Component } from 'react';
import { Col, Select, Button, message, Divider } from 'antd';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';

class PerfilEmpleado extends Component {
  constructor(props) {
    super(props);

    this.state = {
      empleados: [],
      perfiles: [],

      idEmpleado: '',
      idPerfil: '',

      loading: false
    };
  }

  componentDidMount() {
    this.getEmpleados();
    this.getPerfiles();
  }

  render() {
    const { loading, empleados, perfiles } = this.state;
    const { idEmpleado, idPerfil } = this.state;

    return (
      <Col span={10}>
        <h3>Crear Perfil-Empleado</h3>
        <Divider />
        <h4>Seleccionar Empleado</h4>
        <Select
          style={{ width: '100%', marginBottom: 10 }}
          placeholder='Seleccionar'
          value={idEmpleado}
          onChange={value => this.onChange(value, 'idEmpleado')}>
          {
            empleados.map((empleado, index) => {
              return (
                <Select.Option
                key={index}
                value={empleado.idEmpleado}>
                {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                </Select.Option>
              );
            })
          }
        </Select>

        <h4>Seleccionar Perfil</h4>
        <Select
          style={{ width: '100%' }}
          placeholder='Seleccionar'
          value={idPerfil}
          onChange={value => this.onChange(value, 'idPerfil')}>
          {
            perfiles.map((perfil, index) => {
              return (
                <Select.Option
                key={index}
                value={perfil.idPerfil}>
                {perfil.descripcionPerfil}
                </Select.Option>
              );
            })
          }
        </Select>

        <Button.Group style={{ marginTop: 20, float: 'right' }}>
          <Button
            type='danger'
            disabled={loading}
            onClick={() => this.setState({ idEmpleado: '', idPerfil: '' })}>
            Limpiar
          </Button>
          <Button
            loading={loading}
            disabled={loading}
            type='primary'
            onClick={this.crearPerfilEmpleado}>
            Crear
          </Button>
        </Button.Group>
      </Col>
    );
  }

  crearPerfilEmpleado = async () => {
    const { idEmpleado, idPerfil } = this.state;

    if (!idEmpleado || !idPerfil) {
      return message.error('Seleccione perfil y empelado');
    }

    const data = {
      perfilEmpleadoIdPerfil: idPerfil,
      perfilEmpleadoIdEmpleado: idEmpleado
    }

    const res = await axios.post('http://localhost:60932/perfilempleados/', data, getHeader());
    console.log(res.data)
    if (res.data) {
      return message.success('Perfil Empleado generado con exito');
    }
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

  getPerfiles = async () => {
    try {
      const res = await axios.get('http://localhost:60932/perfiles/', getHeader());
      this.setState({ perfiles: res.data });
    } catch (error) {}
  }

}

export default PerfilEmpleado;