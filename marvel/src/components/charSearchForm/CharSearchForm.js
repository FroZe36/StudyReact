import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import { ErrorMessage as HookErrorMessage } from '@hookform/error-message';
import { Link } from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charSearchForm.scss';

const CharSearchForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [char, setChar] = useState(null);
  const { getCharacterByName, clearError, proces, setProces } =
    useMarvelService();

  const onCharLoaded = char => {
    setChar(char);
  };
  const updateChar = name => {
    clearError();

    getCharacterByName(name)
      .then(onCharLoaded)
      .then(() => setProces('confirmed'));
  };
  const errorMessage =
    proces === 'error' ? (
      <div className='char__search-critical-error'>
        <ErrorMessage />
      </div>
    ) : null;
  const results = !char ? null : char.length > 0 ? (
    <div className='char__search-wrapper'>
      <div className='char__search-success'>
        There is! Visit {char[0].name} page?
      </div>
      <Link
        to={`/character/${char[0].id}`}
        className='button button__secondary'
      >
        <div className='inner'>To page</div>
      </Link>
    </div>
  ) : (
    <div className='char__search-error'>
      The character was not found. Check the name and try again
    </div>
  );
  return (
    <div className='char'>
      <div className='char__search'>
        <form
          className='char__search-form'
          onSubmit={handleSubmit(data => updateChar(data.search))}
        >
          <label className='char__search-label' htmlFor='search'>
            Or find a character by name:
          </label>
          <div className='char__search-wrapper'>
            <input
              {...register('search', {
                required: 'This field is required',
              })}
              placeholder='Enter name'
              type='text'
              id='search'
              onBlur={reset}
            />
            <button
              type='submit'
              className='button button__main'
              disabled={proces === 'loading'}
            >
              <div className='inner'>Find</div>
            </button>
          </div>
          <HookErrorMessage
            errors={errors}
            name='search'
            render={({ message }) => (
              <p className='char__search-error'>{message}</p>
            )}
          />
          {results}
          {errorMessage}
        </form>
      </div>
    </div>
  );
};

export default CharSearchForm;
