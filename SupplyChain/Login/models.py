# models.py
from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class LoginDetails(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Will store hashed password
    role = models.CharField(max_length=255)
    last_login = models.DateTimeField(null=True, blank=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.email

    class Meta:
        db_table = "LoginDetails"

class BuyerDetails(models.Model):
    email = models.EmailField()  # Remove unique constraint temporarily
    name = models.CharField(max_length=255, null=True)
    buyer_id = models.CharField(max_length=255, primary_key=True)  # Remove unique constraint temporarily
    login = models.OneToOneField(
        LoginDetails, 
        on_delete=models.CASCADE, 
        related_name='buyer_profile',
        null=True
    )

    def __str__(self):
        return f"{self.name} ({self.email})"

    class Meta:
        db_table = "BuyerDetails"

class SellerDetails(models.Model):
    email = models.EmailField()  # Remove unique constraint temporarily
    name = models.CharField(max_length=255, null=True)
    seller_id = models.CharField(max_length=255, primary_key=True)  # Remove unique constraint temporarily
    login = models.OneToOneField(
        LoginDetails, 
        on_delete=models.CASCADE, 
        related_name='seller_profile',
        null=True
    )

    def __str__(self):
        return f"{self.name} ({self.email})"

    class Meta:
        db_table = "SellerDetails"