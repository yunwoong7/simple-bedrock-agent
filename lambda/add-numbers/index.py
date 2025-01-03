def lambda_handler(event, context):
    try:
        print(f"Received event: {event}")  # 디버깅을 위한 이벤트 로깅
        
        # numbers 파라미터 추출 - 실제 이벤트 구조에 맞게 수정
        properties = event.get('requestBody', {}).get('content', {}).get('application/json', {}).get('properties', [])
        numbers = []
        for prop in properties:
            if prop.get('name') == 'numbers':
                numbers = eval(prop.get('value', '[]'))  # 문자열 "[2, 9]"를 리스트로 변환
                
        if not numbers:
            raise ValueError("No numbers provided")
            
        result = sum(numbers)
        
        response_body = {
            'application/json': {
                'body': result
            }
        }

        action_response = {
            'actionGroup': event.get('actionGroup'),
            'apiPath': event.get('apiPath'),
            'httpMethod': event.get('httpMethod'),
            'httpStatusCode': 200,
            'responseBody': response_body
        }

        session_attributes = event.get('sessionAttributes', {})
        prompt_session_attributes = event.get('promptSessionAttributes', {})

        api_response = {
            'messageVersion': '1.0',
            'response': action_response,
            'sessionAttributes': session_attributes,
            'promptSessionAttributes': prompt_session_attributes
        }
        
        print(f"Returning response: {api_response}")
        return api_response
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        error_response = {
            'messageVersion': '1.0',
            'response': {
                'actionGroup': event.get('actionGroup'),
                'apiPath': event.get('apiPath'),
                'httpMethod': 'POST',
                'httpStatusCode': 400,
                'responseBody': {
                    'application/json': {
                        'schema': {
                            'type': 'object',
                            'properties': {
                                'error': {
                                    'type': 'string'
                                }
                            }
                        },
                        'body': {
                            'error': str(e)
                        }
                    }
                }
            }
        }
        return error_response