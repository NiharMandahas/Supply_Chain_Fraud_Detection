from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductDetails
from .serializers import ProductDetailsSerializer
from django.db.models import Max

class ProductDetailsView(APIView):
    """
    Handles listing all products and creating new products.
    """
    def get(self, request):
        seller_id = request.query_params.get('seller_id')
        if seller_id:
            products = ProductDetails.objects.filter(seller_id=seller_id)
        else:
            products = ProductDetails.objects.all()
        serializer = ProductDetailsSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            # Get the latest numeric part of the product_id
            latest_product = ProductDetails.objects.aggregate(max_id=Max('product_id'))
            latest_id = latest_product['max_id']

            # Extract the numeric part and increment
            if latest_id and latest_id.startswith("P"):
                new_numeric_id = int(latest_id[1:]) + 1
            else:
                new_numeric_id = 10  # Start from P001 if no records exist

            new_product_id = f"P{new_numeric_id:03d}"  # Format to PXXX

            # Create a mutable copy of request.data to insert the generated product_id
            request_data = request.data.copy()
            request_data['product_id'] = new_product_id

            serializer = ProductDetailsSerializer(data=request_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Failed to create product: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProductDetailView(APIView):
    """
    Handles fetching a single product by its `product_id`.
    """
    def get(self, request, product_id):
        try:
            product = ProductDetails.objects.get(product_id=product_id)
            serializer = ProductDetailsSerializer(product)
            return Response(serializer.data)
        except ProductDetails.DoesNotExist:
            return Response(
                {"error": f"Product with ID '{product_id}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch product: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def put(self, request, product_id):
        try:
            product = ProductDetails.objects.get(product_id=product_id)
            serializer = ProductDetailsSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProductDetails.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
