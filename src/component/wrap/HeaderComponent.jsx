import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function HeaderComponent() {

    const [state, setState] = useState({ 메인메뉴:{} }) // 상태변수

    // 서브메뉴 보이기 show & 숨기기 hide (배열형)
    const [sub, setSub] = React.useState(Array(4).fill(false)); // 상태변수

    // 네비게이션 가져오기
    useEffect(()=>{
        axios({ url:'./json/nav.json', method:'GET' })
        .then((res)=>{ setState({ 메인메뉴: res.data.네비게이션.메인메뉴 }) })
        .catch((err)=>{ console.log(err); });
    },[]);

    // 메인메뉴 바인딩
    useEffect(()=>{
        Object.keys(state.메인메뉴).map((item, idx)=>{return console.log(idx,item)});
        Object.keys(state.메인메뉴).map((item, idx)=>{return console.log(idx,item,state.메인메뉴[item])});
    },[state.메인메뉴])

    const onMouseEnterMainBtn=(e, number)=>{
        let imsi = Array(4).fill(false);
        imsi[number] = true;
        setSub(imsi);
    }

    // 메인버튼 전체 영역 떠나면
    const onMouseLeaveMainBtn=()=>{
        const imsi = Array(4).fill(false);
        setSub(imsi);
    }

    return (
        <header id="header" className="">
            <div className="row1">
                <h1><a href="./" title="푸른마을"><span>푸른</span><em>마을</em></a></h1>
                <div className="mobile-bnt-box">
                    <a href="!#" className="mobile-bnt">
                        <i className="line line1"></i>
                        <i className="line line2"></i>
                        <i className="line line3"></i>
                    </a>
                </div>
            </div>
            <div className="row2">
                <nav id="nav">
                    <ul onMouseLeave={onMouseLeaveMainBtn}>
                    {Object.keys(state.메인메뉴).map((item,idx)=>
                        <li key={item}>
                            <a href="!#" className="main-btn" title="OnSale"  onMouseEnter={(e)=>onMouseEnterMainBtn(e, idx)} >{item}</a>
                            {sub[idx] &&     
                                <div className="sub sub1">
                                    <ul>
                                    {state.메인메뉴[item].map((item2,idx2)=>
                                        <li key={idx2}>
                                            <span><a href="!#">메인1서브</a></span>
                                            <span><a href="!#">OnSale</a></span>
                                            <span><a href="!#">할인행사</a></span>
                                        </li>
                                    ) }
                                    </ul>
                                </div>
                            }
                        </li>
                    ) }
                    </ul>
                </nav>
            </div>
        </header>
    );
}