import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { ISearch, multiSearch } from '../api';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { makeImagePath } from '../utils';
import { useEffect, useState } from 'react';
import BoxVideo from './boxVideo';

const Wrapper = styled.div`
  height: 180vh;
  overflow: hidden;
  gap: 20px;
`;

const Wrapper2 = styled.div`
  height: 50vh;
  overflow: hidden;
  gap: 20px;
`;

const Slider = styled.div`
  position: relative;
  top: 15vh;
  z-index: 2;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 0.5vw;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
  padding-left: 40px;
  padding-right: 40px;
  margin-top: 5vh;
`;

const Box = styled(motion.div)<{ bgphoto?: string }>`
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  background-image: url(${(props) => props.bgphoto});
  background-color: white;
  background-size: cover;
  background-position: center;
  height: 41vh;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -80,
    scale: 1.3,
    zIndex: 5,
    transition: { delay: 1, type: 'tween', duration: 0.2 },
  },
};

const Info = styled(motion.div)`
  opacity: 0;
  position: relative;
  width: 100%;
  height: 101%;
  bottom: 0;
  z-index: 99;
  h4 {
    text-align: center;
    font-size: 10px;
  }
`;

const infoVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    opacity: 1,
    transition: { delay: 1.4, type: 'tween', duration: 0.8 },
  },
};

const offset = 6;

function Search() {
  const location = useLocation();
  // urlserchparasm 는 파싱하는데 도움을 준다.
  const keyword = new URLSearchParams(location.search).get('keyword')!;
  const { data, isLoading } = useQuery<ISearch>(['Search'], () => multiSearch(keyword));

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const rowVariants = {
    hidden: {
      x: window.outerWidth,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -window.outerWidth,
    },
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <>
      <Wrapper2>
        <Slider>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              variants={rowVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              key={index}
              transition={{ type: 'tween', duration: 1 }}
            >
              {data?.results
                .slice(offset * index, offset * index + offset)
                .map((poster) => (
                  <Box
                    key={poster.id}
                    bgphoto={makeImagePath(poster.poster_path!, 'w500')}
                  ></Box>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
      </Wrapper2>
      <button onClick={increaseIndex}>다음</button>
    </>
  );
}

export default Search;
