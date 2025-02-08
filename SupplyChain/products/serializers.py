from rest_framework import serializers
from .models import ProductDetails


class ProductDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetails
        fields = ['product_id', 'seller_id', 'seller_name', 'item_name', 'category', 'image_address', 'price','Description']
