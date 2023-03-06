import { motion, AnimatePresence, useViewportScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useMatch } from 'react-router-dom';
import styled from 'styled-components';
import { getTvPopular, getTvVideo, IGetTvResult, IGetTvVideo, ITvTopRated } from '../api';
import { makeImagePath } from '../utils';
import MainTrailer from './MainTrailer';
import ErrorBoundary from './errorboundary';

import BoxVideo from './boxVideo';
import BigBoxVideo from './bigBoxVideo';
import BigBoxInfo from '../Components/BigBoxInfo';
import '../fonts/fonts.css';
import { client } from '../index';
import TvBoxVideo from './TvBoxVideo';
import TvTopRated from '../Components/Tv/TvTopRated';
import TvOnAir from '../Components/Tv/TvOnAir';
import TvBigBoxInfo from '../Components/Tv/TvBigBoxInfo';

const Wrapper = styled.div`
  background: transparent;
  padding-bottom: 300px;
  height: 300vh;
  overflow: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  background: transparent;
  z-index: 15;
`;

const MainBox = styled(motion.div)`
  position: absolute;
  height: 20%;
  margin-left: 2vw;
  top: 550px;
`;

const Title = styled(motion.h2)`
  font-size: 85px;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: 'twaysky';
`;
const Overview = styled(motion.p)`
  font-size: 24px;
  width: 31%;
  font-family: 'GowunDodum-Regular';
`;

const Slider = styled.div`
  position: relative;
  top: -15vh;
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

const Box = styled(motion.div)<{ bgphoto: string }>`
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  background-image: url(${(props) => props.bgphoto});
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

const arrowVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    x: 8,
    y: 10,
    scale: 1.1,
    ransition: { delay: 0.2, type: 'tween', duration: 0.3 },
  },
};

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth + 6 : window.outerWidth - 6,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth - 6 : -window.outerWidth + 6,
  }),
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

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 170vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: #0c0b0b;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
  z-index: 100;
`;

const offset = 6;

function Tv() {
  const [onHover, setOnHover] = useState(false);
  const onHovers = () => {
    setTimeout(() => setOnHover(true), 1000);
  };
  const outHovers = () => {
    setTimeout(() => setOnHover(false), 1000);
  };
  const [bigBox, setBigBox] = useState(false);
  const clickBigBox = () => {
    setBigBox(true);
  };
  const clickOverlay = () => {
    setBigBox(false);
  };

  const navigate = useNavigate();
  const bigTvMatch = useMatch('/tv/tvs/:tvId');
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetTvResult>(
    ['TV', 'Popular'],
    async () => await getTvPopular()
  );
  const tvId = data?.results[0].id;
  const tvBase = data?.results[0];

  const { data: videoData, isLoading: videoLoading } = useQuery<IGetTvVideo>(
    ['TV_video', tvId],
    () => getTvVideo(tvId),
    { enabled: !!tvId }
  );

  let videDataResource = videoData?.results.find((x) => x.type === 'Trailer');
  if (!videDataResource) {
    videDataResource = videoData?.results.find((x) => x.type === 'Teaser');
  }
  const bannerVideo = videDataResource?.key;

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      setBack(false);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      setBack(true);

      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/tvs/${tvId}`);
  };
  const onOverlayClick = () => navigate('/tv');

  const topRatedData = client.getQueryData<IGetTvResult>(['TV', 'TopLated']);
  const onAirData = client.getQueryData<IGetTvResult>(['TV', 'OnAir']);
  let clickedTv =
    bigTvMatch?.params.tvId &&
    data?.results.find((tv) => tv.id + '' === bigTvMatch.params.tvId);

  if (!clickedTv) {
    clickedTv =
      bigTvMatch?.params.tvId &&
      topRatedData?.results.find((tv) => tv.id + '' === bigTvMatch.params.tvId);
  }
  if (!clickedTv) {
    clickedTv =
      bigTvMatch?.params.tvId &&
      onAirData?.results.find((tv) => tv.id + '' === bigTvMatch.params.tvId);
  }

  const [hovers, setHovers] = useState(false);
  const [nums, setnums] = useState(0);
  const hoverBox = () => {
    setHovers(true);
  };
  const hoverNum = (num: number) => {
    setnums(num);
  };
  const hoverOut = () => {
    setHovers(false);
  };

  useEffect(() => {
    const tvDelete = data?.results.findIndex((x) => x.poster_path === null)!;
    if (tvDelete !== -1) {
      data?.results.splice(tvDelete, 1);
    }
  }, [data]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <ErrorBoundary>
            <Banner>
              {videoLoading ? (
                <Loader>Loading...</Loader>
              ) : (
                <MainTrailer
                  bannerVideo={bannerVideo}
                  videoLoading={videoLoading}
                  onHover={onHover}
                  bigBox={bigBox}
                ></MainTrailer>
              )}

              <MainBox
                transition={{ delay: 7, type: 'tween', duration: 3 }}
                animate={{ top: '650px' }}
              >
                <Title
                  transition={{ delay: 7, type: 'tween', duration: 3 }}
                  animate={{ fontSize: '50px' }}
                >
                  {tvBase?.name}
                </Title>
                <Overview
                  transition={{ delay: 7, type: 'tween', duration: 6 }}
                  animate={{ display: 'none' }}
                >
                  {tvBase?.overview.slice(0, 120) + '...'}
                </Overview>
              </MainBox>
            </Banner>

            <Slider>
              <motion.svg
                whileHover='hover'
                initial='normal'
                variants={arrowVariants}
                fill='currentColor'
                viewBox='0 0 256 512'
                style={{
                  position: 'absolute',
                  zIndex: '2',
                  width: '50',
                  height: '60',
                  bottom: '-300',
                }}
                xmlns='http://www.w3.org/2000/svg'
                transition={{ type: 'tween' }}
                onClick={decreaseIndex}
              >
                <path d='M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z'></path>
              </motion.svg>
              <AnimatePresence
                initial={false}
                onExitComplete={toggleLeaving}
                custom={back}
              >
                <Row
                  variants={rowVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  key={index}
                  transition={{ type: 'tween', duration: 1 }}
                  custom={back}
                >
                  {data?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + ''}
                        key={tv.id}
                        whileHover='hover'
                        onHoverStart={onHovers}
                        onHoverEnd={outHovers}
                        initial='normal'
                        variants={boxVariants}
                        onClick={() => {
                          onBoxClicked(tv.id);
                          clickBigBox();
                        }}
                        transition={{ type: 'tween' }}
                        bgphoto={
                          tv.poster_path
                            ? makeImagePath(tv.poster_path!, 'w500')
                            : makeImagePath(tv.backdrop_path!, 'w500')
                        }
                      >
                        <Info
                          initial='normal'
                          whileHover='hover'
                          transition={{ type: 'tween' }}
                          key={tv.id + 'bbq'}
                          variants={infoVariants}
                          onMouseEnter={() => {
                            hoverNum(tv.id);
                            hoverBox();
                          }}
                          onMouseLeave={hoverOut}
                        >
                          {hovers ? (
                            nums === tv.id ? (
                              <TvBoxVideo
                                id={tv.id}
                                gre={tv.genre_ids}
                                title={tv.name}
                                vote={tv.vote_average}
                              ></TvBoxVideo>
                            ) : null
                          ) : null}
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <motion.svg
                whileHover='hover'
                initial='normal'
                variants={arrowVariants}
                fill='currentColor'
                viewBox='0 0 256 512'
                style={{
                  position: 'absolute',
                  zIndex: '2',
                  width: '50',
                  height: '60',
                  bottom: '-300',
                  right: '2',
                }}
                xmlns='http://www.w3.org/2000/svg'
                transition={{ type: 'tween' }}
                onClick={incraseIndex}
              >
                <path d='M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z' />
              </motion.svg>
            </Slider>
            <TvTopRated></TvTopRated>
            <TvOnAir></TvOnAir>
            <AnimatePresence>
              {bigTvMatch ? (
                <>
                  <Overlay
                    onClick={() => {
                      onOverlayClick();
                      clickOverlay();
                    }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    style={{ top: scrollY.get() + 100, zIndex: '101' }}
                    layoutId={bigTvMatch.params.tvId}
                  >
                    {clickedTv && (
                      <>
                        <BigBoxVideo id={clickedTv.id} gre='tv'></BigBoxVideo>
                        <TvBigBoxInfo base={clickedTv}></TvBigBoxInfo>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </ErrorBoundary>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
