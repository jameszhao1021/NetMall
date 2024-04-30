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
from django.shortcuts import get_object_or_404
import boto3
from django.conf import settings
import os
from io import BytesIO
from django.core.files.base import ContentFile
from django.db.models import Q

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

    def get(self, request):
        if 'q' in request.GET:
            return self.search(request)
        else:
            return super().get(request)
    
    def search(self, request):
            query = request.GET.get('q')
            category = request.GET.get('category')

            queryset = Product.objects.all()

            if query:
                queryset = queryset.filter(
                    Q(title__icontains=query) | Q(description__icontains=query)
                )
            
            if category:
                queryset = queryset.filter(category__icontains=category)

            serializer = ProductSerializer(queryset, many=True)
            return Response(serializer.data)

    
class ProductImgView(BaseCRUDView):
    SelectedModel = ProductImg
    SelectedSerializer = ProductImgSerializer
    permission_classes = []
    authentication_classes = [] 


class ProductImgView(BaseCRUDView):
    SelectedModel = ProductImg
    SelectedSerializer = ProductImgSerializer
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        # Get the image file from the request
        image_file = request.FILES.get('image')
        print(f'image_file: {image_file}')
        # Validate the image file
        if not image_file:
            return Response({"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize the product image data
        serializer = self.SelectedSerializer(data={"image": image_file, "product": request.data.get("product")})

        # Check if the serializer is valid
        if serializer.is_valid(raise_exception=True):
            # Save the product image to the server
            product_img = serializer.save()
            image_file.seek(0)
            # Upload the image to AWS S3
            try:
                # Read the image file data
                image_data = image_file.read()

                # Create an S3 client
                s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
                
                # Define the bucket name and object key
                bucket_name = 'netmall'
                object_key = 'product_images/' + image_file.name

                # Upload the image file to S3
                s3.put_object(Bucket=bucket_name, Key=object_key, Body=image_data)

                # Construct the image URL
                image_url = f'https://{bucket_name}.s3.amazonaws.com/{object_key}'

                # Update the product image model with the image URL
                product_img.image_url = image_url
                product_img.save()

                # Return a success response
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                # Return an error response if uploading to S3 fails
                return Response({"error": f"Failed to upload image to AWS S3: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            # Return an error response if serializer is invalid
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def put(self, request, pk):
        # Get the existing product image object
        try:
            product_img = self.SelectedModel.objects.get(pk=pk)
        except ProductImg.DoesNotExist:
            return Response({"error": "Product image not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get the new image file from the request
        new_image_file = request.FILES.get('image')

        # Check if a new image file is provided
        if new_image_file:
            # Update the product image data
            serializer = self.SelectedSerializer(product_img, data={"image": new_image_file}, partial=True)
        else:
            # If no new image file is provided, proceed with partial update without the image
            serializer = self.SelectedSerializer(product_img, data=request.data, partial=True)

        # Check if the serializer is valid
        if serializer.is_valid(raise_exception=True):
            # Save the updated product image to the server
            updated_product_img = serializer.save()
            new_image_file.seek(0)
            # If a new image file is provided, handle image upload to AWS S3
            if new_image_file:
                try:
                    # Read the image file data
                    image_data = new_image_file.read()

                    # Create an S3 client
                    s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
                    
                    # Define the bucket name and object key
                    bucket_name = 'netmall'
                    object_key = 'product_images/' + new_image_file.name

                    # Upload the image file to S3
                    s3.put_object(Bucket=bucket_name, Key=object_key, Body=image_data)

                    # Construct the image URL
                    image_url = f'https://{bucket_name}.s3.amazonaws.com/{object_key}'

                    # Update the product image model with the new image URL
                    updated_product_img.image_url = image_url
                    updated_product_img.save()

                except Exception as e:
                    # Return an error response if uploading to S3 fails
                    return Response({"error": f"Failed to upload updated image to AWS S3: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Return a success response
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return an error response if serializer is invalid
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyProductView(BaseCRUDView):

    SelectedModel = Product
    SelectedSerializer = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
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

class ProductByCategoryView(BaseCRUDView):
    SelectedModel = Product
    SelectedSerializer = ProductSerializer
    permission_classes = []
    authentication_classes = []

    def get(self,request,category):
        queryset = self.SelectedModel.objects.filter(category=category)
        serializer = self.SelectedSerializer(queryset, many=True)
        return Response(serializer.data)

    # def search(self, request, category):
    #     query = request.GET.get('q')
    #     print(f'see the query: {query}')
    #     if query:
            
    #         queryset = self.SelectedModel.objects.filter(
    #             Q(title__icontains=query) | Q(description__icontains=query),
    #             category=category, 
    #         )
    #     else:
            
    #         queryset = self.SelectedModel.objects.filter(category=category)
        
    #     serializer = self.SelectedSerializer(queryset, many=True)
    #     return Response(serializer.data)

    def get(self,request,category):
        queryset = self.SelectedModel.objects.filter(category=category)
        serializer = self.SelectedSerializer(queryset, many=True)
        return Response(serializer.data)
        
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

class SingleCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user_id):
        try:
            return Cart.objects.get(userId=user_id)
        except Cart.DoesNotExist:
            return None

    def get(self, request, pk):
        cart = self.get_cart(pk)
        cart_item_id = request.query_params.get('cart_item_id') 
        print({cart_item_id})
        if not cart:
            return Response({"message": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve the cart item using filter and first (or get_object_or_404)
        instance = CartItem.objects.filter(cartId=cart, pk=cart_item_id).first()
        if not instance:
            return Response({"message": "CartItem not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartItemSerializer(instance)
        return Response(serializer.data)

class OrderView(BaseCRUDView):
    SelectedModel = Order
    SelectedSerializer = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            queryset = self.SelectedModel.objects.filter(user=user_id)
            serializer = self.SelectedSerializer(queryset, many=True)
            return Response(serializer.data)
        except self.SelectedModel.DoesNotExist:
            return Response({"message": "Products do not exist for this seller"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        user_id = request.data.get('user_id')
        cart_item_ids = request.data.get('cart_item_ids')
       
        if not user_id or not cart_item_ids:
            return Response({"error": "user_id and cart_item_ids are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_items = CartItem.objects.filter(id__in=cart_item_ids)
            
            cart_items_by_seller = {}
            for cart_item in cart_items:
                seller_id = cart_item.productId.seller.id
                if seller_id not in cart_items_by_seller:
                    cart_items_by_seller[seller_id] = []
                cart_items_by_seller[seller_id].append(cart_item)

            with transaction.atomic():
                for seller_id, seller_cart_items in cart_items_by_seller.items():
                    seller_name = cart_item.productId.seller.name
                    total_price = sum(cart_item.productId.price * cart_item.quantity for cart_item in seller_cart_items)
                  
                    order_data = {
                        'user': user_id,
                        'seller': seller_name,
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



class SingleOrderView(BaseCRUDView):
    SelectedModel = Order
    SelectedSerializer = OrderSerializer
    permission_classes = [IsAuthenticated]

   
   
    def post(self, request):
        user_id = request.data.get('user_id')
        cart_item_id = request.data.get('cart_item_id')
      
        if not user_id or not cart_item_id:
            return Response({"error": "user_id and cart_item_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(pk=cart_item_id)
            

            with transaction.atomic():
                    seller_name = cart_item.productId.seller.name
                    total_price = cart_item.productId.price * cart_item.quantity 

                    order_data = {
                        'user': user_id,
                        'seller': seller_name,
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
                        CartItem.objects.filter(pk=cart_item_id).delete()    
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderItemView(BaseCRUDView):
    SelectedModel = OrderItem
    SelectedSerializer = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            queryset = self.SelectedModel.objects.filter(order__user=user_id)
            serializer = self.SelectedSerializer(queryset, many=True)
            return Response(serializer.data)
        except self.SelectedModel.DoesNotExist:
            return Response({"message": "Products do not exist for this seller"}, status=status.HTTP_404_NOT_FOUND)
