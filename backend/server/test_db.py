import psycopg2
import sys

configs = [
    {'user': 'sulthanshafeer', 'password': '', 'port': 5432}, # System user
    {'user': 'postgres', 'password': '', 'port': 5432},
    {'user': 'postgres', 'password': 'password', 'port': 5432},
    {'user': 'sulthanshafeer', 'password': 'password', 'port': 5432},
]

for config in configs:
    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user=config['user'],
            password=config['password'],
            host='localhost',
            port=config['port']
        )
        print(f"SUCCESS: Connected with user='{config['user']}' password='{config['password']}' port={config['port']}")
        conn.close()
        sys.exit(0)
    except Exception as e:
        print(f"FAILED: user='{config['user']}' password='{config['password']}' - {e}")
