import { useState, useEffect, useRef, useMemo } from 'react';
import './charList.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

const setContent = (proces, Component, newItemLoading) => {
  switch (proces) {
    case 'waiting':
      return <Spinner />;
    case 'loading':
      return newItemLoading ? <Component /> : <Spinner />;
    case 'confirmed':
      return <Component />;
    case 'error':
      return <ErrorMessage />;
    default:
      throw new Error('Unexpected process state');
  }
};
const CharList = props => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);
  const [limit, setLimit] = useState(9);

  const { getAllCharacters, proces, setProces } = useMarvelService();

  useEffect(() => {
    if (localStorage.getItem('storage')) {
      let storage = JSON.parse(localStorage.getItem('storage'));
      onRequest(offset, storage);
      setOffset(offset => offset - limit + storage);
    } else {
      onRequest(offset, limit, true);
    }
  }, []);

  const onRequest = (offset, limit, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset, limit)
      .then(onCharListLoaded)
      .then(() => setProces('confirmed'));
  };

  const onCharListLoaded = newCharList => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    if (limit !== 9) {
      localStorage.setItem('storage', JSON.stringify(limit));
    }
    setCharList(charList => [...charList, ...newCharList]);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => offset + 9);
    setCharEnded(charEnded => ended);
    setLimit(limit => limit + 9);
  };
  const itemRefs = useRef([]);
  const focusOnItem = id => {
    console.log(id);
    itemRefs.current.forEach(item =>
      item.classList.remove('char__item_selected'),
    );
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  };
  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: 'cover' };
      if (
        item.thumbnail ===
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ) {
        imgStyle = { objectFit: 'unset' };
      }
      return (
        <CSSTransition key={item.id} timeout={500} classNames='char__item'>
          <li
            ref={el => (itemRefs.current[i] = el)}
            tabIndex={0}
            className='char__item'
            key={item.id}
            onClick={() => {
              props.onCharSelected(item.id);
              focusOnItem(i);
            }}
            onKeyUp={e => {
              if (e.key === ' ' || e.key === 'Enter') {
                props.onCharSelected(item.id);
                focusOnItem(i);
              }
            }}
          >
            <img src={item.thumbnail} alt={item.name} style={imgStyle} />
            <div className='char__name'>{item.name}</div>
          </li>
        </CSSTransition>
      );
    });
    return (
      <ul className='char__grid'>
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  }

  const elements = useMemo(() => {
    return setContent(proces, () => renderItems(charList), newItemLoading)
  }, [proces])


  return (
    <div className='char__list'>
      {elements}
      <button
        className='button button__main button__long'
        disabled={newItemLoading}
        onClick={() => onRequest(offset)}
        style={{ display: charEnded ? 'none' : 'block' }}
      >
        <div className='inner'>load more</div>
      </button>
    </div>
  );
};
export default CharList;
