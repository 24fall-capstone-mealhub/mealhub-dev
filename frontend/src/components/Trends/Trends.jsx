// src/components/SwipeScrollComponent/SwipeScrollComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import useScroll from '../../hooks/useScroll';
import burger from './burger.png';  // 이미지 파일을 import
import bibim from './bibim.png';  // 이미지 파일을 import

const Trends = ({isFixed}) => {
    const containerRef = useRef(null); 
    useScroll(containerRef, "horizontal"); // 가로 스크롤

    useEffect(() => {
        if (isFixed) {
            containerRef.current.classList.add('fixed');
        } else {
            containerRef.current.classList.remove('fixed');
        }
    });

    let [trends, 트렌드변경] = useState(['에드워드 리 버거', '팔도비빔면 제로', '하기싫다오오옹']);

    return (
        <div ref={containerRef} className="trends fixed">
            <div className="trend">
                <img src={ burger }/>
                <h5>{ trends[0] }</h5>
                <p>품절 대란 !</p>
            </div>
            <div className="trend">
                <img src={ bibim }/>
                <h5>{ trends[1] }</h5>
                <p>3월 7일 출시</p>
            </div>
            <div className="trend">
                <img src={ bibim }/>
                <h5>{ trends[2] }</h5>
                <p>메롱</p>
            </div>
        </div>
    );
};

export default Trends;
