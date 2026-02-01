import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

# Connect to 'postgres' db to check/create 'devconnect_db'
con = psycopg2.connect(dbname='postgres', user='sulthanshafeer', host='localhost', port='5433')
con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = con.cursor()

cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'devconnect_db'")
exists = cur.fetchone()

if not exists:
    print("Database 'devconnect_db' does NOT exist. Creating...")
    cur.execute('CREATE DATABASE devconnect_db')
    print("Database 'devconnect_db' CREATED.")
else:
    print("Database 'devconnect_db' ALREADY EXISTS.")

cur.close()
con.close()
