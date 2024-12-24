import React, { useEffect } from 'react';
import HeaderComponent from './wrap/HeaderComponent';
import MainComponent from './wrap/MainComponent';
import FooterComponent from './wrap/FooterComponent';
import ModalComponent from './wrap/ModalComponent';

// 1. 리듀서 상태변수 값 가져오기 훅 유즈 셀렉터 (getter)
// 2. 리듀서 상태변수 값 가져오기 훅 유즈 디스패치 (setter)
import { useSelector, useDispatch } from 'react-redux';
// 3. 리듀서 mainModal 변경하는 함수 액션 메서드 가져오기
import { mainModalAction } from '../store/modal';

export default function WrapComponent() {
    
    const mainModal = useSelector((state)=> state.modal.mainModal);
    const dispatch = useDispatch();
    
    // 1. setCookie(이름, 값, 만료일)
    // 2. getCookie(이름)

    // 쿠키 가져오기 : 겟쿠키
    function getCookie(){

        // 1. 쿠키와 쿠키 사이 세미콜론 뒤; 공백제거
        let cookie = document.cookie.replaceAll(' ', '');
        // 2. 디코딩 하기
        cookie = decodeURIComponent(cookie);
        // 3. 세미콜론 기준으로 모든 쿠키를 배열처리
        const cookieArr = cookie.split(';');
        // 4. =를 기준으로 쿠키이름,쿠키값을 객체(Object)로 분리한다.
        let obj = cookieArr.map((item)=>(
            { name: item.split('=')[0], value: item.split('=')[1] }
        ));
              
        obj.map((item)=>{       

            // 부정문
            // 쿠키 이름이 다르거나 쿠키 값이 다르면(즉, 둘다 달라도, 또는 둘중에 하나만 다르더라도) 모달창은 열린다.
            // if(item.name!=='MAIN_MODAL1'  ||  item.value!=='green_1234_close'){
            // if( item.name.includes('MAIN_MODAL1')===false  ||  item.value.includes('green_1234_close')===false ){
            if( !item.name.includes('MAIN MODAL 2')  ||  !item.value.includes('(green)! 20241219-main-modal.com close  & ☆ ♥') ){
                return dispatch(mainModalAction(true)); // 모달창 열기
            }
            else{ return dispatch(mainModalAction(false)); } // 모달창 닫기
        });
    }

    // 로딩시 쿠키 가져오기 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{ getCookie(); }, [])

    return (
        <div id="wrap">
            <HeaderComponent />
            <MainComponent />
            <FooterComponent />
            {/* 모달창 제어하는 변수 연결 확인테스트*/}
            { mainModal && <ModalComponent /> }
        </div>
    );
}