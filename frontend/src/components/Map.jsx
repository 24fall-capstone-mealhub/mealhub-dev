import React, { useRef, useEffect, useState } from 'react';
import useUserInfo from '../hooks/useUserInfo';

const Map = ({ userLocation, resultMenu, menuId }) => {
    const mapContainer = useRef(null);
    const apiCallRef = useRef(false); // API 호출 여부를 추적하는 ref 추가
    const lat = userLocation?.lat;
    const lng = userLocation?.lng;

    const apiKey = process.env.REACT_APP_KAKAO_API_KEY;
    const [keyword, setKeyword] = useState(resultMenu || ""); // 키워드 상태 관리
    console.log("keyword", keyword);
    const { userInfo, loading, error } = useUserInfo();

    const [map, setMap] = useState(null); // map 객체 상태 관리
    const [markers, setMarkers] = useState([]); // markers 상태 관리
    const [centerAddr, setCenterAddr] = useState(""); // centerAddr 상태 관리
    const [searchInput, setSearchInput] = useState(""); // 검색 입력값 상태 관리

    // 만족도 피드백 전송 (로그인 사용자 및 게스트 모두)
    useEffect(() => {
        // 이미 API를 호출했거나, 필요한 정보가 없으면 실행하지 않음
        if (apiCallRef.current || !lat || !lng || !menuId) return;

        // 사용자 ID 확인 (로그인 사용자 또는 게스트)
        let userId = null;
        if (userInfo && userInfo.id) {
            userId = userInfo.id;
        } else {
            // localStorage에서 게스트 ID 확인
            const guestId = localStorage.getItem('guestId');
            if (guestId) {
                userId = parseInt(guestId, 10);
            }
        }

        // 사용자 ID가 있을 경우에만 피드백 전송
        if (userId) {
            // API 호출 여부 표시
            apiCallRef.current = true;
            
            console.log("만족도 피드백 API 호출 시작");
            
            fetch("https://mealhub.duckdns.org/api/feedback/satisfy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: [userId],
                    menu_id: menuId, // props로 전달받은 menu_id 사용
                    timestamp: new Date().toISOString().slice(0,- 1),
                    lat: lat,
                    lon: lng
                })
            })
            .then(res => {
                console.log("만족도 피드백 전송 성공:", res);
            })
            .catch(err => {
                console.error("피드백 전송 오류:", err);
            });
        } else {
            console.log("사용자 ID가 없어 피드백을 전송하지 않습니다.");
        }
    }, [lat, lng, userInfo, menuId]); // keyword 의존성 제거

    // 지도 초기화 (모든 사용자)
    useEffect(() => {
        if (!lat || !lng) return; // 위치 정보가 없으면 초기화하지 않음

        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
        script.async = true;

        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    const container = mapContainer.current;
                    const options = {
                        center: new window.kakao.maps.LatLng(lat, lng), // 위치 수정
                        level: 6,
                    };
                    const initializedMap = new window.kakao.maps.Map(container, options); // 맵 초기화
                    setMap(initializedMap); // map 객체 상태에 저장
                });
            } else {
                console.error("Kakao Maps API 로드 실패!");
            }
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [apiKey, lat, lng]);

    useEffect(() => {
        if (map) {
            searchAddrFromCoords(lng, lat, displayCenterInfo); // 초기 좌표로 주소 검색
        }
    }, [map]);

    useEffect(() => {
        if (map && keyword) {
            console.log("keyword", keyword);
            searchPlaces(map); // 키워드가 변경될 때마다 장소 검색
        }
    }, [keyword, map]);
    
    const searchAddrFromCoords = (longitude, latitude, callback) => {
        // 좌표로 행정동 주소 정보를 요청합니다
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(longitude, latitude, callback); 
    };

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    const displayCenterInfo = (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
            for(var i = 0; i < result.length; i++) {
                // 행정동의 region_type 값은 'H' 이므로
                if (result[i].region_type === 'H') {
                    const dong = result[i].address_name.trim().split(" ").pop();
                    setCenterAddr(dong); // 주소 상태 업데이트
                    
                    // 키워드가 비어있거나 메뉴만 포함된 경우에만 설정
                    if (!keyword || keyword === resultMenu) {
                        const newKeyword = dong + " " + resultMenu;
                        console.log("키워드 설정:", newKeyword);
                        setKeyword(newKeyword); 
                        setSearchInput(newKeyword);
                    }
                    break;
                }
            }
        }    
    };

    // 키워드로 장소 검색하는 함수
    const searchPlaces = (map) => {
        const ps = new window.kakao.maps.services.Places();
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }

        ps.keywordSearch(keyword, (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
                displayPlaces(data, map, infowindow); // 검색 결과 처리
                // displayPagination(pagination);

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 존재하지 않습니다.');
                return;
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
                return;
            }
        });
    };

    // 검색 결과를 지도에 표시하고 목록에 추가하는 함수
    const displayPlaces = (places, map, infowindow) => {
        const listEl = document.getElementById('placesList');
        const menuEl = document.getElementById('menu_wrap');
        const fragment = document.createDocumentFragment();
        const bounds = new window.kakao.maps.LatLngBounds();

        removeAllChildNodes(listEl);
        removeMarker();

        places.forEach((place, i) => {
            const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = addMarker(placePosition, i, place.place_name);
            const itemEl = getListItem(i, place);
            bounds.extend(placePosition);

            (function (marker, title) {
                window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                    displayInfowindow(marker, title, infowindow);
                });

                window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                    infowindow.close();
                });

                itemEl.onmouseover = function () {
                    displayInfowindow(marker, title, infowindow);
                };

                itemEl.onmouseout = function () {
                    infowindow.close();
                };
            })(marker, place.place_name);

            fragment.appendChild(itemEl);
        });

        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;

        //map.setBounds(bounds); // 지도 범위 재설정
    };

    // 장소 목록을 반환하는 함수 (getListItem 추가)
    const getListItem = (index, place) => {
        const el = document.createElement('li');
        let itemStr =
        '<span class="markerbg marker_' +
        (index + 1) +
        '"></span>' +
        '<div class="info">' +
        '   <h5>' +
        place.place_name +
        '</h5>';

        if (place.road_address_name) {
            itemStr +=
            '    <span>' +
            place.road_address_name +
            '</span>';
        } else {
            itemStr += '    <span>' + place.address_name + '</span>';
        }

        itemStr += '  <span class="tel">' + place.phone + '</span>' + '</div>';

        el.innerHTML = itemStr;
        el.className = 'item';

        return el;
    };

    // 마커를 생성하는 함수
    const addMarker = (position, idx, title) => {
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
        const imageSize = new window.kakao.maps.Size(26, 27);
        const imgOptions = {
            spriteSize: new window.kakao.maps.Size(26, 500),
            spriteOrigin: new window.kakao.maps.Point(0, idx * 33 + 7),
            offset: new window.kakao.maps.Point(13, 37),
        };
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        const marker = new window.kakao.maps.Marker({
            position: position,
            image: markerImage,
        });

        marker.setMap(map);
        setMarkers((prevMarkers) => [...prevMarkers, marker]); // 마커 상태 업데이트

        return marker;
    };

    // 검색된 마커를 제거하는 함수
    const removeMarker = () => {
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]); // 마커 상태 비우기
    };

    // 검색결과 목록 하단에 페이지번호를 표시하는 함수
    const displayPagination = (pagination) => {
        const paginationEl = document.getElementById('pagination');
        const fragment = document.createDocumentFragment();

        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild(paginationEl.lastChild);
        }

        for (let i = 1; i <= pagination.last; i++) {
            const el = document.createElement('a');
            el.href = '#';
            el.innerHTML = i;

            if (i === pagination.current) {
                el.className = 'on';
            } else {
                el.onclick = (function (i) {
                    return function () {
                        pagination.gotoPage(i);
                    };
                })(i);
            }

            fragment.appendChild(el);
        }

        paginationEl.appendChild(fragment);
    };

    // 인포윈도우를 표시하는 함수
    const displayInfowindow = (marker, title, infowindow) => {
        const content = '<div style="padding:5px;z-index:1;font-size:12px;font-weight:bold;">' + title + '</div>';
        infowindow.setContent(content);
        infowindow.open(map, marker);
    };

    // 모든 자식 노드를 제거하는 함수
    const removeAllChildNodes = (el) => {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    };

    // 검색어 입력 처리 함수
    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    // 검색 제출 처리 함수
    const handleSubmit = (e) => {
        e.preventDefault();
        setKeyword(searchInput);
    };

    return (
        <div className="map-container">
            <h3 className="map-title">{resultMenu} 식당 찾기</h3>
            <p className="map-subtitle">현재 위치: {centerAddr || "위치 확인 중..."}</p>
            
            <div className="map_wrap">
                <div id="map" className="map" ref={mapContainer}></div>
                
                <div id="menu_wrap" className="bg_white">

                    <ul id="placesList"></ul>
                    <div id="pagination"></div>
                </div>
            </div>
        </div>
    );
};

export default Map;
