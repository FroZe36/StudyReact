import { useState, useEffect } from 'react';
import setContent from '../../utils/setContent';
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';

const CharInfo = props => {
  const [char, setChar] = useState(null);

  const { getCharacter, clearError, proces, setProces } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const updateChar = () => {
    const { charId } = props;
    if (!charId) {
      return;
    }
    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProces('confirmed'));
  };
  const onCharLoaded = char => {
    setChar(char);
  };

  // const skeleton = char || loading || error ? null : <Skeleton />;
  // const errorMessage = error ? <ErrorMessage /> : null;
  // const spinner = loading ? <Spinner /> : null;
  // const content = !(loading || error || !char) ? <View char={char} /> : null;
  return <div className='char__info'>{setContent(proces, View , char)}</div>;
};

const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = data;
  let imgStyle = {
    objectFit: 'cover',
  };
  if (thumbnail.includes('image_not_available')) {
    imgStyle = {
      objectFit: 'contain',
    };
  }
  return (
    <>
      <div className='char__basics'>
        <img src={thumbnail} alt={name} style={imgStyle} />
        <div>
          <div className='char__info-name'>{name}</div>
          <div className='char__btns'>
            <a href={homepage} className='button button__main'>
              <div className='inner'>homepage</div>
            </a>
            <a href={wiki} className='button button__secondary'>
              <div className='inner'>Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className='char__descr'>{description}</div>
      <div className='char__comics'>Comics:</div>
      <ul className='char__comics-list'>
        {comics.length === 0
          ? 'Комиксы Отсутствуют'
          : comics.slice(0, 10).map((item, i) => {
              return (
                <li className='char__comics-item' key={i}>
                  {item.name}
                </li>
              );
            })}
      </ul>
    </>
  );
};

export default CharInfo;
