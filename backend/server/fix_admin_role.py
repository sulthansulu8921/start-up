import os
import django
import sys

sys.path.append('/Users/sulthanshafeer/Desktop/startup/backend/server')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Profile, UserRole

# Find all superusers
superusers = User.objects.filter(is_superuser=True)

for user in superusers:
    try:
        profile = user.profile
        if profile.role != UserRole.ADMIN:
            print(f"Updating user '{user.username}' role from '{profile.role}' to '{UserRole.ADMIN}'")
            profile.role = UserRole.ADMIN
            profile.save()
        else:
            print(f"User '{user.username}' is already an Admin.")
    except Profile.DoesNotExist:
        print(f"User '{user.username}' has no profile. Creating one as Admin.")
        Profile.objects.create(user=user, role=UserRole.ADMIN)

print("Done updating superuser roles.")
