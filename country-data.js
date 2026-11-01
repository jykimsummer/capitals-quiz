// 가고 싶은 나라 찾기 — 15문항 + 48개국 데이터 + 매칭 점수 계산
// 문항 수정: COUNTRY_Q / 나라 추가·수정: COUNTRY_LIST / 매칭 규칙: scoreCountry
(function () {

  // ===== 1. 문항 15개 =====
  // k: 점수 축 이름 / opts: 선택지(v = 저장되는 값) / yn: true면 그렇다·아니다 2지선다
  window.COUNTRY_Q = [
    { k: "cont", q: "어느 대륙으로 가 보고 싶나요?", opts: [
      { t: "아시아",            s: "일본 · 태국 · 베트남",      v: "asia" },
      { t: "유럽",              s: "프랑스 · 이탈리아 · 스위스", v: "europe" },
      { t: "아메리카",          s: "미국 · 캐나다 · 멕시코",     v: "america" },
      { t: "오세아니아 · 아프리카", s: "호주 · 뉴질랜드 · 케냐",  v: "ocafr" },
      { t: "상관없음",          s: "어디든 좋아요",             v: "any" },
    ] },
    { k: "fly", q: "비행기를 오래 타는 건 어떤가요?", opts: [
      { t: "10시간 넘어도 괜찮아요", s: "어디든 갈 수 있다", v: 3 },
      { t: "6시간쯤이 딱 좋아요",   s: "적당히 멀리",       v: 2 },
      { t: "3시간 안쪽이 좋아요",   s: "가까운 곳으로",     v: 1 },
    ] },
    { k: "climate", q: "여행 날씨를 고른다면?", opts: [
      { t: "뜨거운 햇볕과 바다",   s: "더운 곳",     v: "hot" },
      { t: "선선한 봄·가을 날씨",  s: "딱 좋은 날씨", v: "mild" },
      { t: "눈 내리는 추운 곳",    s: "추운 곳",     v: "cold" },
    ] },
    { k: "food", q: "내가 좋아하는 음식은?", opts: [
      { t: "쌀·면 중심",        s: "한식·아시아 음식", v: "rice" },
      { t: "빵·고기·파스타",    s: "양식",            v: "west" },
      { t: "향신료가 강한 음식", s: "커리·마라·똠얌",   v: "spice" },
      { t: "뭐든 다 잘 먹어요",  s: "가리는 것 없음",   v: "any" },
    ] },
    { k: "spicy",  q: "매운 음식이나 처음 보는 음식도 잘 먹는다", yn: true },
    { k: "active", q: "여행지에서 아침 일찍부터 부지런히 돌아다니는 편이다", yn: true },
    { k: "scene", q: "더 가고 싶은 쪽은?", opts: [
      { t: "높은 빌딩과 화려한 밤거리", s: "도시",   v: "city" },
      { t: "산·숲·들판",              s: "자연",   v: "nature" },
      { t: "바다와 해변",             s: "바다",   v: "sea" },
      { t: "오래된 성과 유적",         s: "역사",   v: "heritage" },
    ] },
    { k: "museum", q: "박물관이나 미술관에서 한두 시간은 거뜬히 보낼 수 있다", yn: true },
    { k: "shop",   q: "쇼핑에 반나절을 쓰는 것도 즐겁다", yn: true },
    { k: "park",   q: "놀이공원·테마파크는 꼭 가보고 싶다", yn: true },
    { k: "water",  q: "물놀이(수영·스노클링·서핑)를 좋아한다", yn: true },
    { k: "trek",   q: "등산이나 오래 걷는 트레킹도 할 수 있다", yn: true },
    { k: "budget", q: "여행 예산은 어느 쪽인가요?", opts: [
      { t: "최대한 아껴서",   s: "알뜰하게",     v: "low" },
      { t: "적당히 쓰면서",   s: "무리 없이",     v: "mid" },
      { t: "비싸도 제대로",   s: "제대로 즐기기", v: "high" },
    ] },
    { k: "lang",  q: "외국어로 길을 묻는 게 두렵지 않다", yn: true },
    { k: "quiet", q: "사람 많고 유명한 곳보다 한적한 곳이 좋다", yn: true },
  ];

  // ===== 2. 나라 데이터 =====
  // cont: 대륙(asia/europe/america/ocafr) · h: 인천 출발 비행시간(시간) · fly: 화면 문구
  // best: 가기 좋은 때 · when: 기후별로 그 날씨인 달 (tags.climate 에 있는 것만)
  // tags - climate: hot/mild/cold · food: rice/west/spice · scene: city/nature/sea/heritage
  //        spice·active·museum·shop·park·water·trek: 0~3 · budget: low/mid/high
  //        lang: 말 통하기 쉬운 정도 0~3 · crowd: famous/mid/quiet
  const C = [
    { name: "일본", flag: "🇯🇵", cap: "도쿄", cont: ["asia"], h: 2.4, fly: "인천 → 도쿄 직항 약 2시간 20분",
      best: "3~4월 벚꽃 · 10~11월 단풍", when: { mild: "4~5월 · 10~11월", cold: "12~2월" },
      food: ["초밥", "라멘", "오코노미야키"], spot: ["도쿄 디즈니랜드", "교토 기요미즈데라", "후지산"],
      pic: ["ko:도쿄 디즈니랜드", "ko:기요미즈데라", "ko:후지산"],
      c1: "#ff5d8f", c2: "#ff9770",
      tags: { climate: ["mild", "cold"], food: ["rice"], spice: 1, active: 3, scene: ["city", "heritage"], museum: 2, shop: 3, park: 3, water: 1, trek: 2, budget: "mid", lang: 2, crowd: "famous" } },

    { name: "대만", flag: "🇹🇼", cap: "타이베이", cont: ["asia"], h: 2.7, fly: "인천 → 타이베이 직항 약 2시간 40분",
      best: "10~4월", when: { hot: "5~9월", mild: "11~3월" },
      food: ["우육면", "샤오롱바오", "버블티"], spot: ["타이베이 101", "지우펀 옛거리", "예류 지질공원"],
      pic: ["ko:타이베이 101", "ko:지우펀", "ko:예류 지질공원"],
      c1: "#f94144", c2: "#f9c74f",
      tags: { climate: ["hot", "mild"], food: ["rice"], spice: 2, active: 3, scene: ["city", "nature"], museum: 2, shop: 3, park: 1, water: 1, trek: 2, budget: "low", lang: 2, crowd: "famous" } },

    { name: "중국", flag: "🇨🇳", cap: "베이징", cont: ["asia"], h: 2.1, fly: "인천 → 베이징 직항 약 2시간",
      best: "4~5월 · 9~10월", when: { mild: "4~5월 · 9~10월", cold: "11~3월" },
      food: ["베이징덕", "훠궈", "마라탕"], spot: ["만리장성", "자금성", "시안 병마용갱"],
      pic: ["ko:만리장성", "ko:자금성", "ko:병마용"],
      c1: "#d00000", c2: "#ffba08",
      tags: { climate: ["mild", "cold"], food: ["rice", "spice"], spice: 3, active: 3, scene: ["heritage", "city"], museum: 3, shop: 2, park: 1, water: 0, trek: 2, budget: "low", lang: 1, crowd: "famous" } },

    { name: "몽골", flag: "🇲🇳", cap: "울란바토르", cont: ["asia"], h: 3.5, fly: "인천 → 울란바토르 직항 약 3시간 30분",
      best: "6~8월", when: { cold: "10~4월", mild: "6~8월" },
      food: ["허르헉(양고기찜)", "보쯔(찐만두)", "수테차"], spot: ["고비사막", "테를지 국립공원", "초원 게르 캠프"],
      pic: ["ko:고비 사막", "en:Gorkhi-Terelj National Park", "ko:게르"],
      c1: "#3a86ff", c2: "#8ecae6",
      tags: { climate: ["cold", "mild"], food: ["west"], spice: 0, active: 3, scene: ["nature"], museum: 1, shop: 0, park: 0, water: 0, trek: 3, budget: "low", lang: 0, crowd: "quiet" } },

    { name: "필리핀", flag: "🇵🇭", cap: "마닐라", cont: ["asia"], h: 4.0, fly: "인천 → 마닐라 직항 약 4시간 (세부 4시간 30분)",
      best: "11~4월 건기", when: { hot: "연중 더움 · 가장 더운 때 3~5월" },
      food: ["아도보", "레촌(통돼지구이)", "할로할로"], spot: ["보라카이 화이트비치", "세부 아일랜드호핑", "팔라완 엘니도"],
      pic: ["ko:보라카이", "ko:세부섬", "ko:엘니도"],
      c1: "#00b4d8", c2: "#90e0ef",
      tags: { climate: ["hot"], food: ["rice"], spice: 1, active: 2, scene: ["sea"], museum: 0, shop: 1, park: 1, water: 3, trek: 1, budget: "low", lang: 3, crowd: "famous" } },

    { name: "베트남", flag: "🇻🇳", cap: "하노이", cont: ["asia"], h: 5.0, fly: "인천 → 하노이 직항 약 5시간 (다낭 5시간)",
      best: "11~4월", when: { hot: "5~9월", mild: "11~4월" },
      food: ["쌀국수(퍼)", "반미", "분짜"], spot: ["하롱베이", "호이안 구시가지", "다낭 미케비치"],
      pic: ["ko:할롱만", "ko:호이안", "ko:다낭"],
      c1: "#e63946", c2: "#f4a261",
      tags: { climate: ["hot", "mild"], food: ["rice"], spice: 2, active: 2, scene: ["sea", "heritage", "nature"], museum: 1, shop: 2, park: 1, water: 3, trek: 1, budget: "low", lang: 1, crowd: "famous" } },

    { name: "태국", flag: "🇹🇭", cap: "방콕", cont: ["asia"], h: 6.0, fly: "인천 → 방콕 직항 약 6시간",
      best: "11~2월", when: { hot: "연중 더움 · 가장 더운 때 3~5월" },
      food: ["팟타이", "똠얌꿍", "망고 찹쌀밥"], spot: ["왓포 사원", "푸껫 해변", "치앙마이 올드시티"],
      pic: ["ko:왓 포", "ko:푸껫주", "ko:치앙마이"],
      c1: "#f72585", c2: "#ffb703",
      tags: { climate: ["hot"], food: ["rice", "spice"], spice: 3, active: 3, scene: ["sea", "city", "heritage"], museum: 1, shop: 3, park: 2, water: 3, trek: 2, budget: "low", lang: 2, crowd: "famous" } },

    { name: "캄보디아", flag: "🇰🇭", cap: "프놈펜", cont: ["asia"], h: 5.5, fly: "인천 → 프놈펜 직항 약 5시간 30분",
      best: "11~2월", when: { hot: "연중 더움 · 가장 더운 때 3~5월" },
      food: ["아목(생선 커리)", "롯착(볶음국수)", "크메르 커리"], spot: ["앙코르와트", "톤레삽 호수", "시아누크빌 해변"],
      pic: ["ko:앙코르 와트", "ko:톤레사프호", "ko:시아누크빌"],
      c1: "#bc6c25", c2: "#dda15e",
      tags: { climate: ["hot"], food: ["rice", "spice"], spice: 2, active: 2, scene: ["heritage", "nature"], museum: 2, shop: 0, park: 0, water: 2, trek: 2, budget: "low", lang: 1, crowd: "mid" } },

    { name: "라오스", flag: "🇱🇦", cap: "비엔티안", cont: ["asia"], h: 5.5, fly: "인천 → 비엔티안 직항 약 5시간 30분",
      best: "11~2월", when: { hot: "3~5월", mild: "11~2월" },
      food: ["랍(다진고기 샐러드)", "카오삐약(쌀국수)", "라오식 바게트"], spot: ["루앙프라방 탁발 행렬", "꽝시 폭포", "방비엥 블루라군"],
      pic: ["ko:루앙프라방", "en:Kuang Si Falls", "en:Vang Vieng"],
      c1: "#2a9d8f", c2: "#a7c957",
      tags: { climate: ["hot", "mild"], food: ["rice"], spice: 2, active: 2, scene: ["nature", "heritage"], museum: 1, shop: 0, park: 0, water: 2, trek: 3, budget: "low", lang: 0, crowd: "quiet" } },

    { name: "싱가포르", flag: "🇸🇬", cap: "싱가포르", cont: ["asia"], h: 6.5, fly: "인천 → 싱가포르 직항 약 6시간 30분",
      best: "연중 · 비 적은 2~4월", when: { hot: "연중 27~32도" },
      food: ["칠리크랩", "하이난 치킨라이스", "락사"], spot: ["마리나베이샌즈", "가든스 바이 더 베이", "센토사 유니버설스튜디오"],
      pic: ["ko:마리나 베이 샌즈", "ko:가든스 바이 더 베이", "ko:센토사"],
      c1: "#7209b7", c2: "#4cc9f0",
      tags: { climate: ["hot"], food: ["rice", "spice"], spice: 2, active: 3, scene: ["city"], museum: 2, shop: 3, park: 3, water: 2, trek: 0, budget: "high", lang: 3, crowd: "famous" } },

    { name: "말레이시아", flag: "🇲🇾", cap: "쿠알라룸푸르", cont: ["asia"], h: 6.5, fly: "인천 → 쿠알라룸푸르 직항 약 6시간 30분",
      best: "5~9월 건기", when: { hot: "연중 더움 · 비 적은 5~9월" },
      food: ["나시르막", "사테", "바쿠테"], spot: ["페트로나스 트윈타워", "랑카위 섬", "바투 동굴"],
      pic: ["ko:페트로나스 트윈 타워", "ko:랑카위", "ko:바투 동굴"],
      c1: "#0077b6", c2: "#ffb703",
      tags: { climate: ["hot"], food: ["rice", "spice"], spice: 3, active: 2, scene: ["city", "sea", "nature"], museum: 1, shop: 3, park: 2, water: 3, trek: 2, budget: "low", lang: 3, crowd: "mid" } },

    { name: "인도네시아", flag: "🇮🇩", cap: "자카르타", cont: ["asia"], h: 7.0, fly: "인천 → 자카르타 직항 약 7시간 (발리 7시간)",
      best: "5~9월 건기", when: { hot: "연중 더움 · 비 적은 5~9월" },
      food: ["나시고렝", "사테 아얌", "가도가도"], spot: ["발리 우붓", "보로부두르 사원", "길리섬 스노클링"],
      pic: ["ko:우붓", "ko:보로부두르", "ko:길리 제도"],
      c1: "#ef233c", c2: "#06d6a0",
      tags: { climate: ["hot"], food: ["rice", "spice"], spice: 3, active: 2, scene: ["sea", "nature", "heritage"], museum: 1, shop: 1, park: 1, water: 3, trek: 2, budget: "low", lang: 2, crowd: "famous" } },

    { name: "인도", flag: "🇮🇳", cap: "뉴델리", cont: ["asia"], h: 8.5, fly: "인천 → 델리 직항 약 8시간 30분",
      best: "10~3월", when: { hot: "3~6월 (40도까지)" },
      food: ["커리", "탄두리 치킨", "난"], spot: ["타지마할", "바라나시 갠지스강", "자이푸르 핑크시티"],
      pic: ["ko:타지마할", "ko:바라나시", "ko:자이푸르"],
      c1: "#ff7b00", c2: "#8338ec",
      tags: { climate: ["hot"], food: ["spice"], spice: 3, active: 3, scene: ["heritage"], museum: 3, shop: 2, park: 0, water: 0, trek: 2, budget: "low", lang: 2, crowd: "famous" } },

    { name: "네팔", flag: "🇳🇵", cap: "카트만두", cont: ["asia"], h: 11, fly: "인천 → 카트만두 경유 약 11시간",
      best: "3~5월 · 9~11월", when: { mild: "3~5월 · 9~11월", cold: "12~2월" },
      food: ["달밧", "모모(만두)", "뗀뚝"], spot: ["안나푸르나 트레킹", "포카라 페와 호수", "더르바르 광장"],
      pic: ["ko:안나푸르나", "ko:포카라", "ko:카트만두 더르바르 광장"],
      c1: "#1d3557", c2: "#457b9d",
      tags: { climate: ["mild", "cold"], food: ["spice", "rice"], spice: 3, active: 3, scene: ["nature"], museum: 1, shop: 0, park: 0, water: 0, trek: 3, budget: "low", lang: 1, crowd: "quiet" } },

    { name: "아랍에미리트", flag: "🇦🇪", cap: "아부다비", cont: ["asia"], h: 10, fly: "인천 → 두바이 직항 약 10시간",
      best: "11~3월", when: { hot: "4~10월 (한여름 45도)" },
      food: ["샤와르마", "후무스", "캅사"], spot: ["부르즈 할리파", "사막 사파리", "팜 주메이라"],
      pic: ["ko:부르즈 할리파", "ko:두바이", "ko:팜 주메이라"],
      c1: "#c9a227", c2: "#f4d35e",
      tags: { climate: ["hot"], food: ["west", "spice"], spice: 2, active: 2, scene: ["city"], museum: 2, shop: 3, park: 3, water: 2, trek: 1, budget: "high", lang: 3, crowd: "famous" } },

    { name: "튀르키예", flag: "🇹🇷", cap: "앙카라", cont: ["asia", "europe"], h: 11.5, fly: "인천 → 이스탄불 직항 약 11시간 30분",
      best: "4~5월 · 9~10월", when: { hot: "6~9월", mild: "4~5월 · 10~11월" },
      food: ["케밥", "바클라바", "고등어 샌드위치"], spot: ["카파도키아 열기구", "이스탄불 블루모스크", "파묵칼레 석회층"],
      pic: ["ko:카파도키아", "ko:술탄 아흐메트 모스크", "ko:파묵칼레"],
      c1: "#e01e37", c2: "#f77f00",
      tags: { climate: ["hot", "mild"], food: ["west", "spice"], spice: 2, active: 3, scene: ["heritage", "nature"], museum: 3, shop: 2, park: 0, water: 2, trek: 2, budget: "mid", lang: 1, crowd: "famous" } },

    { name: "이집트", flag: "🇪🇬", cap: "카이로", cont: ["ocafr"], h: 14, fly: "인천 → 카이로 경유 약 14시간",
      best: "10~4월", when: { hot: "5~9월 (사막 40도)" },
      food: ["코샤리", "몰로키야", "타메야"], spot: ["기자 피라미드", "룩소르 왕가의 계곡", "홍해 다합 스노클링"],
      pic: ["ko:기자의 대피라미드", "ko:왕가의 계곡", "en:Dahab"],
      c1: "#d4a373", c2: "#e9c46a",
      tags: { climate: ["hot"], food: ["spice", "west"], spice: 2, active: 3, scene: ["heritage"], museum: 3, shop: 1, park: 0, water: 3, trek: 1, budget: "low", lang: 1, crowd: "famous" } },

    { name: "모로코", flag: "🇲🇦", cap: "라바트", cont: ["ocafr"], h: 17, fly: "인천 → 카사블랑카 경유 약 17시간",
      best: "3~5월 · 9~11월", when: { hot: "6~9월 (사막 한낮 45도)" },
      food: ["타진", "쿠스쿠스", "민트티"], spot: ["사하라 사막 투어", "쉐프샤우엔 블루시티", "마라케시 제마엘프나 광장"],
      pic: ["ko:사하라 사막", "ko:쉐프샤우엔", "en:Jemaa el-Fnaa"],
      c1: "#0077b6", c2: "#e76f51",
      tags: { climate: ["hot"], food: ["spice"], spice: 3, active: 3, scene: ["nature", "heritage"], museum: 2, shop: 2, park: 0, water: 1, trek: 3, budget: "low", lang: 1, crowd: "mid" } },

    { name: "영국", flag: "🇬🇧", cap: "런던", cont: ["europe"], h: 13.5, fly: "인천 → 런던 직항 약 13시간 30분",
      best: "5~9월", when: { mild: "5~9월", cold: "11~3월" },
      food: ["피시앤칩스", "선데이 로스트", "애프터눈티"], spot: ["빅벤과 런던아이", "대영박물관", "해리포터 스튜디오"],
      pic: ["ko:빅 벤", "ko:대영박물관", "ko:런던 아이"],
      c1: "#22223b", c2: "#9a8c98",
      tags: { climate: ["mild", "cold"], food: ["west"], spice: 0, active: 2, scene: ["city", "heritage"], museum: 3, shop: 3, park: 2, water: 0, trek: 1, budget: "high", lang: 3, crowd: "famous" } },

    { name: "프랑스", flag: "🇫🇷", cap: "파리", cont: ["europe"], h: 13, fly: "인천 → 파리 직항 약 13시간",
      best: "4~6월 · 9~10월", when: { mild: "4~10월" },
      food: ["크루아상", "에스카르고", "마카롱"], spot: ["에펠탑", "루브르 박물관", "몽생미셸"],
      pic: ["ko:에펠탑", "ko:루브르 박물관", "ko:몽생미셸"],
      c1: "#3d348b", c2: "#f08080",
      tags: { climate: ["mild"], food: ["west"], spice: 0, active: 2, scene: ["city", "heritage"], museum: 3, shop: 3, park: 3, water: 1, trek: 1, budget: "high", lang: 2, crowd: "famous" } },

    { name: "독일", flag: "🇩🇪", cap: "베를린", cont: ["europe"], h: 12.5, fly: "인천 → 프랑크푸르트 직항 약 12시간 30분",
      best: "5~9월 (크리스마스 마켓 12월)", when: { mild: "5~9월", cold: "11~3월" },
      food: ["소시지(부어스트)", "슈니첼", "프레첼"], spot: ["노이슈반슈타인 성", "브란덴부르크 문", "로맨틱 가도"],
      pic: ["ko:노이슈반슈타인성", "ko:브란덴부르크 문", "en:Rothenburg ob der Tauber"],
      c1: "#212529", c2: "#e63946",
      tags: { climate: ["mild", "cold"], food: ["west"], spice: 0, active: 2, scene: ["heritage", "city", "nature"], museum: 3, shop: 2, park: 1, water: 0, trek: 2, budget: "mid", lang: 2, crowd: "mid" } },

    { name: "스페인", flag: "🇪🇸", cap: "마드리드", cont: ["europe"], h: 14, fly: "인천 → 마드리드 직항 약 14시간",
      best: "4~6월 · 9~10월", when: { hot: "6~9월", mild: "4~5월 · 10월" },
      food: ["빠에야", "하몽", "츄러스"], spot: ["사그라다 파밀리아", "알함브라 궁전", "산티아고 순례길"],
      pic: ["ko:사그라다 파밀리아", "ko:알람브라", "ko:산티아고 순례길"],
      c1: "#e63946", c2: "#ffb703",
      tags: { climate: ["hot", "mild"], food: ["west"], spice: 1, active: 3, scene: ["city", "heritage", "sea"], museum: 3, shop: 2, park: 1, water: 2, trek: 3, budget: "mid", lang: 1, crowd: "famous" } },

    { name: "이탈리아", flag: "🇮🇹", cap: "로마", cont: ["europe"], h: 13, fly: "인천 → 로마 직항 약 13시간",
      best: "4~6월 · 9~10월", when: { hot: "6~8월", mild: "4~5월 · 9~10월" },
      food: ["피자", "파스타", "젤라토"], spot: ["콜로세움", "베네치아 수상도시", "피렌체 두오모"],
      pic: ["ko:콜로세움", "ko:베네치아", "ko:피렌체 대성당"],
      c1: "#2a9d8f", c2: "#e76f51",
      tags: { climate: ["hot", "mild"], food: ["west"], spice: 0, active: 2, scene: ["heritage", "city", "sea"], museum: 3, shop: 3, park: 0, water: 2, trek: 1, budget: "mid", lang: 1, crowd: "famous" } },

    { name: "스위스", flag: "🇨🇭", cap: "베른", cont: ["europe"], h: 12.5, fly: "인천 → 취리히 직항 약 12시간 30분",
      best: "6~9월 (스키 12~3월)", when: { cold: "11~3월 (산 위는 연중 눈)", mild: "6~9월" },
      food: ["치즈 퐁뒤", "뢰스티", "스위스 초콜릿"], spot: ["융프라우요흐", "마테호른과 체르마트", "루체른 호수"],
      pic: ["en:Jungfraujoch", "ko:마터호른", "ko:루체른"],
      c1: "#d00000", c2: "#48cae4",
      tags: { climate: ["cold", "mild"], food: ["west"], spice: 0, active: 3, scene: ["nature"], museum: 1, shop: 1, park: 0, water: 0, trek: 3, budget: "high", lang: 2, crowd: "famous" } },

    { name: "체코", flag: "🇨🇿", cap: "프라하", cont: ["europe"], h: 12, fly: "인천 → 프라하 직항 약 12시간",
      best: "5~9월", when: { mild: "5~9월", cold: "11~3월" },
      food: ["꼴레노(족발구이)", "굴라시", "트르델니크"], spot: ["프라하성", "카를교", "체스키크룸로프"],
      pic: ["ko:프라하성", "ko:카렐교", "ko:체스키크룸로프"],
      c1: "#6a4c93", c2: "#ff924c",
      tags: { climate: ["mild", "cold"], food: ["west"], spice: 0, active: 2, scene: ["heritage", "city"], museum: 2, shop: 1, park: 0, water: 0, trek: 1, budget: "mid", lang: 1, crowd: "famous" } },

    { name: "오스트리아", flag: "🇦🇹", cap: "빈", cont: ["europe"], h: 12, fly: "인천 → 빈 직항 약 12시간",
      best: "5~9월 (스키 12~3월)", when: { mild: "5~9월", cold: "11~3월" },
      food: ["비너 슈니첼", "자허토르테", "굴라시"], spot: ["쇤브룬 궁전", "할슈타트 호수마을", "잘츠부르크 구시가"],
      pic: ["ko:쇤브룬 궁전", "ko:할슈타트", "ko:잘츠부르크"],
      c1: "#c1121f", c2: "#90be6d",
      tags: { climate: ["mild", "cold"], food: ["west"], spice: 0, active: 2, scene: ["heritage", "nature"], museum: 3, shop: 1, park: 0, water: 0, trek: 2, budget: "high", lang: 2, crowd: "mid" } },

    { name: "네덜란드", flag: "🇳🇱", cap: "암스테르담", cont: ["europe"], h: 12, fly: "인천 → 암스테르담 직항 약 12시간",
      best: "4~5월 튤립 · 6~9월", when: { mild: "4~9월", cold: "11~3월" },
      food: ["하링(청어)", "스트룹와플", "프리츠(감자튀김)"], spot: ["운하 보트투어", "반 고흐 미술관", "큐켄호프 튤립정원"],
      pic: ["ko:암스테르담", "ko:반 고흐 미술관", "ko:쾨켄호프"],
      c1: "#f77f00", c2: "#4361ee",
      tags: { climate: ["mild", "cold"], food: ["west"], spice: 0, active: 2, scene: ["city", "nature"], museum: 3, shop: 2, park: 1, water: 1, trek: 1, budget: "high", lang: 3, crowd: "famous" } },

    { name: "핀란드", flag: "🇫🇮", cap: "헬싱키", cont: ["europe"], h: 11.5, fly: "인천 → 헬싱키 직항 약 11시간 30분",
      best: "6~8월 백야 · 12~3월 오로라", when: { cold: "10~4월 (한겨울 영하 20도)" },
      food: ["연어 수프", "순록 고기", "카렐리아 파이"], spot: ["로바니에미 산타마을", "오로라 관측", "호수 사우나"],
      pic: ["ko:로바니에미", "ko:오로라", "ko:사우나"],
      c1: "#48cae4", c2: "#caf0f8",
      tags: { climate: ["cold"], food: ["west"], spice: 0, active: 2, scene: ["nature", "city"], museum: 2, shop: 1, park: 2, water: 0, trek: 2, budget: "high", lang: 3, crowd: "quiet" } },

    { name: "노르웨이", flag: "🇳🇴", cap: "오슬로", cont: ["europe"], h: 14, fly: "인천 → 오슬로 경유 약 14시간",
      best: "6~8월 (오로라 10~3월)", when: { cold: "10~4월" },
      food: ["연어 요리", "브루노스트(갈색치즈)", "미트볼"], spot: ["송네 피오르", "트롤퉁가 절벽", "로포텐 제도"],
      pic: ["ko:송네 피오르", "en:Trolltunga", "en:Lofoten"],
      c1: "#1d3557", c2: "#a8dadc",
      tags: { climate: ["cold"], food: ["west"], spice: 0, active: 3, scene: ["nature"], museum: 2, shop: 0, park: 0, water: 1, trek: 3, budget: "high", lang: 3, crowd: "quiet" } },

    { name: "아이슬란드", flag: "🇮🇸", cap: "레이캬비크", cont: ["europe"], h: 16, fly: "인천 → 레이캬비크 경유 약 16시간",
      best: "6~8월 (오로라 9~4월)", when: { cold: "연중 서늘 · 가장 추운 때 12~2월" },
      food: ["양고기 수프", "스카이르(요구르트)", "랍스터 수프"], spot: ["블루라군 온천", "오로라", "굴포스 폭포"],
      pic: ["en:Blue Lagoon (geothermal spa)", "ko:오로라", "ko:굴포스"],
      c1: "#0466c8", c2: "#7ae582",
      tags: { climate: ["cold"], food: ["west"], spice: 0, active: 3, scene: ["nature"], museum: 1, shop: 0, park: 0, water: 2, trek: 3, budget: "high", lang: 3, crowd: "quiet" } },

    { name: "그리스", flag: "🇬🇷", cap: "아테네", cont: ["europe"], h: 15, fly: "인천 → 아테네 경유 약 15시간",
      best: "5~6월 · 9~10월", when: { hot: "6~9월", mild: "4~5월 · 10월" },
      food: ["수블라키", "무사카", "그릭 요거트"], spot: ["산토리니 블루돔", "아크로폴리스", "메테오라 수도원"],
      pic: ["ko:산토리니", "ko:아크로폴리스", "ko:메테오라"],
      c1: "#0077b6", c2: "#48cae4",
      tags: { climate: ["hot", "mild"], food: ["west"], spice: 0, active: 2, scene: ["sea", "heritage"], museum: 3, shop: 1, park: 0, water: 3, trek: 2, budget: "mid", lang: 2, crowd: "famous" } },

    { name: "포르투갈", flag: "🇵🇹", cap: "리스본", cont: ["europe"], h: 16, fly: "인천 → 리스본 경유 약 16시간",
      best: "4~6월 · 9~10월", when: { hot: "6~9월", mild: "3~5월 · 10월" },
      food: ["에그타르트", "바칼라우(대구요리)", "프란세지냐"], spot: ["신트라 페나성", "포르투 동 루이스 다리", "벨렝탑"],
      pic: ["en:Pena Palace", "ko:동 루이스 1세 다리", "ko:벨렝 탑"],
      c1: "#006400", c2: "#e63946",
      tags: { climate: ["hot", "mild"], food: ["west"], spice: 1, active: 2, scene: ["sea", "heritage", "city"], museum: 2, shop: 1, park: 0, water: 2, trek: 2, budget: "mid", lang: 2, crowd: "mid" } },

    { name: "크로아티아", flag: "🇭🇷", cap: "자그레브", cont: ["europe"], h: 14, fly: "인천 → 자그레브 경유 약 14시간",
      best: "5~6월 · 9~10월", when: { hot: "6~9월", mild: "4~5월 · 10월" },
      food: ["체밥치치", "페카 요리", "문어 샐러드"], spot: ["플리트비체 호수", "두브로브니크 성벽", "흐바르 섬"],
      pic: ["ko:플리트비체 호수", "ko:두브로브니크", "ko:흐바르"],
      c1: "#118ab2", c2: "#06d6a0",
      tags: { climate: ["hot", "mild"], food: ["west"], spice: 0, active: 3, scene: ["nature", "sea", "heritage"], museum: 1, shop: 0, park: 0, water: 3, trek: 3, budget: "mid", lang: 2, crowd: "mid" } },

    { name: "헝가리", flag: "🇭🇺", cap: "부다페스트", cont: ["europe"], h: 13, fly: "인천 → 부다페스트 경유 약 13시간",
      best: "4~6월 · 9~10월", when: { mild: "5~9월", cold: "11~3월" },
      food: ["굴라시", "랑고스", "파프리카 치킨"], spot: ["세체니 온천", "부다왕궁 야경", "어부의 요새"],
      pic: ["ko:세체니 온천", "ko:부다 왕궁", "ko:어부의 요새"],
      c1: "#9d0208", c2: "#52b788",
      tags: { climate: ["mild", "cold"], food: ["west", "spice"], spice: 2, active: 2, scene: ["city", "heritage"], museum: 2, shop: 1, park: 0, water: 2, trek: 1, budget: "low", lang: 1, crowd: "mid" } },

    { name: "폴란드", flag: "🇵🇱", cap: "바르샤바", cont: ["europe"], h: 13, fly: "인천 → 바르샤바 경유 약 13시간",
      best: "5~9월", when: { cold: "11~3월", mild: "5~9월" },
      food: ["피에로기", "비고스", "주렉"], spot: ["크라쿠프 구시가", "비엘리치카 소금광산", "자코파네 산악마을"],
      pic: ["ko:크라쿠프", "ko:비엘리치카 소금 광산", "ko:자코파네"],
      c1: "#dc2f02", c2: "#adb5bd",
      tags: { climate: ["cold", "mild"], food: ["west"], spice: 0, active: 2, scene: ["heritage", "nature"], museum: 3, shop: 1, park: 0, water: 0, trek: 2, budget: "low", lang: 1, crowd: "quiet" } },

    { name: "스웨덴", flag: "🇸🇪", cap: "스톡홀름", cont: ["europe"], h: 13, fly: "인천 → 스톡홀름 경유 약 13시간",
      best: "6~8월 (오로라 12~3월)", when: { cold: "10~4월" },
      food: ["미트볼", "셈라", "훈제연어"], spot: ["감라스탄 구시가", "바사 박물관", "북극권 아이스호텔"],
      pic: ["ko:감라스탄", "ko:바사 박물관", "ko:아이스호텔"],
      c1: "#003f88", c2: "#ffd500",
      tags: { climate: ["cold"], food: ["west"], spice: 0, active: 2, scene: ["city", "nature"], museum: 3, shop: 2, park: 1, water: 0, trek: 2, budget: "high", lang: 3, crowd: "quiet" } },

    { name: "덴마크", flag: "🇩🇰", cap: "코펜하겐", cont: ["europe"], h: 13, fly: "인천 → 코펜하겐 경유 약 13시간",
      best: "5~9월", when: { cold: "11~3월", mild: "5~9월" },
      food: ["스뫼레브로(오픈샌드위치)", "덴마크 페이스트리", "프리카델러"], spot: ["티볼리 공원", "인어공주 동상", "뉘하운 항구"],
      pic: ["ko:티볼리 공원", "en:The Little Mermaid (statue)", "ko:뉘하운"],
      c1: "#c1121f", c2: "#ffd6a5",
      tags: { climate: ["cold", "mild"], food: ["west"], spice: 0, active: 2, scene: ["city"], museum: 2, shop: 2, park: 3, water: 0, trek: 1, budget: "high", lang: 3, crowd: "mid" } },

    { name: "아일랜드", flag: "🇮🇪", cap: "더블린", cont: ["europe"], h: 15, fly: "인천 → 더블린 경유 약 15시간",
      best: "5~9월", when: { mild: "5~9월", cold: "11~3월" },
      food: ["아이리시 스튜", "소다브레드", "피시앤칩스"], spot: ["모허 절벽", "기네스 스토어하우스", "링 오브 케리"],
      pic: ["ko:모허 절벽", "ko:기네스", "en:Ring of Kerry"],
      c1: "#2d6a4f", c2: "#ff9e00",
      tags: { climate: ["mild", "cold"], food: ["west"], spice: 0, active: 3, scene: ["nature", "city"], museum: 2, shop: 1, park: 0, water: 0, trek: 3, budget: "mid", lang: 3, crowd: "quiet" } },

    { name: "미국", flag: "🇺🇸", cap: "워싱턴 D.C.", cont: ["america"], h: 14, fly: "인천 → 뉴욕 직항 약 14시간 (LA 11시간 · 괌 4시간 30분)",
      best: "4~6월 · 9~10월", when: { hot: "6~8월 (남부·서부)", mild: "4~5월 · 9~10월", cold: "12~2월 (북부)" },
      food: ["햄버거", "뉴욕 피자", "바비큐 립"], spot: ["뉴욕 타임스스퀘어", "그랜드캐니언", "올랜도 디즈니월드"],
      pic: ["ko:타임스 스퀘어", "ko:그랜드 캐니언", "ko:월트 디즈니 월드 리조트"],
      c1: "#0a2463", c2: "#e63946",
      tags: { climate: ["hot", "mild", "cold"], food: ["west"], spice: 1, active: 3, scene: ["city", "nature"], museum: 3, shop: 3, park: 3, water: 2, trek: 3, budget: "high", lang: 3, crowd: "famous" } },

    { name: "캐나다", flag: "🇨🇦", cap: "오타와", cont: ["america"], h: 10.5, fly: "인천 → 밴쿠버 직항 약 10시간 30분",
      best: "6~9월 (스키 12~3월)", when: { cold: "11~3월 (영하 20도)", mild: "6~9월" },
      food: ["푸틴", "메이플 시럽 디저트", "연어구이"], spot: ["나이아가라 폭포", "밴프 국립공원", "레이크 루이스"],
      pic: ["ko:나이아가라 폭포", "ko:밴프 국립공원", "en:Lake Louise (Alberta)"],
      c1: "#d62828", c2: "#8ecae6",
      tags: { climate: ["cold", "mild"], food: ["west"], spice: 0, active: 3, scene: ["nature"], museum: 2, shop: 1, park: 1, water: 1, trek: 3, budget: "high", lang: 3, crowd: "mid" } },

    { name: "멕시코", flag: "🇲🇽", cap: "멕시코시티", cont: ["america"], h: 15, fly: "인천 → 멕시코시티 경유 약 15시간",
      best: "11~4월 건기", when: { hot: "연중 더움 · 가장 더운 때 4~6월" },
      food: ["타코", "과카몰레", "추로스"], spot: ["치첸이트사 피라미드", "칸쿤 해변", "테오티우아칸"],
      pic: ["ko:치첸이트사", "ko:칸쿤", "ko:테오티우아칸"],
      c1: "#006847", c2: "#ce1126",
      tags: { climate: ["hot"], food: ["spice", "west"], spice: 3, active: 3, scene: ["sea", "heritage"], museum: 3, shop: 1, park: 0, water: 3, trek: 2, budget: "mid", lang: 1, crowd: "famous" } },

    { name: "페루", flag: "🇵🇪", cap: "리마", cont: ["america"], h: 22, fly: "인천 → 리마 경유 약 22시간",
      best: "5~9월 건기", when: { mild: "5~9월 (건기)", hot: "12~3월 (해안)" },
      food: ["세비체", "로모 살타도", "감자 요리"], spot: ["마추픽추", "쿠스코 잉카 유적", "티티카카 호수"],
      pic: ["ko:마추 픽추", "ko:쿠스코", "ko:티티카카호"],
      c1: "#d90429", c2: "#ffba08",
      tags: { climate: ["mild", "hot"], food: ["spice"], spice: 2, active: 3, scene: ["heritage", "nature"], museum: 2, shop: 0, park: 0, water: 1, trek: 3, budget: "mid", lang: 1, crowd: "famous" } },

    { name: "브라질", flag: "🇧🇷", cap: "브라질리아", cont: ["america"], h: 25, fly: "인천 → 상파울루 경유 약 25시간",
      best: "12~3월 (남반구 여름)", when: { hot: "12~3월 (남반구 여름)" },
      food: ["슈하스코", "페이조아다", "파스텔"], spot: ["리우 예수상", "이구아수 폭포", "코파카바나 해변"],
      pic: ["en:Christ the Redeemer (statue)", "ko:이구아수 폭포", "ko:코파카바나 해변"],
      c1: "#009739", c2: "#fedd00",
      tags: { climate: ["hot"], food: ["west"], spice: 1, active: 3, scene: ["sea", "nature", "city"], museum: 1, shop: 1, park: 0, water: 3, trek: 2, budget: "mid", lang: 0, crowd: "famous" } },

    { name: "아르헨티나", flag: "🇦🇷", cap: "부에노스아이레스", cont: ["america"], h: 26, fly: "인천 → 부에노스아이레스 경유 약 26시간",
      best: "10~4월", when: { mild: "10~4월 (남반구 여름)", cold: "6~8월 (남반구 겨울)" },
      food: ["아사도(소고기 구이)", "엠파나다", "둘세데레체"], spot: ["이구아수 폭포", "파타고니아 빙하", "탱고 거리 라보카"],
      pic: ["ko:이구아수 폭포", "ko:파타고니아", "en:La Boca"],
      c1: "#74acdf", c2: "#f6b40e",
      tags: { climate: ["mild", "cold"], food: ["west"], spice: 0, active: 3, scene: ["nature", "city"], museum: 2, shop: 1, park: 0, water: 0, trek: 3, budget: "mid", lang: 0, crowd: "mid" } },

    { name: "남아프리카공화국", flag: "🇿🇦", cap: "프리토리아", cont: ["ocafr"], h: 20, fly: "인천 → 요하네스버그 경유 약 20시간",
      best: "9~4월 (사파리 5~9월)", when: { hot: "11~3월 (남반구 여름)", mild: "4~5월 · 9~10월" },
      food: ["브라이(바비큐)", "보보티", "빌통"], spot: ["크루거 사파리", "테이블마운틴", "희망봉"],
      pic: ["ko:크루거 국립공원", "en:Table Mountain", "ko:희망봉"],
      c1: "#007a4d", c2: "#ffb612",
      tags: { climate: ["hot", "mild"], food: ["west", "spice"], spice: 2, active: 3, scene: ["nature", "sea"], museum: 1, shop: 1, park: 0, water: 2, trek: 3, budget: "mid", lang: 3, crowd: "mid" } },

    { name: "케냐", flag: "🇰🇪", cap: "나이로비", cont: ["ocafr"], h: 18, fly: "인천 → 나이로비 경유 약 18시간",
      best: "6~10월 사파리", when: { hot: "연중 더움 · 가장 더운 때 1~3월", mild: "6~9월 (고원지대)" },
      food: ["냐마 초마(구운 고기)", "우갈리", "수쿠마위키"], spot: ["마사이마라 사파리", "암보셀리 국립공원", "나이바샤 호수"],
      pic: ["ko:마사이마라", "ko:암보셀리 국립공원", "ko:나이바샤호"],
      c1: "#006600", c2: "#bb0000",
      tags: { climate: ["hot", "mild"], food: ["spice"], spice: 2, active: 3, scene: ["nature"], museum: 0, shop: 0, park: 0, water: 0, trek: 3, budget: "mid", lang: 3, crowd: "quiet" } },

    { name: "호주", flag: "🇦🇺", cap: "캔버라", cont: ["ocafr"], h: 10, fly: "인천 → 시드니 직항 약 10시간",
      best: "9~11월 · 3~5월", when: { hot: "12~2월 (남반구 여름)", mild: "9~11월 · 3~5월" },
      food: ["미트파이", "피시앤칩스", "플랫화이트 커피"], spot: ["시드니 오페라하우스", "그레이트배리어리프", "울룰루 바위"],
      pic: ["ko:시드니 오페라 하우스", "ko:그레이트배리어리프", "ko:울루루"],
      c1: "#012169", c2: "#00843d",
      tags: { climate: ["hot", "mild"], food: ["west"], spice: 0, active: 3, scene: ["sea", "nature", "city"], museum: 2, shop: 2, park: 1, water: 3, trek: 3, budget: "high", lang: 3, crowd: "famous" } },

    { name: "뉴질랜드", flag: "🇳🇿", cap: "웰링턴", cont: ["ocafr"], h: 12, fly: "인천 → 오클랜드 직항 약 12시간",
      best: "12~3월 (남반구 여름)", when: { mild: "12~3월 (남반구 여름)", cold: "6~8월 (스키 시즌)" },
      food: ["양고기 요리", "그린홍합", "파블로바"], spot: ["밀포드사운드", "호비튼 영화마을", "퀸스타운 번지점프"],
      pic: ["en:Milford Sound", "ko:호비튼", "ko:퀸스타운 (뉴질랜드)"],
      c1: "#00247d", c2: "#4cc9a0",
      tags: { climate: ["mild", "cold"], food: ["west"], spice: 0, active: 3, scene: ["nature"], museum: 1, shop: 0, park: 1, water: 2, trek: 3, budget: "high", lang: 3, crowd: "quiet" } },
  ];
  window.COUNTRY_LIST = C;

  // ===== 3. 매칭 점수 =====
  const BUDGET_ORDER = { low: 0, mid: 1, high: 2 };

  function scoreCountry(c, a) {
    const t = c.tags;
    let s = 0;

    // 비행시간 — 가장 크게 반영
    if (a.fly === 1)      s += c.h <= 4 ? 34 : c.h <= 7 ? 10 : c.h <= 11 ? -18 : -42;
    else if (a.fly === 2) s += c.h <= 4 ? 16 : c.h <= 8 ? 30 : c.h <= 13 ? 12 : -16;
    else                  s += c.h <= 4 ? 4  : c.h <= 8 ? 14 : c.h <= 16 ? 28 : 24;

    // 기후 · 음식 · 풍경 — 핵심 취향
    s += t.climate.indexOf(a.climate) >= 0 ? 18 : -5;
    s += a.food === "any" ? 9 : (t.food.indexOf(a.food) >= 0 ? 18 : -3);
    s += t.scene.indexOf(a.scene) >= 0 ? 20 : -4;

    // 매운 음식 · 부지런함
    s += a.spicy ? (t.spice >= 2 ? 11 : 0) : (t.spice >= 3 ? -9 : 7);
    s += a.active ? (t.active >= 3 ? 11 : t.active >= 2 ? 4 : -3) : (t.active <= 2 ? 9 : 0);

    // 활동 취향 5가지 (0~3 강도)
    s += a.museum ? t.museum * 4 : (3 - t.museum) * 2;
    s += a.shop   ? t.shop   * 4 : 0;
    s += a.park   ? t.park   * 4 : 0;
    s += a.water  ? t.water  * 4 : 0;
    s += a.trek   ? t.trek   * 4 : 0;

    // 예산 — 한 칸 차이는 조금만 감점
    const gap = Math.abs(BUDGET_ORDER[t.budget] - BUDGET_ORDER[a.budget]);
    s += gap === 0 ? 15 : gap === 1 ? 2 : -12;

    // 언어 · 혼잡도
    s += a.lang ? 3 : (t.lang >= 3 ? 12 : t.lang >= 2 ? 4 : -10);
    s += a.quiet ? (t.crowd === "quiet" ? 13 : t.crowd === "mid" ? 5 : -5)
                 : (t.crowd === "famous" ? 11 : t.crowd === "mid" ? 4 : -2);

    return s;
  }

  // 왜 이 나라인지 — 실제로 맞은 축만 문장으로
  const CONT_TXT = { asia: "아시아", europe: "유럽", america: "아메리카", ocafr: "오세아니아·아프리카" };
  const CLIMATE_TXT = { hot: "뜨거운 날씨", mild: "선선한 날씨", cold: "추운 날씨" };
  const FOOD_TXT = { rice: "쌀·면 음식", west: "빵·고기·파스타", spice: "향신료 강한 음식" };
  const SCENE_TXT = { city: "화려한 도시", nature: "산과 자연", sea: "바다와 해변", heritage: "오래된 성과 유적" };
  const BUDGET_TXT = { low: "알뜰한 예산", mid: "적당한 예산", high: "제대로 쓰는 예산" };

  function reasonsFor(c, a) {
    const t = c.tags, r = [];
    if (a.cont !== "any" && c.cont.indexOf(a.cont) >= 0) r.push("네가 고른 " + CONT_TXT[a.cont]);
    if (a.fly === 1 && c.h <= 4) r.push("비행 " + c.h + "시간이면 도착");
    else if (a.fly === 2 && c.h > 4 && c.h <= 8) r.push("딱 적당한 비행시간");
    else if (a.fly === 3 && c.h > 8) r.push("길게 날아갈 만한 곳");
    // 기후는 "그 날씨가 몇 월인지"까지 붙여 준다
    if (t.climate.indexOf(a.climate) >= 0) {
      const w = c.when && c.when[a.climate];
      r.push(CLIMATE_TXT[a.climate] + (w ? " · " + w : ""));
    }
    if (a.food !== "any" && t.food.indexOf(a.food) >= 0) r.push(FOOD_TXT[a.food] + " 천국");
    if (t.scene.indexOf(a.scene) >= 0) r.push(SCENE_TXT[a.scene]);
    if (a.water && t.water >= 3) r.push("물놀이 최고");
    if (a.trek && t.trek >= 3) r.push("걷고 오르기 좋음");
    if (a.museum && t.museum >= 3) r.push("박물관·미술관 풍년");
    if (a.shop && t.shop >= 3) r.push("쇼핑 천국");
    if (a.park && t.park >= 3) r.push("놀이공원 있음");
    if (a.spicy && t.spice >= 3) r.push("매운맛 도전");
    if (BUDGET_ORDER[t.budget] === BUDGET_ORDER[a.budget]) r.push(BUDGET_TXT[a.budget] + "에 맞음");
    if (!a.lang && t.lang >= 3) r.push("말 통하기 쉬움");
    if (a.quiet && t.crowd === "quiet") r.push("한적한 편");
    if (!a.quiet && t.crowd === "famous") r.push("누구나 아는 명소");
    return r;
  }

  // 상위 n개국을 매칭률(%)과 이유와 함께 돌려준다
  // 1번에서 대륙을 고르면 그 대륙 안에서만 고른다 (상관없음이면 전체)
  window.COUNTRY_MATCH = function (a, n) {
    n = n || 4;
    const inCont = (c) => a.cont === "any" || !a.cont || c.cont.indexOf(a.cont) >= 0;
    let pool = C.filter(inCont);
    if (pool.length < n) pool = C;            // 대륙 안에 4곳이 안 되면 전체에서 채운다
    const scored = pool.map(function (c, i) { return { c: c, s: scoreCountry(c, a), i: i }; });
    scored.sort(function (x, y) { return y.s - x.s || x.i - y.i; });
    const top = scored.slice(0, n);
    const hi = scored[0].s, lo = scored[scored.length - 1].s, span = Math.max(1, hi - lo);
    return top.map(function (o) {
      return {
        country: o.c,
        pct: Math.round(62 + 37 * (o.s - lo) / span),
        reasons: reasonsFor(o.c, a).slice(0, 6),
      };
    });
  };
})();
