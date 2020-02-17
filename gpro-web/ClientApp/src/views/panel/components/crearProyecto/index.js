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
      tituloProyecto: '',
      clienteId: null,
      descripcionProyecto: '',
      clientes: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getClientes();
  }

  // renderContent = () => {

  //   if (current === 1) {
  //     return (
  //       <div>
  //         <Row>
  //           <Col span={8}>
  //             <h4>Tipo de tarea</h4>
  //             <Input />
  //           </Col>
  //           <Col span={8}>
  //             <h4>Seleccionar empleado</h4>
  //             <Select 
  //               style={{ width: '100%' }} 
  //               placeholder='Seleccionar'>
  //                 {
  //                   empleados.map((empleado, index) => {
  //                     return (
  //                       <Select.Option 
  //                         key={index}
  //                         value={empleado.id}>
  //                         {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
  //                       </Select.Option>
  //                     );
  //                   })
  //                 }
  //             </Select>
  //           </Col>
  //           <Col span={8}>
  //             <h4>Seleccionar perfil</h4>
  //             <Select 
  //               style={{ width: '100%' }} 
  //               placeholder='Seleccionar'>
  //             </Select>
  //           </Col>
  //         </Row>
  //         <Divider/>

  //         <Row>
  //           <Col span={8}>
  //             <h4>Tipo de tarea</h4>
  //             <Input />
  //           </Col>
  //           <Col span={8}>
  //             <h4>Seleccionar empleado</h4>
  //             <Select 
  //               style={{ width: '100%' }} 
  //               placeholder='Seleccionar'>
  //                 {
  //                   empleados.map((empleado, index) => {
  //                     return (
  //                       <Select.Option 
  //                         key={index}
  //                         value={empleado.id}>
  //                         {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
  //                       </Select.Option>
  //                     );
  //                   })
  //                 }
  //             </Select>
  //           </Col>
  //           <Col span={8}>
  //             <h4>Seleccionar perfil</h4>
  //             <Select 
  //               style={{ width: '100%' }} 
  //               placeholder='Seleccionar'>
  //             </Select>
  //           </Col>
  //         </Row>
  //         <Divider/>

  //         <Row>
  //           <Col span={8}>
  //             <h4>Tipo de tarea</h4>
  //             <Input />
  //           </Col>
  //           <Col span={8}>
  //             <h4>Seleccionar empleado</h4>
  //             <Select 
  //               style={{ width: '100%' }} 
  //               placeholder='Seleccionar'>
  //                 {
  //                   empleados.map((empleado, index) => {
  //                     return (
  //                       <Select.Option 
  //                         key={index}
  //                         value={empleado.id}>
  //                         {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
  //                       </Select.Option>
  //                     );
  //                   })
  //                 }
  //             </Select>
  //           </Col>
  //           <Col span={8}>
  //             <h4>Seleccionar perfil</h4>
  //             <Select 
  //               style={{ width: '100%' }} 
  //               placeholder='Seleccionar'>
  //             </Select>
  //           </Col>
  //         </Row>
  //         <Divider/>

  //         <Row>
  //           <Col span={8}>
  //             <h4>Tipo de tarea</h4>
  //             <Input />
  //           </Col>
  //           <Col span={8}>
  //             <h4>Seleccionar empleado</h4>
  //             <Select 
  //               style={{ width: '100%' }} 
  //               placeholder='Seleccionar'>
  //                 {
  //                   empleados.map((empleado, index) => {
  //                     return (
  //                       <Select.Option 
  //                         key={index}
  //                         value={empleado.id}>
  //                         {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
  //                       </Select.Option>
  //                     );
  //                   })
  //                 }
  //             </Select>
  //           </Col>
  //           <Col span={8}>
  //             <h4>Seleccionar perfil</h4>
  //             <Select 
  //               style={{ width: '100%' }} 
  //               placeholder='Seleccionar'>
  //             </Select>
  //           </Col>
  //         </Row>          
  //       </div>
  //     );
  //   }
  // }

  render() {
    const {  clientes, tituloProyecto, descripcionProyecto, clienteId, loading } = this.state;

    return(
      <div>
        <Row type="flex" justify="center" align="top">
          <Col span={10}>
            <h4>Seleccionar cliente</h4>
            <Select 
              style={{ width: '100%' }} 
              placeholder='Seleccionar'
              value={clienteId}
              onChange={id => this.onChange(id, 'clienteId')}>
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
            <Input 
              value={tituloProyecto}
              onChange={e => this.onChange(e.target.value, 'tituloProyecto')}/>
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col>
            <h4>Descripción del proyecto</h4>
            <TextArea 
              value={descripcionProyecto}
              onChange={e => this.onChange(e.target.value, 'descripcionProyecto')}
              rows={4} />
          </Col>
        </Row>
        
        <Button.Group style={{ marginTop: 20, float: 'right' }}>
          <Button 
            type='danger' 
            disabled={loading}
            onClick={this.reset}>
            Limpiar
          </Button>
          <Button 
            loading={loading}
            disabled={loading}
            type='primary' 
            onClick={this.crear}>
            Crear
          </Button>
        </Button.Group>
      </div>
    );
  }

  reset = () => {
    this.setState({
      tituloProyecto: '',
      clienteId: null,
      descripcionProyecto: ''
    });
  }

  onChange = (value, key) => {
    this.setState({ [key]: value });
  }

  getClientes = async () => {
    try {
      const res = await axios.get('http://localhost:60932/cliente/', getHeader());
      this.setState({ clientes: res.data });
    } catch (error) {}
  }

  crear = async () => {
    const { clienteId, tituloProyecto, descripcionProyecto } = this.state;

    if (!clienteId || !tituloProyecto || !descripcionProyecto) {
      return message.error('Debe completar todos los datos');
    }

    try {
      this.setState({ loading: true });
      const res = await axios.post('http://localhost:60932/proyectos/',
        {
          clienteId, 
          tituloProyecto, 
          descripcionProyecto,
          estadoProyecto: "vigente"
        },
        getHeader());
      
      if (res.data) {
        message.success('Poyecto creado con exito');
        this.reset();
      }
    } catch (error) {
      console.log('error creando: ', error)
    }
    this.setState({ loading: false });
  }

  // getEmpleados = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:60932/empleado/', getHeader());
  //     this.setState({ empleados: res.data });
  //   } catch (error) {}
  // }

}

export default CrearProyecto;