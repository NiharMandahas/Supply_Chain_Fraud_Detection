from rest_framework import serializers
from .models import reviews

class reviewSerializer(serializers.ModelSerializer):
    Name = serializers.CharField(source='Buyer_ID.Name', read_only=True)  # Get buyer's name
    Buyer_ID = serializers.CharField(source='Buyer_ID.Buyer_ID', read_only=True)

    class Meta:
        model = reviews
        fields = ['Name', 'Buyer_ID', 'Rating', 'reviewcontent']
