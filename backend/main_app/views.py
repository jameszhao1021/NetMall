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
from django.db import transaction

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
    permission_classes = []
    authentication_classes = [] 
    
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
        print(f'the user id is: {request.user.id}')
        queryset = self.SelectedModel.objects.filter(seller=pk).order_by('create_at')
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

        queryset = CartItem.objects.filter(cartId=cart).order_by('create_at')
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

# class OrderView(BaseCRUDView):
#     SelectedModel = Order
#     SelectedSerializer = OrderSerializer

#     def post(self, request):
#         user_id = request.data.get('user_id')
#         cart_item_ids = request.data.get('cart_item_ids')

#         cart_items = CartItem.objects.filter(id__in=cart_item_ids)

#         # Group cart items by seller
#         cart_items_by_seller = {}
#         for cart_item in cart_items:
#             seller_id = cart_item.product.seller.id
#             if seller_id not in cart_items_by_seller:
#                 cart_items_by_seller[seller_id] = []
#             cart_items_by_seller[seller_id].append(cart_item)

#         # Create orders for each seller
#         for seller_id, seller_cart_items in cart_items_by_seller.items():
#             total_price = sum(cart_item.product.price * cart_item.quantity for cart_item in seller_cart_items)
            
#             # Create the order with related data from cart items
#             order_data = {
#                 'user': user_id,
#                 'seller': seller_id,  # Include the seller ID in the order data
#                 'total_price': total_price,
#             }

#             serializer = OrderSerializer(data=order_data)
#             if serializer.is_valid(raise_exception=True):
#                 order = serializer.save()

#                 # Create order items based on cart items
#                 for cart_item in seller_cart_items:
#                     order_item_data = {
#                         'order': order.id,
#                         'product': cart_item.product.id,
#                         'quantity': cart_item.quantity,
#                         'price': cart_item.product.price,
#                     }
#                     OrderItem.objects.create(**order_item_data)

#         return Response(serializer.data)

class OrderView(BaseCRUDView):
    SelectedModel = Order
    SelectedSerializer = OrderSerializer
   
    def post(self, request):
        user_id = request.data.get('user_id')
        cart_item_ids = request.data.get('cart_item_ids')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
       
        if not user_id or not cart_item_ids:
            return Response({"error": "user_id and cart_item_ids are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_items = CartItem.objects.filter(id__in=cart_item_ids)
            
            cart_items_by_seller = {}
            for cart_item in cart_items:
                seller_id = cart_item.productId.seller.id
                print({seller_id})
                if seller_id not in cart_items_by_seller:
                    cart_items_by_seller[seller_id] = []
                cart_items_by_seller[seller_id].append(cart_item)

            with transaction.atomic():
                for seller_id, seller_cart_items in cart_items_by_seller.items():
                    total_price = sum(cart_item.productId.price * cart_item.quantity for cart_item in seller_cart_items)

                    order_data = {
                        'user': user_id,
                        'seller': seller_id,
                        'total_price': total_price,
                        'first_name': request.data.get('first_name'),
                        'last_name': request.data.get('last_name'),
                        'country': request.data.get('country'),
                        'street_address': request.data.get('street_address'),
                        'street_address_2': request.data.get('street_address_2'),
                        'phone': request.data.get('phone'),
                    }

                    serializer = OrderSerializer(data=order_data)
                    if serializer.is_valid():
                        order = serializer.save()

                        for cart_item in seller_cart_items:
                            product = cart_item.productId
                            product.stock -= cart_item.quantity
                            product.save()

                            order_item_data = {
                                'order': order,
                                'product': product,
                                'quantity': cart_item.quantity,
                                'price': product.price,
                            }
                            OrderItem.objects.create(**order_item_data)
                        CartItem.objects.filter(id__in=[item.id for item in seller_cart_items]).delete()    
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)