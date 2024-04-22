from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from .models import *
from django.contrib.auth import get_user_model

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = '__all__'

class ProductImgSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImg
        fields = '__all__'

        def validate_product(self, value):
            # Get the count of existing images for the product
            existing_images_count = ProductImg.objects.filter(product=value).count()

            # Maximum number of images allowed per product
            max_images_per_product = 5

            # Check if adding a new image will exceed the limit
            if existing_images_count >= max_images_per_product:
                raise serializers.ValidationError(f'The maximum number of images allowed per product is {max_images_per_product}')

            return value

class ProductSerializer(serializers.ModelSerializer):
        product_images = ProductImgSerializer(many=True, read_only=True)  # This will include all associated product images
        seller_name = serializers.CharField(source='seller.name', read_only=True)
        seller_id = serializers.CharField(source='seller.id', read_only=True)
        class Meta:
            model = Product
            fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
        class Meta:
            model = Cart
            fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
        title = serializers.CharField(source='productId.title', read_only=True)
        price = serializers.IntegerField(source='productId.price', read_only=True)
        stock = serializers.IntegerField(source='productId.stock', read_only=True)
        seller = serializers.CharField(source='productId.seller.name', read_only=True)
        class Meta:
            model = CartItem
            fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
        class Meta:
            model = Order
            fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
        title = serializers.CharField(source='product.title', read_only=True)
        class Meta:
            model = OrderItem
            fields = '__all__'
