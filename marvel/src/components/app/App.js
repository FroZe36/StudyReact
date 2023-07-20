import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// import { MainPage, ComicsPage, SingleComicPage } from '../pages';
import AppHeader from '../appHeader/AppHeader';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() =>
  import('../pages/singleComicPage/SingleComicPage'),
);
const SingleCharPage = lazy(() =>
  import('../pages/singleCharPage/SingleCharPage'),
);
const SinglePage = lazy(() => import('../pages/SinglePage'));

const App = () => {
  return (
    <Router>
      <div className='app'>
        <AppHeader />
        <main>
          <Suspense fallback={<span>Loading...</span>}>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/comics' element={<ComicsPage />} />
              <Route
                path='/comics/:id'
                element={<SinglePage View={SingleComicPage} dataType='comic' />}
              />
              <Route
                path='/character/:id'
                element={
                  <SinglePage View={SingleCharPage} dataType='character' />
                }
              />
              <Route path='*' element={<Page404 />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;
