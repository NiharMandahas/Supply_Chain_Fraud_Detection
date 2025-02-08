from django.urls import path
from .views import buyer_fraud_prediction

urlpatterns = [
    path('buyer_fraud_model/', buyer_fraud_prediction, name='buyer_fraud'),
]
