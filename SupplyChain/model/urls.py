

from django.urls import path
from . import views
from .views import get_seller_details

urlpatterns = [
    path('predict-seller-score/', views.predict_seller_score, name='predict_seller_score'),
    path('sellerdata/<str:seller_id>/', get_seller_details, name='get_seller_details'),

]
