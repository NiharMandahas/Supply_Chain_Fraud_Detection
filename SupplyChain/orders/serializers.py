from rest_framework import serializers
from .models import Order, OrderDetails
from products.models import ProductDetails

class OrderDetailsSerializer(serializers.ModelSerializer):
    SellerID = serializers.CharField(max_length=255, required=False)  # Make SellerID optional in input

    class Meta:
        model = OrderDetails
        fields = ['ProductID', 'Price', 'Quantity', 'SellerID', 'OrderDate']
        
    def to_representation(self, instance):
        seller_id = self.context.get('seller_id')
        
        if seller_id and instance.SellerID != seller_id:
            return None
            
        return super().to_representation(instance)

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderDetailsSerializer(many=True, required=True)

    class Meta:
        model = Order
        fields = [
            'UserID', 'Email', 'Phone', 'Address',
            'PaymentMethod', 'PaymentInformation', 'order_items'
        ]

    def to_representation(self, instance):
        seller_id = self.context.get('seller_id')
        serialized = super().to_representation(instance)
        
        if seller_id:
            filtered_order_items = [
                item for item in serialized['order_items']
                if item is not None and item.get('SellerID') == seller_id
            ]
            serialized['order_items'] = filtered_order_items
            
        return serialized

    def validate_order_items(self, value):
        """
        Validate order items and add SellerID before validation
        """
        for item in value:
            try:
                product = ProductDetails.objects.get(product_id=item['ProductID'])
                item['SellerID'] = product.seller_id
            except ProductDetails.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {item['ProductID']} not found")
        return value

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)
        
        for item_data in order_items_data:
            # SellerID is already added during validation
            OrderDetails.objects.create(
                order=order,
                **item_data
            )
        
        return order