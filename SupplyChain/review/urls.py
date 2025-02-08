from django.urls import path
from .views import ProductReviewsView

urlpatterns = [
    path('item-reviews/<str:product_id>/', ProductReviewsView.as_view(), name='product-reviews-get'),
    path('item-reviews/', ProductReviewsView.as_view(), name='product-reviews-post'),
]

