from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

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


class CreateCartView(APIView):
    authentication_classes = []  # Remove any authentication classes
    permission_classes = []  # Remove any permission classes
    
    def post(self, request):
        # Extract user ID from the request data
        user_id = request.data.get('user_id')
        
        # Validate user ID
        if not user_id:
            return Response({"message": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the user instance corresponding to the user ID
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create a new cart associated with the user
        cart = Cart.objects.create(userId=user)
        
        # Serialize the cart
        serializer = CartSerializer(cart)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
        # print(f'the user id is: {request.user.id}')
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

# class CartView(BaseCRUDView):
#     SelectedModel = CartItem
#     SelectedSerializer = CartItemSerializer
#     permission_classes = [IsAuthenticated]

#     def get(self, request, pk):
#         cart = Cart.objects.get(userId=pk)
#         queryset = self.SelectedModel.objects.filter(cartId=cart)
#         serializer = self.SelectedSerializer(queryset, many=True)
#         return Response(serializer.data)

#     # def post(self, request):
#     #     serializer = self.SelectedSerializer(data=request.data)
#     #     if serializer.is_valid():
#     #         serializer.save(user=request.user)
#     #         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         def post(self, request, pk):
#             # Extract data from the request
#             user_id = pk
#             product_id = request.data.get('productId')
#             quantity = request.data.get('quantity')
#             cart = Cart.objects.get(userId=user_id)
        
#             # Check if the item already exists in the cart
#             try:
#                 cart_item = CartItem.objects.get(cartId=cart, productId=product_id)
#                 # If the item exists, update its quantity
#                 cart_item.quantity += int(quantity)
#                 cart_item.save()
#                 # Serialize the updated cart item
#                 serializer = CartItemSerializer(cart_item)
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             except CartItem.DoesNotExist:
#                 # If the item does not exist, create a new cart item
#                 cart_item = CartItem.objects.create(cartId=cart, productId_id=product_id, quantity=quantity)
#                 # Serialize the new cart item
#                 serializer = CartItemSerializer(cart_item)
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)

#         def put(self, request, pk):
#             try:
#                 instance = self.SelectedModel.objects.get(pk=pk)
#             except self.SelectedModel.DoesNotExist:
#                 return Response({"message": "Cart item does not exist"}, status=status.HTTP_404_NOT_FOUND)

#             serializer = self.SelectedSerializer(instance, data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         def delete(self, request, pk):
#             try:
#                 instance = self.SelectedModel.objects.get(pk=pk)
#             except self.SelectedModel.DoesNotExist:
#                 return Response({"message": "Cart item does not exist"}, status=status.HTTP_404_NOT_FOUND)

#             instance.delete()
#             return Response(status=status.HTTP_204_NO_CONTENT)

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user_id):
        try:
            return Cart.objects.get(userId=user_id)
        except Cart.DoesNotExist:
            return None

    def get(self, request, pk):
        cart = self.get_cart(pk)
        if not cart:
            return Response({"message": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        queryset = CartItem.objects.filter(cartId=cart)
        serializer = CartItemSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        user_id = pk
        product_id = request.data.get('productId')
        quantity = request.data.get('quantity')
        
        cart = self.get_cart(user_id)
        if not cart:
            return Response({"message": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart_item = CartItem.objects.get(cartId=cart, productId=product_id)
            cart_item.quantity += int(quantity)
            cart_item.save()
            serializer = CartItemSerializer(cart_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            cart_item = CartItem.objects.create(cartId=cart, productId_id=product_id, quantity=quantity)
            serializer = CartItemSerializer(cart_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk)
        except CartItem.DoesNotExist:
            return Response({"message": "Cart item does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartItemSerializer(cart_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk)
        except CartItem.DoesNotExist:
            return Response({"message": "Cart item does not exist"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)