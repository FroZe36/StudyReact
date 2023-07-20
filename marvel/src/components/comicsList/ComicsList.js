import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

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
const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [comicsEnded, setComicsEnded] = useState(false);
  const [offset, setOffset] = useState(0);
  
  const { getAllComics, proces, setProces } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);
  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
    .then(onComicsListLoaded)
    .then(() => setProces('confirmed'));
  };
  const onComicsListLoaded = newComicsList => {
    let ended = false;
    if (newComicsList.length < 8) {
      ended = true;
    }
    setComicsList(comicsList => [...comicsList, ...newComicsList]);
    setNewItemLoading(false);
    setOffset(offset + 8);
    setComicsEnded(ended);
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      return (
        <li className='comics__item' key={i}>
          <Link to={`/comics/${item.id}`}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className='comics__item-img'
            />
            <div className='comics__item-name'>{item.title}</div>
            <div className='comics__item-price'>{item.price}</div>
          </Link>
        </li>
      );
    });
    return <ul className='comics__grid'>{items}</ul>;
  }

  return (
    <div className='comics__list'>
      {setContent(proces, () => renderItems(comicsList), newItemLoading)}
      <button
        className='button button__main button__long'
        disabled={newItemLoading}
        onClick={() => onRequest(offset)}
        style={{ display: comicsEnded ? 'none' : 'block' }}
      >
        <div className='inner'>load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
