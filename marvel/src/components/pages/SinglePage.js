import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({ View, dataType }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { getComic, getCharacter, clearError, proces, setProces } =
    useMarvelService();

  useEffect(() => {
    updateData();
  }, [id]);

  const updateData = () => {
    clearError();

    switch (dataType) {
      case 'comic':
        getComic(id)
          .then(onDataLoaded)
          .then(() => setProces('confirmed'));
        break;
      case 'character':
        getCharacter(id)
          .then(onDataLoaded)
          .then(() => setProces('confirmed'));
        break;
    }
  };
  const onDataLoaded = data => {
    setData(data);
  };

  return (
    <>
      <>
        <AppBanner />
        {setContent(proces, View, data)}
      </>
    </>
  );
};

export default SinglePage;
