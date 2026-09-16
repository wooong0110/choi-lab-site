# KNU Drug Delivery Lab 홈페이지 관리 안내

[https://wooong0110.github.io/choi-lab-site/](https://wooong0110.github.io/choi-lab-site)
경북대학교 의과대학 면역학교실 · 최지웅(Jiwoong Choi) 교수님 연구실 홈페이지입니다. 이 문서는 **컴퓨터를 잘 몰라도** 홈페이지를 직접 고칠 수 있도록 만든 사용설명서예요.

------------------------------------------------------------------------

## 🧭 한눈에 보는 큰 그림

홈페이지 고치는 과정은 딱 **두 단계**입니다.

1.  **수정하기** — 코드를 직접 건드리지 않습니다. 대신 **AI 도우미에게 한국어로 부탁**하면 AI가 파일을 알아서 고쳐줍니다.
2.  **게시하기** — **GitHub Desktop**이라는 프로그램에서 버튼 두 개(Commit → Push)를 누르면 실제 홈페이지에 반영됩니다.

------------------------------------------------------------------------

## 👀 미리보기 (고치기 전/후 확인)

`index.html` 파일을 마우스로 더블클릭하면 인터넷 창(크롬 등)에서 홈페이지가 열립니다. 수정한 뒤에도 같은 방법으로 열어서 잘 바뀌었는지 눈으로 확인할 수 있어요. (지도 같은 일부 화면은 인터넷이 연결돼 있어야 보입니다.)

------------------------------------------------------------------------

## ✍️ 자주 하는 수정 — 그대로 복사해서 AI 도우미에 붙여넣으세요

아래 예시의 **굵은 글씨 부분만 실제 내용으로 바꿔서** AI 도우미에 붙여넣으면 됩니다.

### 1) 새 논문 추가하기

```
publications-data.js 파일 맨 위에 아래 논문을 새로 추가해줘.
- 제목: Example title of the new paper.
- 저자: B Park, J Choi, JH Lee   (우리 랩 저자 J Choi 는 굵게)
- 저널: Nature Communications
- 연도: 2026
- 출판 당시 JCR IF: 9.1 (JCR 2024)
- 교수님 저자 역할: 공동 1저자
- DOI 링크: https://doi.org/10.xxxx/xxxxx
```

> 논문은 최신 것이 맨 위로 오도록 넣으면 되고, 번호 매기기와 페이지 나누기는 자동으로 됩니다. DOI 링크(<https://doi.org/>... 형태)를 넣으면 제목을 클릭했을 때 원문으로 이동합니다. DOI를 모르면 "이 논문 제목으로 DOI 찾아서 링크까지 넣어줘" 라고 부탁해도 됩니다.

### 2) 논문 내용 수정하거나 삭제하기

```
publications-data.js 에서 "Light-triggered PROTAC..." 로 시작하는 논문의
저널 이름을 Advanced Materials 로 바꿔줘.
```

```
publications-data.js 에서 2021년 ACS Nano 논문을 목록에서 삭제해줘.
```

### 3) 구성원(대학원생) 추가하기

```
members.html 의 "Graduate Students" 섹션에 새 학생 카드를 추가해줘.
- 이름: 홍길동 (Gildong Hong)
- 과정: 석사과정 (M.S. Student)
- 학력: 2026– 경북대학교 의학과 석사과정
현재 있는 "We are hiring!" 모집 카드는 그대로 맨 뒤에 남겨줘.
```

> 학생 사진을 함께 넣고 싶으면, 사진 파일을 `assets/img` 폴더에 넣은 뒤 "사진은 assets/img/mem_hong.jpg 를 써줘" 라고 한 줄 덧붙이면 됩니다. 사진이 없으면 지금처럼 이니셜 글자(예: JP)가 표시됩니다.

### 4) 교수님 소개(Principal Investigator) 수정하기

`members.html` 맨 위 **Principal Investigator** 칸에 교수님 학력·경력이 들어가 있습니다. 아래처럼 부탁하세요.

```
members.html 의 Principal Investigator 학력·경력 목록에 아래 한 줄을 추가해줘.
- 2026 | OO학회 우수논문상 수상
```

### 5) 사진 넣기 (교수님 사진, 구성원 사진)

```
① 사진 파일을 assets/img 폴더에 넣기 (예: choi.png, mem_hong.jpg)
② AI 도우미에게: "members.html 의 PI 사진을 assets/img/choi.png 로 넣어줘."
```

### 6) 글자·메뉴·문구 바꾸기

```
index.html 첫 화면 소개 문구를 아래 내용으로 바꿔줘.
"우리 연구실은 ○○○ 을 연구합니다..."
```

```
contact.html 의 이메일 주소를 abc@knu.ac.kr 로 바꿔줘.
```

### 7) 색상 바꾸기

```
사이트 전체 강조 색을 지금 색에서 조금 더 진한 남색 계열로 바꿔줘.
styles.css 맨 위 :root 의 색상 값만 조정하면 돼.
```

> 팁: 무엇을 바꿀지 애매하면 **"○○ 부분을 △△ 하게 바꾸고 싶어. 어떻게 하면 될까?"** 라고 물어봐도 됩니다. AI가 방법을 알려주거나 대신 고쳐줍니다.

------------------------------------------------------------------------

## 📷 Gallery에 연구실 소식·사진 올리기

**대표 사진 + 날짜·제목 + 추가 사진 그리드**로 표시합니다. 사진은 사이트에서 직접 불러오며, 클릭하면 주소 이동 없이 확대됩니다. 닫기 버튼이나 Esc 키로 돌아옵니다.

1. 사진을 assets/img/gallery/행사폴더/에 추가합니다.
2. assets/js/gallery-data.js의 images 배열에 사이트 내부 경로를 넣습니다. 첫 사진이 대표 사진입니다.
3. 제목·날짜·본문을 확인하고 Commit → Push로 반영합니다.

영상은 글의 `videos` 배열에 `{src: "assets/img/gallery/event/clip.mp4", webm: "assets/img/gallery/event/clip.webm", poster: "assets/img/gallery/event/clip-poster.jpg"}` 형식으로 추가합니다. MP4는 H.264/AAC, 선택 항목인 WebM은 VP9/Opus를 사용합니다. 영상은 재생 버튼을 누를 때 불러옵니다.

한국어 제목·본문은 titleKo, bodyKo에 넣습니다. Google Drive 링크도 지원하지만 공유 권한과 외부 이미지 로딩 정책에 영향을 받으므로 사이트 내부 사진을 권장합니다.

------------------------------------------------------------------------

## 🚀 GitHub Desktop으로 실제 홈페이지에 반영하기

AI 도우미로 수정을 마쳤으면, 이제 인터넷의 진짜 홈페이지에 올릴 차례입니다.

1.  **GitHub Desktop** 프로그램을 엽니다.
2.  왼쪽 **Changes** 탭에 방금 바뀐 파일들이 보입니다. (자동으로 잡힙니다)
3.  왼쪽 아래 **Summary** 칸에 무엇을 바꿨는지 짧게 한 줄 적습니다. 예) `2026년 논문 1편 추가` / `석사과정 홍길동 추가`
4.  파란색 **Commit to main** 버튼을 누릅니다.
5.  위쪽의 **Push origin**(또는 Push) 버튼을 누릅니다. → 이걸 눌러야 진짜 인터넷에 올라갑니다.
6.  1\~2분 뒤 홈페이지 주소를 새로고침하면 반영돼 있습니다.

> ⚠️ **Push origin 을 눌러야** 실제 사이트가 바뀝니다. Commit 만 하면 내 컴퓨터에만 저장됩니다.

------------------------------------------------------------------------

## 🆘 문제가 생기면

- **뭔가 이상하게 바뀌었다** → AI 도우미에게 "방금 바꾼 것 되돌려줘" 라고 하거나, GitHub Desktop 의 바뀐 파일에서 마우스 오른쪽 → **Discard changes**(변경 취소)를 누르면 됩니다. (단, 이미 Commit/Push 하기 전이어야 합니다.)
- **화면이 깨져 보인다** → 대개 인터넷 연결 문제이거나 잠깐 기다리면 반영됩니다. 그래도 이상하면 AI 도우미에게 스크린샷과 함께 물어보세요.

------------------------------------------------------------------------

## 📁 파일 구조 (참고용 — 몰라도 됩니다)

```
choi-lab/
├─ index.html          # Home (첫 화면 · 연구 소개)
├─ members.html        # Members (PI · 대학원생)
├─ publications.html   # Publications (논문 목록)
├─ lab-gallery.html    # Gallery (연구실 소식 · 사진)
├─ contact.html        # Contact (연락처 · 지도)
└─ assets/
   ├─ css/styles.css           # 전체 디자인 · 색상
   ├─ img/                      # 로고 · 사진 파일 넣는 곳
   │   ├─ choi.png              #   PI 사진
   │   └─ KNUmed.jpg            #   경북대 의대 사진
   └─ js/
      ├─ main.js                # 공통 기능 (메뉴 · 페이지 넘김)
      ├─ publications-data.js   # ★ 논문 목록 데이터 (논문은 여기만 고침)
      ├─ gallery-data.js        # ★ 연구실 소식·사진 데이터
      ├─ render-gallery.js      # Gallery 카드 표시
      └─ render-pubs.js         # 논문 화면에 그리는 부분 (건드릴 필요 없음)
```

상단 메뉴는 **Home · Members · Publications · Gallery · Note · Contact**입니다. Publications는 연구실의 출판 논문, Note는 관련 분야 최신논문 카드뉴스입니다.

## 최신논문 카드뉴스 (Note)

`note.html`은 [참고 사이트의 Note](https://github.com/kkonoo/halab-site/blob/main/note.html)와 같은 카드 구성으로 만들었습니다. 카드 CSS와 렌더러를 이 사이트의 테마 및 JSON 형식에 맞게 조정했습니다.

- **Recent 3 months**: 방문일에서 달력 기준 3개월 전 같은 날짜 이후의 주차. 월말은 해당 월의 마지막 날로 맞춥니다.
- **Archive**: 그 이전 주차를 연도 → 분기 → 주차 순으로 선택합니다. 기간 구분은 표시만 바꾸며 과거 데이터를 삭제하지 않습니다.
- 주차 안에서 분야 필터·검색, 관련도 순 상위 10편·더 보기, 카드 상세 펼치기, DOI/PubMed 링크를 지원합니다.
- 검색 범위와 수집 한계는 원본 JSON의 `notice` 그대로 표시합니다. 별점은 연구실 관련도이며, 적용 제안은 추론입니다.

### JSON 추가 → 사이트 반영

Node.js로 저장소에서 실행합니다. 별도 패키지 설치는 필요 없습니다.

```powershell
# 드라이브의 모든 주차를 병합 (이전 사이트 주차도 보존)
node scripts/publish-cardnews.mjs "G:/내 드라이브/choi-lab/cardnews-kit/runs"

# 한 주만 추가하거나 수정할 때
node scripts/publish-cardnews.mjs "G:/내 드라이브/choi-lab/cardnews-kit/runs/2026-09-15.json"

# 변경 없이 검증
node scripts/publish-cardnews.mjs "G:/내 드라이브/choi-lab/cardnews-kit/runs" --dry-run

# 사이트에 보관된 JSON만으로 다시 생성
node scripts/publish-cardnews.mjs
```

`node`를 찾지 못하면 이 컴퓨터에서는 `C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`를 사용합니다.

원본은 `assets/data/cardnews/YYYY-MM-DD.json`에 보관되고, 페이지가 읽는 `assets/js/cards-data.js`가 자동 생성됩니다. **cards-data.js는 직접 수정하지 마세요.** 같은 날짜의 입력은 해당 주차를 갱신하며, 다른 날짜는 그대로 보존합니다. 입력 전체를 검증한 후 저장하므로 JSON 오류가 있으면 기존 결과를 바꾸지 않습니다.

JSON 형식은 `assets/data/cardnews/2026-09-15.json`을 참고합니다. 최상위는 `date`, `count`, `notice`, `papers`이고, `count`는 실제 편수와 같아야 합니다. 논문별 `title`과 정수 `rating`(0–5)이 필수입니다. DOI는 `10.…`와 `https://doi.org/…`를 모두 지원합니다.

카드를 펼치면 Abstract → 한글 요약 → 상세 항목 순으로 표시됩니다. `what_they_did` 배열은 bullet 없이 일반 문장으로 합칩니다. 원문 초록의 짧은 발췌는 `abstract_excerpt`, 출처는 `abstract_url`에 저장합니다. 사용자가 직접 제공하거나 재사용 허가가 확인된 전문은 `abstract`에 넣으면 전문이 우선 표시됩니다. 현재 29편은 PubMed의 논문별 원문 25단어 이내 발췌와 전체 초록 링크를 포함합니다.

2026-09-16에 기존 월요일 오후 2시 예약 작업을 **JSON 저장 → 읽기용 HTML 생성 → 사이트 데이터 병합** 흐름으로 갱신했습니다. 자동 게시와 git push는 하지 않습니다. 완료 후 GitHub Desktop에서 변경 내용을 검토하고 **Commit → Push origin**하면 사이트에 반영됩니다. 최초 Note 추가 시 HTML·CSS·JS도 함께 올리고, 이후 매주 갱신은 JSON과 cards-data.js를 함께 올립니다.

검증: `node --test scripts/publish-cardnews.test.mjs` (과거 데이터 보존, 재실행, 잘못된 입력, 월말 경계, Archive 선택, 링크·문자열 처리).
