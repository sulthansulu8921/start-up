import os
import django
import sys

# Add the project directory to the sys.path
sys.path.append('/Users/sulthanshafeer/Desktop/startup/backend/server')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from django.contrib.auth.models import User
users = list(User.objects.filter(is_superuser=True).values_list('username', flat=True))
print(f"SUPERUSERS_FOUND: {users}")
