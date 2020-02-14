import './index.css';
import React, { Component } from 'react';
import { DatePicker, Form, Button } from 'antd';
import moment from 'moment';
import { FormItem } from '../../../../globalComponents';

const { RangePicker } = DatePicker;

class Certification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        fecha: moment().format('DD/MM/YYYY'),
        dato: '',
        dato2: '',
        dato3: ''
      },
      errors: {}
    };
  }

  onChange = fecha => {
    console.log('fecha: ', moment(fecha).format('DD/MM/YYYY hh:mm'))
  }

  onChangeRange = fechas => {
    console.log('fecha inicio: ', moment(fechas[0]).format('DD/MM/YYYY hh:mm'))
    console.log('fecha fin: ', moment(fechas[1]).format('DD/MM/YYYY hh:mm'))
  }

  handleChange = (value, key) => {
    const { form } = this.state;
    // CAMBIO STATE DEL PARAM
    this.setState({
      form: Object.assign({}, form, {
        [key]: value
      })
    });
  }

  // chequea el state del componente al momento del submit
  handleSubmit = (event) => {
    event.preventDefault();
    console.log('> state: ', this.state)
  }

  render() {
    const { form, errors } = this.state;

    return (
      <div>

        <Form onSubmit={this.handleSubmit}>
          {
            Object.keys(form).map((key, index) => {
              let type='text';

              // CASO DE QUE EL INPUT SEA DEL TYPO NUMBER
              if (key === 'KEYDEINPUTNUMBER') {
                type = 'number';
              }

              // si la key es fecha o la condicion que vos quieras retornas otra cosa
              if (key === 'fecha') {
                return (
                    <DatePicker onChange={this.onChange} />
                );
              }

              return (
                <FormItem
                  label={key}
                  key={index}
                  name={key}
                  type={type}
                  placeholder={key}
                  value={form[key]}
                  error={errors[key]}
                  onChange={this.handleChange}/>
              );
            })
          }

          <Button 
            type='primary' 
            icon='search'
            htmlType='submit'>
            Submit
          </Button>
        </Form>

        <DatePicker onChange={this.onChange} />
        <br />
        <RangePicker onChange={this.onChangeRange} />
      </div>
    );
  }

}

export default Certification;