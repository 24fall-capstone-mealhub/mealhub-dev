import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import LoadingOverlay from './components/LoadingOverlay';

// 지연 로딩 적용
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup1 = lazy(() => import('./pages/Signup1'));
const Signup2 = lazy(() => import('./pages/Signup2'));
const Mypage = lazy(() => import('./pages/Mypage'));
const GuestSignin = lazy(() => import('./pages/GuestSignin'));

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: var(--background-color);
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: var(--background-color);
  
  @media (min-width: 768px) {
    width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    box-shadow: var(--box-shadow-lg);
  }
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Router>
          <Suspense fallback={
            <LoadingContainer>
              <LoadingOverlay />
            </LoadingContainer>
          }>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup1" element={<Signup1 />} />
                <Route path="/signup2" element={<Signup2 />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/guest-signin" element={<GuestSignin />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </Router>
      </AppContainer>
    </>
  );
}

export default App;