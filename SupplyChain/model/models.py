from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


# class LoginDetails(AbstractBaseUser):
#     email = models.EmailField(primary_key=True, max_length=255, unique=True)
#     role = models.CharField(
#         max_length=10,
#         choices=[('buyer', 'Buyer'), ('seller', 'Seller')],
#         default='buyer'
#     )
#     password = models.CharField(max_length=255)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     last_login = models.DateTimeField(null=True)

#     objects = UserManager()

#     USERNAME_FIELD = 'email'

#     class Meta:
#         managed = False
#         db_table = 'logindetails'

#     def __str__(self):
#         return f"{self.email} ({self.role})"


class SellerDetails(models.Model):
    seller_id = models.CharField(max_length=255, primary_key=True, db_column='Seller_ID')
    email = models.CharField(max_length=255,db_column='Email')
    seller_name = models.CharField(max_length=255, db_column='Name')
    account_age_months = models.FloatField(default=0, db_column='Account_Age')
    return_rate_per_100 = models.FloatField(default=0, db_column='Products_Returned_to_Sold')
    fulfillment_rate = models.FloatField(default=0, db_column='Order_Fullfilment')
    delay_rate = models.FloatField(default=0, db_column='Delayed_Rate')
    cancelled_rate = models.FloatField(default=0, db_column='Cancelled_Rate')
    category = models.CharField(max_length=50, db_column='Category')
    no_payments = models.IntegerField(default=0, db_column='No_Payments')
    # created_at = models.DateTimeField(default=timezone.now)
    # updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'sellerdetails'
        # ordering = ['-created_at']

    def __str__(self):
        return f"{self.seller_name} ({self.seller_id})"


# class PredictionLog(models.Model):
#     seller = models.ForeignKey(
#         SellerDetails,
#         on_delete=models.CASCADE,
#         db_column='seller_id',
#         to_field='seller_id'
#     )
#     prediction_result = models.FloatField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         managed = True
#         db_table = 'prediction_logs'

#     def __str__(self):
#         return f"Prediction for {self.seller.seller_name} at {self.created_at}"


# class SellerComments(models.Model):
#     seller = models.ForeignKey(
#         SellerDetails,
#         on_delete=models.CASCADE,
#         db_column='seller_id',
#         to_field='seller_id',
#         related_name='comments'
#     )
#     text = models.TextField()
#     created_at = models.DateTimeField(default=timezone.now)

#     class Meta:
#         managed = True
#         db_table = 'seller_comments'

#     def __str__(self):
#         return f"Comment for Seller {self.seller.seller_name}: {self.text[:50]}..."