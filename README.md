# 세계 수도 퀴즈 (세계 수도송 1탄)

정적 사이트(HTML/JS) + Supabase. 학생은 로그인 없이 접속해 분반·학번·이름·주차를 입력하고 36문항 3지선다를 풉니다.
점수는 학번으로 누적되어 결과 화면에 "4주차 33점 → 5주차 35점"과 주차별 틀린 문항이 표시됩니다.

## 파일
| 파일 | 역할 |
|---|---|
| `index.html` | 학생용 (시작 → 퀴즈 → 결과) |
| `admin.html` | 교수자용 (비밀번호 → 분반·주차별 점수표, CSV 다운로드) |
| `quiz-data.js` | 36개 나라·정답·오답 선택지 (순서 = 수도송 순서) |
| `api.js` | 저장/조회 계층. Supabase 미설정 시 브라우저 localStorage에 저장(테스트용) |
| `config.js` | **Supabase URL·anon key를 여기에 입력** |
| `styles.css` | 공통 스타일 |
| `supabase.sql` | DB 테이블·정책·함수 |

## 배포 절차 (10분)

### 1. Supabase
1. https://supabase.com → New project 생성
2. 좌측 **SQL Editor** → `supabase.sql` 내용 전체 붙여넣기 → Run
   - 파일 안 `'jeonghwa2026'` 이 교수자 화면 비밀번호입니다. 실행 전에 바꾸세요.
   - 나중에 바꾸려면: `update app_config set value='새비밀번호' where key='admin_password';`
3. **Project Settings → API** 에서 `Project URL` 과 `anon public` 키 복사
4. `config.js` 에 붙여넣기:
   ```js
   window.QUIZ_CONFIG = {
     SUPABASE_URL: "https://xxxx.supabase.co",
     SUPABASE_ANON_KEY: "eyJ...",
   };
   ```

### 2. Vercel
1. 이 폴더를 GitHub 저장소로 push (또는 `vercel` CLI로 폴더 그대로 업로드)
2. Vercel → Add New Project → 저장소 선택 → Framework Preset: **Other** → Deploy
3. `https://프로젝트명.vercel.app` 을 학생에게 공유, `https://프로젝트명.vercel.app/admin.html` 은 교수자용

## 보안 메모
- anon 키는 공개되어도 괜찮게 설계했습니다. RLS로 익명은 **insert만** 가능하고, 조회는
  `get_history(학번, 이름)` (본인 기록만), `admin_attempts(비밀번호)` (교수자) 두 함수로만 됩니다.
- 학생이 학번·이름을 다르게 입력하면 별도 학생으로 기록됩니다. 이름의 공백 차이는 무시합니다.

## 동작 규칙
- 36문항 모두 필수. 빠진 문항은 빨간 테두리 + 첫 미응답 문항으로 스크롤.
- 선택지 순서는 접속할 때마다 섞입니다.
- 같은 주차를 여러 번 풀면 모두 저장되며, 누적 그래프·교수자 표는 **마지막 시도** 기준(교수자 표에는 ×2 처럼 시도 횟수 표시).
- 문항 수정: `quiz-data.js` 에서 나라 추가/삭제/오답 변경.
