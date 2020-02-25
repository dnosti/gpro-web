import './index.css';
import React, { Component } from 'react';
import { Row } from 'antd';
import { PerfilEmpleado, Tarea } from './components';

class CrearProyecto extends Component {
  render() {
    return (
      <Row>
        <PerfilEmpleado/>
        <Tarea />
      </Row>
    );
  }
}

export default CrearProyecto;