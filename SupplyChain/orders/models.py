from django.db import models
from django.utils import timezone
import uuid

class Order(models.Model):
    OrderID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    UserID = models.CharField(max_length=255)
    Email = models.EmailField()
    Phone = models.CharField(max_length=20)
    Address = models.CharField(max_length=500)
    PaymentMethod = models.CharField(max_length=50)
    PaymentInformation = models.CharField(max_length=255)
    CreatedAt = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'orders'
        ordering = ['-CreatedAt']

    def __str__(self):
        return f"Order {self.OrderID} - {self.UserID}"

class OrderDetails(models.Model):
    OrderDetailID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Change the foreign key field name to match database column
    order = models.ForeignKey(
        Order, 
        db_column='OrderID',  # Specify the exact column name in the database
        to_field='OrderID',   # Reference the OrderID field in Order model
        on_delete=models.CASCADE, 
        related_name="order_items"
    )
    ProductID = models.CharField(max_length=255)
    SellerID = models.CharField(max_length=255)
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    Quantity = models.IntegerField()
    OrderDate = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'order_details'

    def __str__(self):
        return f"OrderDetail {self.OrderDetailID} - Product {self.ProductID}"
