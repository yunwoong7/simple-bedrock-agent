<h2 align="center">
Simple bedrock agent demo
</h2>

<div align="center">
  <img src="https://img.shields.io/badge/python-v3.12.7-blue.svg"/>
  <img src="https://img.shields.io/badge/boto3-v1.35.91-blue.svg"/>
  <img src="https://img.shields.io/badge/streamlit-v1.41.1-blue.svg"/>
</div>

AWS Bedrock Agent를 사용하여 덧셈 계산과 웹 검색(Brave Search)을 수행하는 데모 프로젝트입니다. CDK를 사용하여 인프라를 구성하고, Streamlit으로 사용자 인터페이스를 제공합니다.

## 주요 기능
- 자연어로 덧셈 계산 요청
- Brave Search API를 이용한 웹 검색
- 3Streamlit 기반의 대화형 인터페이스

## 환경변수 설정

* .env 파일 생성

```shell
echo "BRAVE_API_KEY=your-api-key-here" > .env
```

## 프로젝트 구조
```bash
.
├── lib/
│   ├── simple-bedrock-agent-stack.ts
│   └── schemas/
│       ├── math-operations.yaml
│       └── search-operations.yaml
├── lambda/
│   ├── add-numbers/
│   │   └── index.py
│   └── brave-search/
│       └── index.py
├── lambda-layer/
│   └── requests/
│       └── python/
│           └── requests/
├── demo/
│   └── app.py
└── .env
```

## 설치 및 실행

1. 개발 환경 설정
```bash
npm install -g aws-cdk
pip install streamlit boto3
```

2. CDK 배포
```bash
cdk deploy
```

3. Streamlit 앱 실행
```bash
cd demo
streamlit run app.py
```

## 사용 예시
```
사용자: "2 더하기 5"
Agent: "2 더하기 5는 7입니다"

사용자: "AWS Bedrock에 대해 검색해줘"
Agent: [Brave Search 결과 표시]
```

## 주요 구성 요소

### Bedrock Agent
- Claude 3 Sonnet 모델 사용
- 수학 계산 및 웹 검색 Action Group 구성
- Action Group을 통한 Lambda 함수 연동

### Lambda 함수
- 덧셈 계산 함수
- Brave Search API 연동 함수
- requests Lambda Layer 사용

### Streamlit 인터페이스
- 직관적인 채팅 인터페이스
- Agent ID 및 Alias 설정 기능
- 실시간 응답 표시

## 개발 환경
- DevContainer 사용
- AWS 자격 증명 자동 마운트
- 필요한 도구 자동 설치