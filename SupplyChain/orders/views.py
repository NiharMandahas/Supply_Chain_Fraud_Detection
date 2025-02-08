from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Order,OrderDetails
from .serializers import OrderSerializer,OrderDetailsSerializer
from products.models import ProductDetails

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('UserID', None)  # Buyer ID
        seller_id = self.request.query_params.get('SellerID', None)  # Seller ID

        queryset = Order.objects.all()

        if user_id:
            queryset = queryset.filter(UserID=user_id)  # Fetch all orders for the buyer
        
        if seller_id:
            queryset = queryset.filter(order_items__SellerID=seller_id).distinct()

        return queryset

    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        # Pass SellerID to the serializer context
        context['seller_id'] = self.request.query_params.get('SellerID', None)
        return context


@api_view(['POST'])
def create_order(request):
    try:
        order_serializer = OrderSerializer(data=request.data)
        if order_serializer.is_valid():
            order = order_serializer.save()
            return Response({
                'message': 'Order created successfully',
                'OrderID': str(order.OrderID)  # Convert UUID to string
            }, status=status.HTTP_201_CREATED)
        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except ProductDetails.DoesNotExist:
        return Response(
            {'error': 'One or more products not found'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def buyer_view_orders(request):
    user_id = request.query_params.get('UserID', None)  # Get UserID from query params
    print(user_id) 
    if not user_id:
        return Response(
            {'error': 'UserID is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Fetch all orders for the given UserID
        orders = Order.objects.filter(UserID=user_id).prefetch_related('order_items')
        print(orders)
        # Serialize the orders and their related order items
        serialized_orders = []
        for order in orders:
            order_data = OrderSerializer(order).data
            order_items = OrderDetails.objects.filter(order=order)
            order_data['order_items'] = OrderDetailsSerializer(order_items, many=True).data
            serialized_orders.append(order_data)

        return Response(serialized_orders, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )