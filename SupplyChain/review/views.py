from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Review, BuyerDetails, ProductDetails
from rest_framework.serializers import Serializer, CharField, DecimalField

class ReviewSerializer(Serializer):
    product_id = CharField()
    buyer_id = CharField()
    rating = DecimalField(max_digits=2, decimal_places=1)
    reviewcontent = CharField(max_length=2000)

class ProductReviewsView(APIView):
    def get(self, request, product_id):
        # Get all reviews for the given product_id
        reviews = Review.objects.filter(product_id=product_id).select_related('buyer')
        
        if not reviews:
            return Response(
                {'message': 'No reviews found for this product'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Format the reviews as required
        review_data = [{
            'name': review.buyer.name,
            'buyer_id': review.buyer.buyer_id,
            'rating': float(review.rating),
            'reviewcontent': review.reviewcontent
        } for review in reviews]
        
        return Response(review_data, status=status.HTTP_200_OK)

    def post(self, request):
        # Validate request data
        serializer = ReviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            # Check if buyer exists
            buyer = BuyerDetails.objects.get(buyer_id=data['buyer_id'])
            # Check if product exists
            product = ProductDetails.objects.get(product_id=data['product_id'])
            
            # Check if review already exists
            existing_review = Review.objects.filter(buyer=buyer, product=product).first()
            if existing_review:
                return Response(
                    {'error': 'Review already exists for this buyer and product'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create new review
            review = Review.objects.create(
                buyer=buyer,
                product=product,
                rating=data['rating'],
                reviewcontent=data['reviewcontent']
            )
            
            return Response({
                'message': 'Review created successfully',
                'review_id': review.id
            }, status=status.HTTP_201_CREATED)
            
        except BuyerDetails.DoesNotExist:
            return Response(
                {'error': 'Buyer not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ProductDetails.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
