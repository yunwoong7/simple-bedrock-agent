<h2 align="center">
Simple bedrock agent demo
</h2>

<div align="center">
  <img src="https://img.shields.io/badge/python-v3.12.7-blue.svg"/>
  <img src="https://img.shields.io/badge/boto3-v1.35.91-blue.svg"/>
  <img src="https://img.shields.io/badge/streamlit-v1.41.1-blue.svg"/>
</div>

이 프로젝트는 AWS Bedrock Agent를 사용하여 간단한 덧셈 계산기를 구현한 데모입니다. CDK를 사용하여 인프라를 구성하고, Streamlit으로 사용자 인터페이스를 제공합니다.

## 주요 기능
- AWS Bedrock Agent를 통한 자연어 기반 덧셈 계산
- Lambda 함수를 통한 계산 처리
- Streamlit 웹 인터페이스

## 프로젝트 구조
```
.
├── lib/
│   ├── simple-bedrock-agent-stack.ts    # CDK 스택 정의
│   └── schemas/
│       └── math-operations.yaml         # OpenAPI 스키마
├── lambda/
│   └── add-numbers/
│       └── index.py                     # Lambda 함수
├── demo/
│   └── app.py                           # Streamlit 애플리케이션
└── .devcontainer/
    └── devcontainer.json                # 개발 환경 설정
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
```

## 주요 구성 요소

### Bedrock Agent
- Claude 3 Sonnet 모델 사용
- 자연어 처리 및 수학 계산 지원
- Action Group을 통한 Lambda 함수 연동

### Lambda 함수
- 숫자 덧셈 기능 제공
- API 응답 형식 준수
- 에러 처리 포함

### Streamlit 인터페이스
- 직관적인 채팅 인터페이스
- Agent ID 및 Alias 설정 기능
- 실시간 응답 표시

## 개발 환경
- DevContainer 사용
- AWS 자격 증명 자동 마운트
- 필요한 도구 자동 설치