from django.urls import path
from .views import ProductDetailsView, ProductDetailView

urlpatterns = [
    path('products/', ProductDetailsView.as_view(), name='product-list'),  # List all products or create a new one
    path('products/<str:product_id>/', ProductDetailView.as_view(), name='product-detail'),  # Get a specific product by ID
]
