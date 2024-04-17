from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view

class BaseCRUDView(APIView):
    SelectedModel = None
    SelectedSerializer = None

    
    def get(self, request):
        queryset = self.SelectedModel.objects.all()
        serializer = self.SelectedSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = self.SelectedSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
    
    def put(self, request, pk):
        try:
            instance = self.SelectedModel.objects.get(pk=pk)
        except self.SelectedModel.DoesNotExist:
            return Response({"message": "Object does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.SelectedSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            instance = self.SelectedModel.objects.get(pk=pk)
        except self.SelectedModel.DoesNotExist:
            return Response({"message": "Object does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductView(BaseCRUDView):

    SelectedModel = Product
    SelectedSerializer = ProductSerializer
   

    # permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    # def get(self, request):
    #     # Filter queryset to only include products created by the current user
    #     print(f'the user id is: {request.user.id}')
    #     print(f'the user email is: {request.user.email}')
    #     print(f'Whole Request: {request}')
    #     print(f'User Information: {request.user}')
    #     queryset = self.SelectedModel.objects.filter(seller=request.user.id)
    #     serializer = self.SelectedSerializer(queryset, many=True)
    #     return Response(serializer.data)

class MyProductView(BaseCRUDView):

    SelectedModel = Product
    SelectedSerializer = ProductSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):

        queryset = self.SelectedModel.objects.filter(seller=pk)
        serializer = self.SelectedSerializer(queryset, many=True)
        return Response(serializer.data)



class SelectedProductView(BaseCRUDView):
    SelectedModel = Product
    SelectedSerializer = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            # Retrieve the product with the specified ID
            instance = self.SelectedModel.objects.get(pk=pk)
            serializer = self.SelectedSerializer(instance)
            response_data = serializer.data
            response_data['seller_name'] = instance.seller.name
            return Response(response_data)
        except self.SelectedModel.DoesNotExist:
            # Return 404 if the product does not exist
            return Response({"message": "Product does not exist"}, status=status.HTTP_404_NOT_FOUND)



class SellerStoreView(BaseCRUDView):
    SelectedModel = Product  # Corrected attribute name
    SelectedSerializer = ProductSerializer

    def get(self, request, pk):
        try:
            queryset = self.SelectedModel.objects.filter(seller=pk)
            serializer = self.SelectedSerializer(queryset, many=True)
            return Response(serializer.data)
        except self.SelectedModel.DoesNotExist:
            return Response({"message": "Products do not exist for this seller"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['POST'])
# def add_to_cart(request):
#     # Extract data from the request
#     user_id = request.data.get('user_id')
#     product_id = request.data.get('product_id')
#     quantity = request.data.get('quantity')

#     # Create a new CartItem instance
#     cart_item = CartItem.objects.create(user_id=user_id, product_id=product_id, quantity=quantity)

#     # Serialize the CartItem instance
#     serializer = CartItemSerializer(cart_item)

#     return Response(serializer.data)

class CartView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # Retrieve the current user's cart items
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Extract data from the request
        user = request.user
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        # Validate product_id and quantity
        # ...

        # Create a new cart item
        cart_item = CartItem.objects.create(user=user, product_id=product_id, quantity=quantity)

        # Serialize the new cart item
        serializer = CartItemSerializer(cart_item)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        # Update the quantity of a cart item
        try:
            cart_item = CartItem.objects.get(pk=pk)
        except CartItem.DoesNotExist:
            return Response({"message": "Cart item does not exist"}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)

    def delete(self, request, pk):
        # Remove a cart item
        try:
            cart_item = CartItem.objects.get(pk=pk)
        except CartItem.DoesNotExist:
            return Response({"message": "Cart item does not exist"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)