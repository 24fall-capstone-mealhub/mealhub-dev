// src/components/SwipeScrollComponent/SwipeScrollComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import useScroll from '../hooks/useScroll';
import { motion } from 'framer-motion';

const Trends = ({ isFixed, trendingFoods = [], loading = false, foodData = {} }) => {
    const containerRef = useRef(null); 
    useScroll(containerRef, "horizontal"); // 가로 스크롤

    useEffect(() => {
        if (isFixed && containerRef.current) {
            containerRef.current.classList.add('fixed');
        } else if (containerRef.current) {
            containerRef.current.classList.remove('fixed');
        }
    }, [isFixed]);

    // 기본 이미지를 사용하는 함수
    const getFallbackImage = () => {
        return;
    };

    if (loading) {
        return (
            <div className="trends fixed loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>인기 메뉴 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="trends fixed">
            {trendingFoods.length > 0 ? (
                trendingFoods.map((item, index) => (
                    <motion.div 
                        className="trend" 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="rank-badge">{index + 1}</div>
                        <img 
                            src={foodData[item.name]?.url || getFallbackImage()} 
                            alt={item.name} 
                        />
                        <h5>{item.name}</h5>
                        <p>{item.score.toFixed(2)}점</p>
                    </motion.div>
                ))
            ) : (
                // 데이터가 없을 경우 기본 표시
                <div className="no-trends">
                    <p>
                         정보를 불러올 수 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default Trends;
