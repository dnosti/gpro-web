import React, { Component } from 'react';
import { Modal } from 'antd';

class EmpleadosModal extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      loading: false
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
    }
  }


  render() {
    const { visible, handleModal } = this.props;
    const { loading } = this.state;
  
    return (
      <Modal
        title='Información del proyecto'
        visible={visible}
        okText='Confirmar'
        okButtonProps={{ 
          display: 'none'
        }}
        onCancel={handleModal}
        cancelButtonProps={{ 
          disabled: loading,
          loading: loading 
        }}
        cancelText='Cerrar'
        width='50%'>

      </Modal>
    );
  }
}

export default EmpleadosModal;