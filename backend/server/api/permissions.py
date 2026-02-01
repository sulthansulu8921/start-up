from rest_framework import permissions
from .models import UserRole

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and \
               (request.user.is_staff or request.user.profile.role == UserRole.ADMIN)

class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and \
               request.user.profile.role == UserRole.CLIENT

class IsDeveloper(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and \
               request.user.profile.role == UserRole.DEVELOPER and \
               request.user.profile.is_approved
