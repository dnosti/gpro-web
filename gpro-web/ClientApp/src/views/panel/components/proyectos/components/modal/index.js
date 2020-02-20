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
      this.setState({
        tituloProyecto: '',
        clienteId: null,
        descripcionProyecto: '',
        loading: false
      });
    }
  }

  render() {
    const { visible, handleModal, creating } = this.props;
    const { clientes, tituloProyecto, descripcionProyecto, clienteId, loading } = this.state;
  
    return (
      <Modal
        title='Crear proyecto'
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

      </Modal>
    );
  }

  handleOk = () => {
    const { tituloProyecto, descripcionProyecto, clienteId } = this.state;

    this.props.crearProyecto({
      tituloProyecto, descripcionProyecto, clienteId
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
}

export default EmpleadosModal;