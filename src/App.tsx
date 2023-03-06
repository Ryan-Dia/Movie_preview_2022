import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreHome from './Routes/PreHome';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Movie from './Routes/Movie';
import Join from './Routes/Join';
import About from './Routes/About';
import Search from './Routes/Search';
import Header from './Components/Header';
import Error from './Components/error/Error';
import { ReactQueryDevtools } from 'react-query/devtools';

function App() {
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path='/' element={<PreHome />}></Route>
          <Route path='home' element={<Home />}>
            <Route path='movies/:movieId' element={<Home />} />
          </Route>
          <Route path='tv' element={<Tv />}>
            <Route path='tvs/:tvId' element={<Tv />} />
          </Route>
          <Route path='movie' element={<Movie />}></Route>
          <Route path='search' element={<Search />}></Route>
          <Route path='join' element={<Join />}></Route>
          <Route path='about' element={<About />}></Route>
          <Route path={'*'} element={<Error />}></Route>
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
