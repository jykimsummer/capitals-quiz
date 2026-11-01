# 자기주도적학습코칭 완전정복

정적 사이트(HTML/JS) + Supabase. 학생은 로그인 없이 접속해 분반·주차·학번·이름을 입력하고,
세계수도송 / 수업이론 / 세 가지 자가진단 중 하나를 골라 응답합니다.

**학생용** https://capitals-quiz-green.vercel.app
**교수자용** https://capitals-quiz-green.vercel.app/admin.html (비밀번호 jeonghwa2026)

## 구성

| 항목 | 내용 |
|---|---|
| 세계수도송 | 36문항 · 객관식 / 주관식 / 랜덤 객관식 / 랜덤 주관식 |
| 수업이론 | 문제은행 48문항 중 18문항 무작위 · 객관식(채점) / 주관식(채점 없이 모범답안 제시) |
| 학습동기 진단 | 20문항 4묶음 · 각 5~25점 |
| 학습스타일 진단 | 24문항 3묶음 · 각 8~40점 |
| 마인드셋 진단 | 12문항 2묶음 · 각 6~30점 |
| 가고 싶은 나라 찾기 | 15문항 한 페이지 · 1번에서 고른 대륙 안에서 나와 맞는 4곳 추천 (채점 없음 · 주차·학번 안 받음) |

## 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 학생용 (시작 → 문제/진단 → 결과) |
| `admin.html` | 교수자용 (비밀번호 → 유형·분반별 점수표, CSV) |
| `quiz-data.js` | 세계수도송 36개국 + 주관식 별칭 |
| `theory-data.js` | 수업이론 문제은행 48문항 |
| `diag-data.js` | 세 진단의 문항·요인·해석·코치 코멘트 |
| `country-data.js` | 나라찾기 15문항 + 48개국(대륙·수도·국기·음식·관광지·비행시간·가기 좋은 때·사진 출처) + 매칭 규칙 |
| `api.js` | 저장/조회 계층 (Supabase 미설정 시 브라우저에만 저장) |
| `config.js` | Supabase URL·키 (입력 완료) |
| `styles.css` | 공통 스타일 |
| `supabase.sql` | DB 전체 생성용 (처음 만들 때) |
| `supabase-추가실행.sql` | 이미 만든 DB에 mode 열만 추가 (이번 업데이트용) |

## 갱신 절차

1. Supabase > SQL Editor 에서 `supabase-추가실행.sql` 실행 (최초 1회만)
2. GitHub > jykimsummer/capitals-quiz > Add file > Upload files
3. 이 폴더 **안의 파일 전체**를 선택해 드래그 → Commit changes
4. Vercel 이 1분 안에 자동 반영. 기존 주소 그대로

## 기록 규칙

- 점수 누적은 과목 단위. 수도송끼리, 수업이론끼리 이어짐
- 이론 주관식과 세 진단은 결과 화면에 누적 기록을 보여주지 않음 (DB에는 저장됨)
- 나라찾기는 점수가 없는 활동이라 0/0점으로 저장됨. 교수자 화면 `유형 > 가고 싶은 나라 찾기` 에서 고른 답과 추천 나라를 볼 수 있음
- 교수자 화면은 상단 '유형' 선택으로 분리해서 조회. 전체를 고르면 섞여 보임
- 교수자 비밀번호 변경: `update app_config set value='새비밀번호' where key='admin_password';`

## 문항 수정

- 수도 목록 → `quiz-data.js`
- 이론 문제은행 → `theory-data.js`
- 진단 문항·코멘트 → `diag-data.js`
- 1순위 나라의 관광지 사진은 위키백과에서 그때그때 불러옴. 바꾸려면 `country-data.js` 의 `pic` (`ko:문서제목` 또는 `en:Title`, `spot` 과 순서를 맞출 것). 인터넷이 막히면 사진 자리에 관광지 이름만 표시됨
- 나라찾기 문항 → `country-data.js` 의 `COUNTRY_Q` · 나라 추가 → `COUNTRY_LIST` · 매칭 규칙 → `scoreCountry`
- 이론 출제 문항 수(18) → `index.html` 의 `THEORY_DRAW`
