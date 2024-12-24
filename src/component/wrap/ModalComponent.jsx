import React, { useEffect, useState } from 'react';

// 2. 리듀서 상태변수 값 변경하기 훅 유즈 디스패치 (setter)
import { useDispatch, useSelector } from 'react-redux';
// 3. 사용자가 만든 리듀서 액션 메서드 가져오기 => 디스패치 할때만 가져온다.
import { mainModalAction } from '../../store/modal';

export default function ModalComponent() {

    // 4. dispatch 선언
    const dispatch = useDispatch();
    const modal = useSelector((state)=>state.modal);

    const [state, setState] = useState({
        chk: false, 
        name : '',
        value : '',
        expires : ''
    });

    // 구조 분할 할당 === 비구조화
    const {name, value, expires} = state;
    
    // 5. 모달창 닫기 click e => 최종 쿠키가 저장. 모달 닫는다.
    const onClickModalClose=(e)=>{
        e.preventDefault();
        dispatch(mainModalAction(false));
        
        setCookie(name, value, expires);
    }

    // 6. 체크박스 이벤트 (쿠키설정 setter)
    const onChangeCheckEvent=(e)=>{
        setState({ ...state, chk: e.target.checked })
    }

    // cookie 설정 함수
    function setCookie(name, value, expires){ // setCookie함수(매개변수1,2,3)
        // 웹문서.쿠키   = '쿠키이름=   값;    path=/; 만료일  =  기한';
        document.cookie = `${name}=${value}; path=/; expires=${expires}`;
    }

    // 오늘하루안열기 체크상태 감시프로그램
    useEffect(()=>{
        if( state.chk ){
            let toDay = new Date();
            toDay.setDate(toDay.getDate() + 1); // 현재날짜 + 1일

            // 4kb (1024byte * 4)
            // 쿠키이름,쿠키값은 공백,특수문자 미사용 권장
            // 공백,특수문자 사용시 유효성,일관성 지키기위해서 인코딩(공백,특수문자 Escape(유니코드 형식) 처리) 필요

            // 인코딩 encode URI Component => encodeURIComponent()
            // 디코딩 decode URI Component => decodeURIComponent()

            // UTF-8로 인코딩
            // a-z A-Z 0-9 - _ . ! ~ * ' ( )  & = + $ ? : @ / ,  제외한 나머지 모든 문자 인코딩 된다.
            // 인코딩은 encode URI => encodeURI() 
            // 디코딩은 decode URI => decodeURI()
            let name    = encodeURIComponent('MAIN MODAL 2'); // 'MAIN_MODAL_2';
            // a-z A-Z 0-9 - _ . ! ~ * ' ( ) 제외한 나머지 모든 문자 인코딩 된다.
            let value   = encodeURIComponent('green 20241219-main-modal close');
            let expires = toDay.toUTCString(); // 국제 표준시 설정

            // 인코딩은 encode URI Component => encodeURIComponent()  결과
            // MAIN  MODAL 1=green 1234 close; MAIN_MODAL1=green_1234_close; MAIN%20MODA%202=green%2020241219-main-modal%20close
            // MAINMODAL1=green1234close;MAIN_MODAL1=green_1234_close;MAIN%20MODA%202=green%2020241219-main-modal%20close
            
            setState({ ...state, name:name, value:value, expires:expires })
        }
        else{ setState({ ...state, name:'', value:'', expires:'' }) }
    }, [state.chk])

    return (
        <div className='layer-popup'>
            <div className="container">
                <div className="title">
                    <h2>{modal.글제목}</h2>
                    <span>{modal.작성날짜}</span>
                </div>
                <div className="content">
                    <ul>
                        <li>{modal.글내용}</li>
                    </ul>
                </div>
                <div className="button-box">
                    <label htmlFor="chk">
                        <input type="checkbox" name='chk' id='chk'
                            onChange={onChangeCheckEvent}
                            value={'오늘 하루 안보기'}
                        />
                        <span>오늘 하루 안보기</span>
                    </label>
                    <button className="close-btn" onClick={onClickModalClose}>닫기</button>
                </div>
            </div>
        </div>
    );
}