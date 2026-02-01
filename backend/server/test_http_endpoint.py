import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

# 1. Login
login_url = f"{BASE_URL}/auth/login/"
creds = {'username': 'sulthan', 'password': 'sulthan'} # Created in previous step
try:
    print(f"Logging in to {login_url}...")
    resp = requests.post(login_url, json=creds)
    if resp.status_code != 200:
        print(f"Login failed: {resp.status_code} {resp.text}")
        exit(1)
    
    token = resp.json().get('access')
    print("Login successful. Token obtained.")
except Exception as e:
    print(f"Login request failed: {e}")
    exit(1)

# 2. Fetch Applications
headers = {'Authorization': f'Bearer {token}'}
apps_url = f"{BASE_URL}/applications/"
print(f"Fetching {apps_url}...")
try:
    resp = requests.get(apps_url, headers=headers)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")
except Exception as e:
    print(f"Fetch failed: {e}")
