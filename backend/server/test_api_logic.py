import os
import django
import sys
import json

sys.path.append('/Users/sulthanshafeer/Desktop/startup/backend/server')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from api.models import ProjectApplication, UserRole
from api.serializers import ProjectApplicationSerializer
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory

# Get Admin User
admin = User.objects.get(username='sulthan')
print(f"Testing as user: {admin.username}, Role: {admin.profile.role}")

# Test Queryset
apps = ProjectApplication.objects.all()
print(f"Total Applications: {apps.count()}")

# Test Serializer
serializer = ProjectApplicationSerializer(apps, many=True)
try:
    data = serializer.data
    print("Serialization Successful.")
    print(json.dumps(data, default=str)[:500]) # Print first 500 chars
except Exception as e:
    print(f"Serialization Failed: {e}")
