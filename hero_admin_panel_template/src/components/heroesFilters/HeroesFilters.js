import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { activeFilterChanged, fetchFilters, selectAll} from './filtersSlice';
import store from '../../store';
import Spinner from '../spinner/Spinner';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
  const { filtersLoadingStatus, activeFilter } = useSelector(
    state => state.filters,
  );
  const filters  = selectAll(store.getState())

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFilters());
  }, []);

  if (filtersLoadingStatus === 'loading') {
    return <Spinner />;
  } else if (filtersLoadingStatus === 'error') {
    return <h5 className='text-center mt-5'>Ошибка загрузки</h5>;
  }

  const renderFilters = arr => {
    if (arr.length === 0) {
      return <h5 className='text-center mt-5'>Фильтры пока нет</h5>;
    }
    return arr.map(({ name, label, className }) => {
      return (
        <button
          className={`btn ${className} ${
            activeFilter === name ? 'active' : ''
          }`}
          key={name}
          onClick={() => setTimeout(() => dispatch(activeFilterChanged(name)), 1000)}
        >
          {label}
        </button>
      );
    });
  };
  const elements = renderFilters(filters);
  return (
    <div className='card shadow-lg mt-4'>
      <div className='card-body'>
        <p className='card-text'>Отфильтруйте героев по элементам</p>
        <div className='btn-group'>{elements}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
