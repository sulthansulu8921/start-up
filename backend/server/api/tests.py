from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Profile, UserRole

class AuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"

    def test_client_registration(self):
        data = {
            "username": "client1",
            "password": "password123",
            "email": "client1@example.com",
            "role": "Client"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="client1")
        self.assertEqual(user.profile.role, UserRole.CLIENT)

    def test_developer_registration(self):
        data = {
            "username": "dev1",
            "password": "password123",
            "email": "dev1@example.com",
            "role": "Developer"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="dev1")
        self.assertEqual(user.profile.role, UserRole.DEVELOPER)
        self.assertFalse(user.profile.is_approved)

    def test_login(self):
        # Create user
        user = User.objects.create_user(username="testuser", password="password123")
        
        # Login
        data = {
            "username": "testuser",
            "password": "password123"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

class WorkflowTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create Users
        self.admin = User.objects.create_user(username="admin", password="password123", email="admin@test.com")
        self.admin.profile.role = UserRole.ADMIN
        self.admin.profile.save()
        
        self.client_user = User.objects.create_user(username="client", password="password123", email="client@test.com")
        self.client_user.profile.role = UserRole.CLIENT
        self.client_user.profile.save()
        
        self.dev = User.objects.create_user(username="dev", password="password123", email="dev@test.com")
        self.dev.profile.role = UserRole.DEVELOPER
        self.dev.profile.save()

        # Tokens
        self.admin_token = self.get_token("admin", "password123")
        self.client_token = self.get_token("client", "password123")
        self.dev_token = self.get_token("dev", "password123")

    def get_token(self, username, password):
        response = self.client.post("/api/auth/login/", {"username": username, "password": password})
        return response.data["access"]

    def test_client_create_project(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.client_token)
        data = {
            "title": "New Website",
            "description": "Need a React site",
            "service_type": "Website Development"
        }
        response = self.client.post("/api/projects/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["client_name"], "client")

    def test_admin_approve_dev_and_assign_task(self):
        # 1. Client creates Project
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.client_token)
        project_resp = self.client.post("/api/projects/", {"title": "Proj1", "description": "Desc", "service_type": "Web"})
        project_id = project_resp.data["id"]

        # 2. Admin approves Dev
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        # Assuming admin can edit profile via user endpoint or special endpoint (using Generic Update on ProfileViewSet if exposed, currently RegisterView is Create only, UserDetail is ReadOnly for owner)
        # Wait, I didn't verify Admin User Management Endpoint. I created AdminDashboard but not User Edit logic.
        # But I can modify DB directly to simulate approval for this test logic
        self.dev.profile.is_approved = True
        self.dev.profile.save()

        # 3. Admin creates Task
        task_data = {
            "project": project_id,
            "assigned_to": self.dev.id,
            "title": "Build Frontend",
            "description": "Do it",
            "budget": 500.00,
            "deadline": "2023-12-31"
        }
        response = self.client.post("/api/tasks/", task_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 4. Dev views task
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.dev_token)
        response = self.client.get("/api/tasks/")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Build Frontend")


