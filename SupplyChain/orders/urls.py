from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, create_order, buyer_view_orders

router = DefaultRouter()
router.register(r'orders', OrderViewSet,basename='order')  # Handles CRUD operations for orders

urlpatterns = [
    path('', include(router.urls)),  # Standard DRF router URLs
    path('buyer-view/', buyer_view_orders, name='buyer_view_orders'),
    path('create-order/', create_order, name='create-order'),  # Custom endpoint for order creation
]
