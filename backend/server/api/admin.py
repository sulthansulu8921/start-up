from django.contrib import admin
from .models import Profile, Project, Task, Message, Payment

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'is_approved', 'created_at')
    list_filter = ('role', 'is_approved')
    search_fields = ('user__username', 'user__email')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'service_type', 'status', 'created_at')
    list_filter = ('status', 'service_type')
    search_fields = ('title', 'client__username')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'assigned_to', 'status', 'deadline')
    list_filter = ('status',)
    search_fields = ('title', 'project__title', 'assigned_to__username')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'created_at')
    search_fields = ('sender__username', 'receiver__username', 'content')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payer', 'payee', 'amount', 'payment_type', 'status', 'created_at')
    list_filter = ('status', 'payment_type')

