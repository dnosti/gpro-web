import React from 'react';
import { Result, Button } from 'antd';

const Component404 = (props) => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='No se encontro la pagina'
      extra={
        <Button 
          onClick={() => props.history.push('/')}
          type='primary'>
          Volver al Inicio
        </Button>
      }
    />
  );
}

export default Component404;