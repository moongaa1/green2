import React from 'react';
import ReactDOM from 'react-dom/client';
import WrapComponent from './component/WrapComponent';

// 1. Provider 컴포넌트 가져오기 => react-redux
import { Provider } from 'react-redux';

// 2. store 생성 훅 가져오기 => @reduxjs/toolkit
import { configureStore } from '@reduxjs/toolkit';

// 3. 사용자 reducer 가져오기 => [store] modal.js
import modal from './store/modal';

// 4. store 생성
// const store = configureStore();

// 5. store에 reducer 등록
const store = configureStore({
  reducer: {
    modal
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 6. 프로바이더컴포넌트로 최상위 컴포넌트에 프롭스로 내려보내기 설정
  <Provider store={store}>
    <WrapComponent />
  </Provider>
);