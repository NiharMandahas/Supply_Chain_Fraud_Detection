from django.db import models

class BuyerDetails(models.Model):
    buyer_id = models.CharField(max_length=255, primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    ip_address = models.CharField(max_length=255)
    no_payments = models.IntegerField(default=0)
    no_orders = models.IntegerField(default=0)
    Credit_Score = models.DecimalField(max_digits=6, decimal_places=3)
    Temp_Mail_or_VPN = models.CharField(max_length=4)
    no_returns = models.IntegerField(default=0)
    return_to_order = models.DecimalField(max_digits=4, decimal_places=4)
    Account_Age=models.IntegerField(default=0)
    Cred_change=models.DecimalField(max_digits=6, decimal_places=3)
    retorder=models.DecimalField(max_digits=6, decimal_places=3)
    VPN=models.IntegerField(default=0)

    class Meta:
        db_table = 'buyerdetails'

class ProductDetails(models.Model):
    product_id = models.CharField(max_length=255, primary_key=True)
    seller_name = models.CharField(max_length=255)
    seller_id = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    account_age = models.DecimalField(max_digits=5, decimal_places=2)
    return_rate = models.DecimalField(max_digits=5, decimal_places=2)
    fulfillment_rate = models.DecimalField(max_digits=5, decimal_places=2)
    delay_rate = models.DecimalField(max_digits=5, decimal_places=2)
    cancelled_rate = models.DecimalField(max_digits=5, decimal_places=2)
    item = models.CharField(max_length=255)
    image_address = models.URLField(max_length=2083)
    description = models.TextField(max_length=4000)
    price = models.DecimalField(max_digits=10, decimal_places=4)

    class Meta:
        db_table = 'productdetails'

class Review(models.Model):
    id = models.AutoField(primary_key=True)
    buyer = models.ForeignKey(BuyerDetails, on_delete=models.CASCADE, db_column='buyer_id')
    product = models.ForeignKey(ProductDetails, on_delete=models.CASCADE, db_column='product_id')
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    reviewcontent = models.TextField(max_length=2000)

    class Meta:
        db_table = 'reviews'
