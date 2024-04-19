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

class ProductSerializer(serializers.ModelSerializer):
        product_images = ProductImgSerializer(many=True, read_only=True)  # This will include all associated product images
        seller_name = serializers.CharField(source='seller.name', read_only=True)
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
        class Meta:
            model = CartItem
            fields = '__all__'