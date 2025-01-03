import streamlit as st
import boto3
import json
import logging

# Bedrock Agent Runtime 클라이언트 설정
bedrock_agent_runtime = boto3.client('bedrock-agent-runtime', region_name='us-west-2')

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)

# Streamlit 앱 설정
st.title("Bedrock Agent Chat Demo")

# 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []

# 사이드바에 Agent 설정
agent_id = st.sidebar.text_input("Agent ID", value="", help="CDK 배포 후 출력된 Agent ID를 입력하세요")
agent_alias_id = st.sidebar.text_input("Agent Alias ID", value="", help="별칭은 에이전트의 특정 버전을 가리킵니다")

logging.debug(f"Agent ID entered: {agent_id}")
logging.debug(f"Agent Alias ID entered: {agent_alias_id}")

# 채팅 히스토리 표시
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 사용자 입력 처리
if prompt := st.chat_input("메시지를 입력하세요"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    with st.chat_message("user"):
        st.markdown(prompt)

    try:
        # Bedrock Agent 호출
        logging.debug(f"Invoking agent with ID: {agent_id} and Alias ID: {agent_alias_id}")
        response = bedrock_agent_runtime.invoke_agent(
            agentId=agent_id,
            agentAliasId=agent_alias_id,  # 'draft' 또는 사용자가 입력한 alias
            sessionId='demo-session',
            inputText=prompt
        )
        
        # EventStream을 문자열로 처리
        completion_text = ""
        for event in response['completion']:
            chunk = event.get('chunk', {}).get('bytes')
            if chunk:
                completion_text += chunk.decode('utf-8')
        
        with st.chat_message("assistant"):
            st.markdown(completion_text)
            
        st.session_state.messages.append({"role": "assistant", "content": completion_text})
        
    except bedrock_agent_runtime.exceptions.ResourceNotFoundException:
        logging.error(f"ResourceNotFoundException: Agent ID: {agent_id}, Agent Alias ID: {agent_alias_id}")
        st.error("Error: The specified resource does not exist. Please check the Agent ID and Agent Alias ID.")
    except Exception as e:
        logging.error(f"Exception: {str(e)}")
        st.error(f"Error: {str(e)}")
