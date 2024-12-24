import React, { useEffect, useRef, useState } from 'react';

export default function Section1Component(){

    const [slide, setSlide] = useState({ 메인슬라이드:[] }); // 메인슬라이드 상태관리
    const [link, setLink] = useState({ 바로가기: [] });
    const [page, setPage] = useState(Array(3).fill(false)); // 인디게이터 버튼 on (true, false)
    const slideWrap = useRef();
    const [stop, setStop] = useState('play');
    const [cnt, setCnt] = useState(0);
    const [id, setId] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [mouseDown, setMouseDown] = useState(null);
    const [mouseUp, setMouseUp] = useState(null);
    const [dragStart, setDragStart] = useState(null);
    const [ease, setEase] = useState({
        ease              : "cubic-bezier(0.25, 0.1, 0.25, 1)",
        linear            : "cubic-bezier(0, 0, 1, 1)",
        easeIn            : "cubic-bezier(0.42, 0, 1, 1)",
        easeOut           : "cubic-bezier(0, 0, 0.58, 1)",
        easeInOut         : "cubic-bezier(0.42, 0, 0.58, 1)"
    });
    
    // 메인슬라이드 fetch() REST API
    useEffect(()=>{
        fetch('./json/main_slide.json',{ method:'GET' })
        .then((res)=>res.json())
        .then((data)=>{ setSlide({ 메인슬라이드:data.메인슬라이드 }) })
        .catch((err)=>{ console.log( err ) });
    },[])
    // 바로가기 fetch() REST API
    useEffect(()=>{
        fetch('./json/section1.json',{ method:'GET' })
        .then((res)=>res.json())
        .then((data)=>{ setLink({ 바로가기:data.바로가기 }) })
        .catch((err)=>{ console.log( err ) });
    },[])

    // 1-1. 메인슬라이드 함수
    function mainSlide(){
        slideWrap.current.style.transition =`transform 0.3s ${ease.easeInOut}`;
        slideWrap.current.style.transform = `translateX(${-1703 * cnt}px)`;

        let imsi = Array(3).fill(false); // imsi[false, false, false]
        imsi[ cnt===3? 0:(cnt===-1? 2:cnt) ] = true; // imsi[false, true, false]
        if( imsi.length===3 ){ setPage(imsi); }
    }

    // 1-2. 메인슬라이드 함수 리턴
    const onTransitionEndEvent=(e)=>{ // transition이 끝나면 즉시 처음으로 리턴 (drag 하기전에 리턴됨)
        if(cnt>2){ // 2   0 1 2   1 (n-1 => 3-1=2 => cnt>2)
            slideWrap.current.style.transition =`none`;
            slideWrap.current.style.transform = `translateX(${-1703 * 0}px)`;
            setTimeout(()=>{ setCnt(0); }, 10); // 초기화 0
        }
        else if(cnt<0){ // 0 1 2 3 0 1 2 3 0 1 2 3
            slideWrap.current.style.transition =`none`;
            slideWrap.current.style.transform = `translateX(${-1703 * 2}px)`;
            setTimeout(()=>{ setCnt(2); }, 10); // 초기화 2
        }
    }

    // mainSlide() 호출 실행은 상태변수 cnt 변화에 따라 변경된다.
    // cnt 변화를 감시하는 감시프로그램 훅
    useEffect(()=>{ mainSlide(); }, [cnt])

    // 2. 카운트 함수
    function nextCount(){ setCnt(cnt=>cnt+1); } // 다음
    function prevCount(){ setCnt(cnt=>cnt-1); } // 이전

    // 3. 자동타이머 함수
    function autoTimer(){
        const imsi = setInterval(()=>{ nextCount(); }, 3000); // 3초간격
        setId( imsi ); // 상태변수(컴포넌트의 전역변수)에 저장
        return ()=> clearInterval(imsi);
    }

    // 4. 로딩시 자동타이머호출 실행 이펙트 훅 (감시자 프로그램<<<<<<<<<중요)
    //    SlideContainer에 mouseEnter시 일시정지 setStop('stop')
    //    SlideContainer에 mouseLeave시 자동타이머 플레이 setStop('play')
    useEffect(()=>{
        if( stop==='play' ){ clearInterval(id); autoTimer(); }
        else{ clearInterval(id); }
    }, [stop]);

    // 5.   mouse e 시 autoTimer 설정 (선택자 SlideContainer)
    // 5-1. mouseEnter e => autoTimer 일시정지(슬라이드 일시정지)
    //      autoTimer setId 변수를 상태관리로 저장해야한다.
    const onMouseEnterSlideContainer=()=>{ clearInterval(id); setStop('stop'); }
    // 5-2. mouseLeave => autoTimer 재실행
    const onMouseLeaveSlideContainer=()=>{ setStop('play'); }

    // 6. touch시작 (선택자 SlideContainer)
    //    mousedown e => touch시작
    const onMouseDownSlideContainer=(e)=>{
        clearInterval(id);
        setMouseDown('down');      // touch시작 'down'
        setTouchStart( e.clientX ) // touch시작 좌표값

        // drag시작 좌표값 = e.clientX - (slideWrap.left + 슬라이드너비 - 좌측헤더)
        let drgStart = e.clientX - (slideWrap.current.getBoundingClientRect().left + 1703 - 200)
        setDragStart(drgStart);
    }

    // 7. 
    useEffect(()=>{
        if(mouseDown==='down'){ // mouseDown => 'down' 이면
            function mouseupFn(e){
                setMouseUp('up');
                setTouchEnd(e.clientX);
                console.log('document mouseup e');
                // 예외처리 리액트에서 버블링 발생         
                document.removeEventListener('mouseup', mouseupFn); // document 업이벤트 버블링 발행 이벤트 제거
            }
            document.addEventListener('mouseup', mouseupFn); // document에서 mouseup e 발생
        }
    }, [mouseDown]);


    // 8. 마우스 업 이벤트 발생하면
    // 터치시작좌표 - 터치끝좌표 
    // 다음카운트함수, 이전카운트함수 구분 실행
    // 0 보다 크면 다음카운트
    // 0 보다 작으면 이전카운트
    useEffect(()=>{
        if(mouseUp==='up'){
            if((touchStart-touchEnd) > 200){ nextCount(); }            
            if((touchStart-touchEnd) < -200){ prevCount(); }
            // 200 이하  -200이상 범위는 다시 제자리로 돌아가게함
            if(((touchStart-touchEnd) <= 200) && ((touchStart-touchEnd) >= -200)){ mainSlide(); }
            setMouseUp('ok');
        }
        // 9. ok면 모두 초기화
        else if(mouseUp==='ok'){ // mouse touch swipe가 모두 끝나면
            // 모든 상태변수 초기화
            setMouseDown(null);
            setMouseUp(null);
            setTouchStart(null);
            setTouchEnd(null);
            autoTimer();
        }
    },[mouseUp]); // 의존성 배열

    // 10. drag & drop (mousemove) => 잡고 끌고 그리고 놓는다.
    //      SlideContainer 선택자를 => mousemove
    //      mousedown => mousemove => mouseup 끝
    //      1. mousedown이 되어야 진행. 아니면 return 취소
    //      2. mousemove 시작좌표   dragStart setDragStart 상태변수
    //      3. mousemove 끝좌표     dragEnd e.clientX => 변수없이 바로사용
    //      4. mousemove 끝좌표 - mousemove 시작좌표 => drag 이동
    //      5. 예외발생 => 슬라이드1 > 슬라이드2 > 슬라이드3 > 슬라이드1 > ?(흰색배경)
    //      6. 해결 => 우측 끝이 보이기 전에 리턴하기 2 0 1 0 1@@@
    const onMouseMoveSlideContainer=(e)=>{
        if(mouseDown!=='down') return;
        slideWrap.current.style.transition = 'none';
        slideWrap.current.style.transform = `translateX(${e.clientX - dragStart}px)`;
    }

    // 인디게이터 버튼 e
    const onClickPageBtn=(e, n)=>{ e.preventDefault(); setCnt(n); }
    // || / ▶                                           setStop(!stop);               // true false 토글방식
    const onClickPausePlayBtn=(e)=>{ e.preventDefault(); setStop(stop==='play'? 'stop':'play'); } // 문자방식
/* 
    useEffect(()=>{
        // {}없는 즉시리턴 형식 => 3항연산자 사용(if문 사용불가)
        link.바로가기.map((item, idx)=>
            item.타이틀!=='' ? console.log("idx=0,2,4" + idx + "" + item.이미지 )
            : console.log("idx=1,3" + idx + "" + item.이미지)
        )
    },[link.바로가기]);
 */
    return (
        <section id="section1"
            // onMouseEnter={onMouseEnterSlideContainer}
            // onMouseLeave={onMouseLeaveSlideContainer}
            // || / ▶ 버튼을 넣음으로 필요없어짐
        >
            <div className="slide-container"
                onMouseDown={onMouseDownSlideContainer}
                onMouseMove={onMouseMoveSlideContainer}
            >
                <div className="slide-view">
                    <ul className="slide-wrap"
                    ref={slideWrap}
                    onTransitionEnd={onTransitionEndEvent}
                    >
                    {slide.메인슬라이드.map((item)=>
                        <li className={`slide ${item.클래스}`} key={item.글번호}>
                            <a href="!#" title={item.타이틀}>
                                <img src={item.이미지} alt={item.타이틀}/>
                                <h2><span>{item.타이틀}</span></h2>
                            </a>
                        </li>
                    ) }
                    </ul>
                </div>
            </div>
            <div className="link" id="link">
                <ul>
                {link.바로가기.map((item, idx)=>{
                    if(item.타이틀!==''){
                        return(
                            <li  key={item.글번호}>                                                            
                                <a href="!#" title={item.타이틀}>
                                    <img src={item.이미지} alt={item.타이틀}/>
                                </a>
                            </li>
                        )
                    }
                    else{
                        return(
                            <li key={item.글번호}>
                                <i></i>
                            </li>
                        )
                    }
                }) }   
                </ul>
            </div>
            {/* 인디게이터 Indicator 버튼(페이지 버튼) */}
            <div className="page-btn-box">
                <span>
                {page.map((item, idx)=>
                    <a 
                        key={idx}
                        onClick={(e)=>onClickPageBtn(e, idx)} 
                        href="!#" 
                        // className={`page-btn1 blind${page[idx] ?' on':''}`}
                        className={`page-btn1 blind${item ?' on':''}`}
                    >버튼1</a>
                ) }
                </span>
                {/* || / ▶ */}
                <strong>
                    <a href="!#"
                        className={`pause-play blind${stop.includes('play')? '':' on'}`}
                        onClick={onClickPausePlayBtn}
                    >|| / ▶</a>
                </strong>
            </div>
        </section>
    );
}