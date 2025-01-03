import json
import os
import requests

def lambda_handler(event, context):
    try:
        print(f"Received event: {event}")
        
        # Brave Search API 설정
        api_key = os.environ['BRAVE_API_KEY']
        base_url = "https://api.search.brave.com/res/v1/web/search"
        
        # 검색어 추출
        properties = event.get('requestBody', {}).get('content', {}).get('application/json', {}).get('properties', [])
        query = ""
        for prop in properties:
            if prop.get('name') == 'query':
                query = prop.get('value', '')
        
        if not query:
            raise ValueError("No search query provided")
            
        # API 호출
        headers = {
            'Accept': 'application/json',
            'X-Subscription-Token': api_key
        }
        
        params = {
            'q': query,
            'count': 5  # 상위 5개 결과만 반환
        }
        
        response = requests.get(base_url, headers=headers, params=params)
        search_results = response.json()
        
        # 결과 형식화
        formatted_results = []
        for result in search_results.get('web', {}).get('results', []):
            formatted_results.append({
                'title': result.get('title', ''),
                'description': result.get('description', ''),
                'url': result.get('url', '')
            })
        
        response_body = {
            'application/json': {
                'body': formatted_results
            }
        }
        
        api_response = {
            'messageVersion': '1.0',
            'response': {
                'actionGroup': event.get('actionGroup'),
                'apiPath': event.get('apiPath'),
                'httpMethod': event.get('httpMethod'),
                'httpStatusCode': 200,
                'responseBody': response_body
            },
            'sessionAttributes': event.get('sessionAttributes', {}),
            'promptSessionAttributes': event.get('promptSessionAttributes', {})
        }
        
        return api_response
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {
            'messageVersion': '1.0',
            'response': {
                'actionGroup': event.get('actionGroup'),
                'apiPath': event.get('apiPath'),
                'httpMethod': 'POST',
                'httpStatusCode': 400,
                'responseBody': {
                    'application/json': {
                        'body': {
                            'error': str(e)
                        }
                    }
                }
            }
        }