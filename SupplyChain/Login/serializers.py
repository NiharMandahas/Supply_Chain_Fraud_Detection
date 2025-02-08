from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import LoginDetails, BuyerDetails, SellerDetails

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[("buyer", "Buyer"), ("seller", "Seller")])
    user_id = serializers.CharField(max_length=100)

    def validate_email(self, value):
        if LoginDetails.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        name = validated_data["name"]
        password = validated_data["password"]
        role = validated_data["role"]
        user_id = validated_data["user_id"]

        # Create LoginDetails instance
        login_user = LoginDetails.objects.create(
            email=email,
            role=role
        )
        login_user.set_password(password)
        login_user.save()

        # Create profile based on role
        if role == "buyer":
            BuyerDetails.objects.create(
                email=email,
                name=name,
                buyer_id=user_id,
                login=login_user
            )
        else:
            SellerDetails.objects.create(
                email=email,
                name=name,
                seller_id=user_id,
                login=login_user
            )

        return login_user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
