# Supabase로 로또 추첨 번호 저장하기

추첨한 번호(6개 + 보너스)를 Supabase 테이블에 자동으로 저장하는 방법입니다.

---

## 1. Supabase 프로젝트 만들기

1. [Supabase](https://supabase.com)에 로그인 후 **New project**로 프로젝트 생성
2. 프로젝트가 준비되면 왼쪽 메뉴 **Project Settings** → **API** 이동
3. 아래 두 값을 복사해 둡니다:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키 (비밀 키가 아님, 공개용 키)

---

## 2. 테이블 생성

Supabase 대시보드에서 **SQL Editor**를 연 뒤, 아래 SQL을 붙여넣고 **Run** 실행합니다.

```sql
-- 로또 추첨 기록 테이블
create table public.lotto_draws (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  main smallint[] not null,   -- 번호 6개 (예: {1,7,12,23,33,41})
  bonus smallint not null      -- 보너스 번호 (1~45)
);

-- 익명 사용자도 추첨 기록 저장·조회 가능하도록 RLS 정책 설정
alter table public.lotto_draws enable row level security;

create policy "Allow anonymous insert"
  on public.lotto_draws for insert
  to anon with check (true);

create policy "Allow anonymous select"
  on public.lotto_draws for select
  to anon using (true);
```

---

## 3. 설정 넣기 (둘 중 하나 선택)

### A. Vercel 배포 시 (권장)

1. [Vercel](https://vercel.com) 대시보드에서 해당 프로젝트 선택
2. **Settings** → **Environment Variables** 이동
3. 아래 두 개 추가:

| Name | Value | 환경 |
|------|--------|------|
| `SUPABASE_URL` | Supabase Project URL (예: `https://xxxxx.supabase.co`) | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | Supabase **anon public** 키 | Production, Preview, Development |

4. 저장 후 **Redeploy** 한 번 실행

배포된 사이트는 `/api/config`에서 위 값을 읽어와 사용합니다. `index.html`에 URL/키를 적지 않아도 됩니다.

### B. 로컬 또는 정적 호스팅 시

`index.html`을 열어 **스크립트 상단**의 Supabase 설정을 채웁니다.

```javascript
const SUPABASE_URL = 'https://여기프로젝트.supabase.co';
const SUPABASE_ANON_KEY = '여기_anon_키_붙여넣기';
```

로컬에서 Vercel API를 쓰려면 터미널에서 `vercel dev` 실행 후 접속하면 됩니다.

---

저장이 잘 되면, 추첨이 끝날 때마다 Supabase `lotto_draws` 테이블에 한 줄씩 추가됩니다.

---

## 4. 저장되는 데이터 형식

| 컬럼      | 타입        | 설명                    |
|-----------|-------------|-------------------------|
| `id`      | uuid        | 자동 생성 고유 ID       |
| `created_at` | timestamptz | 저장 시각 (자동)     |
| `main`    | smallint[]  | 본 번호 6개 (오름차순) |
| `bonus`   | smallint    | 보너스 번호 (1~45)     |

한 번에 여러 세트를 추첨하면, 세트마다 행이 하나씩 추가됩니다.

---

## 5. 저장된 데이터 확인

- Supabase 대시보드 → **Table Editor** → `lotto_draws` 테이블 선택
- 또는 SQL Editor에서:

```sql
select * from public.lotto_draws order by created_at desc;
```

---

## 참고

- **anon 키**는 프론트엔드에 노출돼도 되는 공개 키입니다. 비밀 키(service_role)는 절대 프론트에 넣지 마세요.
- RLS 정책을 바꾸면 익명 사용자의 insert/select를 제한할 수 있습니다 (예: 로그인 사용자만 저장 등).
