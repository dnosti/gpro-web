import React, { Component } from 'react';
import { Modal, Row, Col, Input, Select } from 'antd';
import { getHeader } from '../../../../../../utils';
import axios from 'axios';

const { TextArea } = Input;

class EmpleadosModal extends Component {
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

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if (!!this.props.proyecto) {
        this.setState({
          tituloProyecto: this.props.proyecto.tituloProyecto,
          clienteId: this.props.proyecto.clienteId,
          descripcionProyecto: this.props.proyecto.descripcionProyecto,
          estadoProyecto: this.props.proyecto.estadoProyecto,
        });
      } else {
        this.setState({
          tituloProyecto: '',
          clienteId: null,
          descripcionProyecto: '',
          estadoProyecto: '',
          loading: false
        });
      }
    }
  }

  render() {
    const { visible, handleModal, creating, proyecto } = this.props;
    const { clientes, tituloProyecto, descripcionProyecto, clienteId, loading, estadoProyecto } = this.state;
  
    return (
      <Modal
        title={!proyecto ? 'Crear proyecto' : 'Editar Proyecto'}
        visible={visible}
        okText='Confirmar'
        onOk={this.handleOk}
        okButtonProps={{ 
          disabled: loading || creating,
          loading: loading || creating
        }}
        onCancel={handleModal}
        cancelButtonProps={{ 
          disabled: loading || creating
        }}
        cancelText='Cerrar'
        width='50%'>

        <Row>
          <Col 
            xs={{ span: 24 }} 
            lg={{ span: 12 }}
            style={{ marginBottom: 10 }}>
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

          <Col 
            xs={{ span: 24 }} 
            lg={{ span: 11, offset: 1 }}
            style={{ marginBottom: 10 }}>
            <h4>Título del proyecto</h4>
            <Input 
              value={tituloProyecto}
              onChange={e => this.onChange(e.target.value, 'tituloProyecto')}/>
          </Col>
          
          <Col xs={{ span: 24 }} style={{ marginBottom: 10 }}>
            <h4>Seleccionar Estado</h4>
            <Select 
              style={{ width: '100%' }} 
              placeholder='Seleccionar'
              value={estadoProyecto}
              onChange={estado => this.onChange(estado, 'estadoProyecto')}>

                <Select.Option value='Cancelado'>Cancelado</Select.Option>
                <Select.Option value='No vigente'>No vigente</Select.Option>
                <Select.Option value='Pausado'>Pausado</Select.Option>
                <Select.Option value='Vigente'>Vigente</Select.Option>

            </Select>
          </Col>

          <Col 
            span={24}
            style={{ marginBottom: 10 }}>
            <h4>Descripción del proyecto</h4>
            <TextArea 
              value={descripcionProyecto}
              onChange={e => this.onChange(e.target.value, 'descripcionProyecto')}
              rows={4} />
          </Col>
        </Row>
      </Modal>
    );
  }

  handleOk = () => {
    const { tituloProyecto, descripcionProyecto, clienteId, estadoProyecto } = this.state;

    if (!this.props.proyecto) {
      this.props.crearProyecto({
        tituloProyecto, descripcionProyecto, clienteId, estadoProyecto
      });
    } else {
      this.props.editarProyecto({
        tituloProyecto, descripcionProyecto, clienteId, estadoProyecto,
        idProyecto: this.props.proyecto.idProyecto
      });
    }
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
}

export default EmpleadosModal;