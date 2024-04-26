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
        image_urls = serializers.SerializerMethodField(source='get_image_urls')
        image_ids = serializers.SerializerMethodField(source='get_image_ids')

        class Meta:
            model = Product
            fields = '__all__'

        def get_image_urls(self, obj):
            # Retrieve related ProductImg objects and extract image URLs
            product_imgs = obj.productimg_set.all()
            return [product_img.image_url for product_img in product_imgs]
        
        def get_image_ids(self, obj):
            # Retrieve related ProductImg objects and extract image ids
            product_imgs = obj.productimg_set.all()
            return [product_img.id for product_img in product_imgs]

class CartSerializer(serializers.ModelSerializer):
        class Meta:
            model = Cart
            fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
        title = serializers.CharField(source='productId.title', read_only=True)
        price = serializers.IntegerField(source='productId.price', read_only=True)
        stock = serializers.IntegerField(source='productId.stock', read_only=True)
        seller = serializers.CharField(source='productId.seller.name', read_only=True)
        image_urls = serializers.SerializerMethodField()

        class Meta:
            model = CartItem
            fields = '__all__'

        def get_image_urls(self, obj):
            # Retrieve the product associated with the order item
            product_imgs = obj.productId.productimg_set.all()

            # If product exists and has image URLs, return them
            if product_imgs:
                return [product_img.image_url for product_img in product_imgs]
            else:
                return None

class OrderSerializer(serializers.ModelSerializer):
        class Meta:
            model = Order
            fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
   
        title = serializers.CharField(source='product.title', read_only=True)
        image_urls = serializers.SerializerMethodField()

        class Meta:
            model = OrderItem
            fields = '__all__'

        def get_image_urls(self, obj):
            # Retrieve the product associated with the order item
            product_imgs = obj.product.productimg_set.all()

            # If product exists and has image URLs, return them
            if product_imgs:
                return [product_img.image_url for product_img in product_imgs]
            else:
                return None
