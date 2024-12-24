import React, { useEffect, useState } from 'react';

// 2. 리듀서 상태변수 값 변경하기 훅 유즈 디스패치 (setter)
import { useDispatch } from 'react-redux';
// 3. 사용자가 만든 리듀서 액션 메서드 가져오기 => 디스패치 할때만 가져온다.
import { mainModalAction } from '../../../store/modal';

export default function Section3Component() {
    
    // 4. dispatch 선언
    const dispatch = useDispatch();
    
    const [notice, setNotice] = useState([]) // 공지사항 상태관리
    const [gallery, setGallery] = useState([]) // 갤러리 상태관리
    const [tab, setTab] = React.useState(false);

    // JSON 데이터 가져오기 fetch() REST API
    // 공지사항
    useEffect(()=>{
        fetch('./json/notice.json',{ method:'GET' })
        .then((res)=>res.json())
        .then((data)=>{ setNotice( data.공지사항 ); }) // .으로 잇는다는건 계속된다는 뜻으로 끝에 ;를 쓰면 안됨.
        .catch((err)=>{ console.log( err ); });
    },[]);
    // 갤러리
    useEffect(()=>{
        fetch('./json/gallery.json',{ method:'GET' })
        .then((res)=>res.json())
        .then((data)=>{ setGallery( data.갤러리 ) }) // .으로 잇는다는건 계속된다는 뜻으로 끝에 ;를 쓰면 안됨.
        .catch((err)=>{ console.log( err ) });
    },[]);

    // 모달창 열기 click e
    const onClickModalOpen=(e, 공지글)=>{
        e.preventDefault();
        // 리덕스 => modal 리듀서 전송 객체
        const notice = {
            글번호: 공지글.글번호,
            글제목: 공지글.글제목,
            글내용: 공지글.글내용,
            작성날짜: 공지글.작성날짜,
            모달: true
        }
        // 5. 모달창열기 구현
        dispatch(mainModalAction(notice)); // dispatch(mainModalAction(페일로드 true=>notice));
    }
    
    // 공지사항 탭 버튼 클릭 이벤트
    const onClickNoticeBtn=(e)=>{ e.preventDefault(); setTab(false); }
    // 갤러리 탭 버튼 클릭  이벤트
    const onClickBalleryBtn=(e)=>{ e.preventDefault(); setTab(true); }

    return (
        <section id="section3">
            <div className="container">
                <button className={`notice-btn${tab?' on':''}`}  onClick={onClickNoticeBtn} >공지사항</button>
                <button className={`gallery-btn${tab?' on':''}`} onClick={onClickBalleryBtn}>갤러리</button>
                <div className={`notice-box${tab?' on':''}`}>
                    <ul>
                    {notice.map((item)=>
                        <li key={item.글번호}>
                            <a href="!#"
                                className="open-btn"
                                onClick={(e)=>onClickModalOpen(e, item)}
                            >{item.글제목}</a>
                            <span>{item.작성날짜}</span>
                        </li>
                    ) }
                    </ul>                  
                </div>
                
                <div className={`gallery-box${tab?' on':''}`}>
                    <ul>
                    {gallery.map((item)=>
                        <li key={item.글번호}>
                            <a href="!#" title={item.이미지설명}>
                                <img src={item.이미지} alt={item.이미지설명}/>
                            </a>
                        </li>
                    ) }
                    </ul>
                </div>
           
            </div>
        </section>
    );
}