from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .models import LoginDetails,BuyerDetails,SellerDetails
from django.utils import timezone
from .serializers import RegisterSerializer, LoginSerializer


@api_view(['POST'])
@csrf_exempt
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "User registered successfully",
            "email": serializer.validated_data["email"],
            "role": serializer.validated_data["role"]
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    @csrf_exempt
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = LoginDetails.objects.get(email=serializer.validated_data['email'])
                
                # Check password
                if user.check_password(serializer.validated_data['password']):
                    
                    # Check role match
                    role_from_request = request.data.get('role')
                    if user.role != role_from_request:
                        return Response({
                            'error': 'Invalid credentials'
                        }, status=status.HTTP_401_UNAUTHORIZED)

                    user.last_login = timezone.now()
                    user.save()
                    
                    user_data = {
                        'email': user.email,
                        'role': user.role
                    }

                    if user.role == 'buyer':
                        buyer = BuyerDetails.objects.filter(email=user.email).first()
                        if buyer:
                            user_data['buyer_id'] = buyer.buyer_id
                    elif user.role == 'seller':
                        seller = SellerDetails.objects.filter(email=user.email).first()
                        if seller:
                            user_data['seller_id'] = seller.seller_id

                    return Response({
                        'message': 'Login successful',
                        'user': user_data
                    }, status=status.HTTP_200_OK)

            except LoginDetails.DoesNotExist:
                pass

        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

