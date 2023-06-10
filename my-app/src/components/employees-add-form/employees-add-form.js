import { Component } from 'react';

import './employees-add-form.css';

class EmployeesAddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      salary: '',
    };
  }

  onValueChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onHandleSubmit = e => {
    e.preventDefault()
    if(this.state.name.length >= 3 && this.state.salary.length > 0) {
      this.props.onAdd(this.state.name, this.state.salary)
    } else {
      console.log("Введите больше значение")
    }
    this.setState({
      name: '',
      salary: ''
    })
  }

  render() {
    const { name, salary } = this.state;
    return (
      <div className='app-add-form'>
        <h3>Добавьте нового сотрудника</h3>
        <form action='' className='add-form d-flex' onSubmit={this.onHandleSubmit}>
          <input
            type='text'
            placeholder='Как его зовут?'
            className='form-control new-post-label'
            name='name'
            value={name}
            onChange={this.onValueChange}
          />
          <input
            type='text'
            placeholder='З/П в $?'
            className='form-control new-post-label'
            name='salary'
            value={salary}
            onChange={this.onValueChange}
          />

          <button type='submit' className='btn btn-outline-light'>
            Добавить
          </button>
        </form>
      </div>
    );
  }
}

export default EmployeesAddForm;
