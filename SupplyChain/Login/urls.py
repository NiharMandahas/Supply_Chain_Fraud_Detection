from django.urls import path
from .views import register_user, LoginView

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
