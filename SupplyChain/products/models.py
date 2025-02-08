from django.db import models

class ProductDetails(models.Model):
    product_id = models.CharField(max_length=255, db_column='Product_ID', primary_key=True)
    seller_id = models.CharField(max_length=255, db_column='Seller_ID')
    seller_name = models.CharField(max_length=255, db_column='Seller_Name')
    item_name = models.CharField(max_length=255, db_column='Item')
    category = models.CharField(max_length=255, db_column='Category')
    image_address = models.URLField(db_column='Image_Address')
    price = models.DecimalField(max_digits=10, decimal_places=2, db_column='Price')
    Description = models.CharField(max_length=4000, db_column='Description')
    class Meta:
        db_table = 'productdetails'
        managed = False  # Keep this as False if the table is managed externally
