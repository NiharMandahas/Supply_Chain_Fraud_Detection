from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['OrderID', 'UserID', 'Email', 'PaymentMethod', 'CreatedAt']
    list_filter = ['PaymentMethod', 'CreatedAt']
    search_fields = ['UserID', 'Email', 'Phone']
    readonly_fields = ['CreatedAt']

