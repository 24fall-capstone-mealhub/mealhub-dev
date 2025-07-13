# MealHub  
**개인 맞춤형 메뉴 추천 시스템**

---

## 프로젝트 개요  
MealHub는 사용자의 **선호도, 시간대, 날씨 정보**를 기반으로  
가장 적절한 음식을 추천해주는 **AI 기반 추천 시스템**입니다.

---

## 프로젝트 구조  

```
mealhub/
├── frontend/         # React 기반 사용자 인터페이스
├── backend/          # Spring Boot 기반 관리 API 서버
├── recommend-api/    # Python 기반 추천 알고리즘
├── trending-api/     # Python 기반 구글 트렌드 분포
├── db/               # MySQL 초기화 SQL 파일 및 백업 디렉토리
├── nginx/            # Nginx 인증서 및 설정 파일
├── .env              # 환경변수 파일
├── docker-compose.yml # 전체 서비스 구성 파일
└── README.md
```

---

## 환경변수 설정  

`.env` 파일 (최상단 위치)에 다음 정보를 입력합니다:

```
# [nginx]
VIRTUAL_HOST=example.com
VIRTUAL_PORT=80
LETSENCRYPT_HOST=example.com
LETSENCRYPT_EMAIL=user@example.com

# [Database]
DB_HOST=localhost
DB_PORT=3306
DB_ROOT_PWD=root
DB_USER=user
DB_USER_PWD=user
DB_NAME=db_example

# [API KEY]
REACT_APP_KAKAO_API_KEY={your KakaoMap API KEY}
OPENWEATHER_API_KEY={your OpenWeather API KEY}
```

---

## 도커 실행 방법  

```bash
docker-compose up --build
```

---

## 개인 설정 및 초기 실행  

**첫 빌드 시**, 가상데이터가 자동 생성되며 딥러닝 모델이 자동 학습됩니다.  
추가적으로 아래 명령어를 통해 수동 실행도 가능합니다:

### recommend-api/ 폴더에서:

#### 가상데이터 생성 및 DB 업로드  
```bash
# settings.py에서 가상데이터 변수 설정 후 실행
python -m virtual.upload_virtual_data
```

#### 현재 DB 데이터를 통한 딥러닝 모델 학습  
```bash
python -m recommendation.train_model
# => recommendation/ueca_model.pt 생성
```

---
