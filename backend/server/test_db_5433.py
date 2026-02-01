import psycopg2
import sys

# The logs showed process is running as 'sulthanshafeer'
# Homebrew postgres often uses the system username as the default db user
configs = [
    {'user': 'sulthanshafeer', 'password': '', 'port': 5433, 'dbname': 'postgres'}, 
    {'user': 'sulthanshafeer', 'password': '', 'port': 5433, 'dbname': 'template1'},
    {'user': 'postgres', 'password': '', 'port': 5433, 'dbname': 'postgres'},
]

for config in configs:
    try:
        print(f"Testing: user='{config['user']}' db='{config['dbname']}' port={config['port']}...")
        conn = psycopg2.connect(
            dbname=config['dbname'],
            user=config['user'],
            password=config['password'],
            host='localhost',
            port=config['port']
        )
        print(f"SUCCESS: Connected with user='{config['user']}'")
        conn.close()
        sys.exit(0)
    except Exception as e:
        print(f"FAILED: user='{config['user']}' - {e}")
