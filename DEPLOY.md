# GitHub 저장소 푸시 방법

저장소: https://github.com/dariwoos-pixel/260311

## 최초 1회 (로컬에서 실행)

프로젝트 폴더에서 터미널을 연 뒤:

```bash
git init
git remote add origin https://github.com/dariwoos-pixel/260311.git
git add .
git commit -m "Initial commit: 로또 번호 추천 서비스"
git branch -M main
git push -u origin main
```

## 이후 업데이트 푸시

코드 수정 후:

```bash
git add .
git commit -m "변경 내용 요약"
git push
```

Git이 설치되어 있지 않다면 [Git 다운로드](https://git-scm.com/download/win)에서 설치한 뒤 위 명령을 실행하면 됩니다.
