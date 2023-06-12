import { Component } from 'react';
import AppInfo from './components/app-info/app-info';
import SearchPanel from './components/search-panel/search-panel';
import AppFilter from './components/app-filter/app-filter';
import EmployeesList from './components/employees-list/employees-list';
import EmployeesAddForm from './components/employees-add-form/employees-add-form';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { name: 'Johny', salary: 1000, id: 1, like: true, increase: false },
        { name: 'Alex', salary: 3000, id: 2, like: false, increase: true },
        { name: 'Nigga', salary: 5000, id: 3, like: false, increase: false },
      ],
      term: '',
      filter: 'all',
    };
    this.maxId = 4;
  }

  deleteItem = id => {
    this.setState(({ data }) => {
      return {
        data: data.filter(item => item.id !== id),
      };
    });
  };
  addItem = (name, salary) => {
    const newItem = {
      name,
      salary,
      increase: false,
      like: false,
      id: this.maxId++,
    };

    this.setState(({ data }) => {
      const newArr = [...data, newItem];
      return {
        data: newArr,
      };
    });
  };

  onToggleProp = (id, prop) => {
    console.log(prop);
    // this.setState(({ data }) => {
    //   const index = data.findIndex(elem => elem.id === id);
    //   const old = data[index];
    //   const newItem = { ...old, increase: !old.increase };
    //   const newArr = [
    //     ...data.slice(0, index),
    //     ...newItem,
    //     ...data.slice(index + 1),
    //   ];
    //   return {
    //     data: newArr
    //   }
    // });
    this.setState(({ data }) => ({
      data: data.map(item => {
        if (item.id === id) {
          return { ...item, [prop]: !item[prop] };
        }
        return item;
      }),
    }));
  };

  searchEmp = (items, term) => {
    if (term.length === 0) {
      return items;
    }

    return items.filter(item => {
      return item.name.indexOf(term) > -1;
    });
  };
  onUpdateSearch = term => {
    this.setState({ term });
  };
  filterPost = (items, filter) => {
    switch (filter) {
      case 'increase':
        return items.filter(item => item.increase);
      case 'salary':
        return items.filter(item => item.salary > 1000);
      default:
        return items;
    }
  };
  onFilterSelect = filter => {
    this.setState({ filter });
  };

  render() {
    const { data, term, filter } = this.state;
    const employees = this.state.data.length;
    const increased = this.state.data.filter(item => item.increase).length;
    const visibleData = this.filterPost(this.searchEmp(data, term), filter);
    // console.log(data);
    return (
      <div className='App'>
        <AppInfo employees={employees} increased={increased} />
        <div className='search-panel'>
          <SearchPanel onUpdateSearch={this.onUpdateSearch} />
          <AppFilter filter={filter} onFilterSelect={this.onFilterSelect}/>
        </div>

        <EmployeesList
          data={visibleData}
          onDelete={this.deleteItem}
          onToggleProp={this.onToggleProp}
        />
        <EmployeesAddForm onAdd={this.addItem} />
      </div>
    );
  }
}

export default App;
