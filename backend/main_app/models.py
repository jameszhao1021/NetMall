from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import random 

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255, unique=True, verbose_name='User Name')
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    store = models.CharField(max_length=255, unique=False, blank=True)
    profile = models.ImageField(upload_to='profile/', blank=True)
    create_at = models.DateTimeField(auto_now_add = True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name

    def __str__(self):
        return self.email

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Clothing', 'Clothing'),
        ('Toys', 'Toys'),
        ('Home', 'Home'),
        ('Sports', 'Sports'),
        ('Cosmetics', 'Cosmetics'),
    ]
    CONDITION_CHOICES = [
        ('New', 'New'),
        ('Excellent', 'Excellent'),
        ('Good', 'Good'),
    ]

    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default = CATEGORY_CHOICES[0][0])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default = CONDITION_CHOICES[0][0])
    thumbnail_url = models.URLField(max_length=200, blank=True, null=True)
    description = models.TextField()
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ProductImg(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)  # For local storage
    aws_image_url = models.URLField(max_length=200, blank=True, null=True)  # For AWS S3 storage


class Cart(models.Model):
    userId = models.ForeignKey(User, on_delete=models.CASCADE)


class CartItem(models.Model):
    cartId = models.ForeignKey(Cart, on_delete=models.CASCADE)
    productId = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    create_at = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=15, unique=True, blank=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    country = models.CharField(max_length=50)
    street_address = models.CharField(max_length=50)
    street_address_2 = models.CharField(max_length=50, blank=True, null=True)
    phone = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_order_number(self):
        # Generate a random five-digit number
        random_number = str(random.randint(10000, 99999))
        # Combine with the order ID
        return random_number + str(self.id)

    def save(self, *args, **kwargs):
        if not self.order_number:
            super().save(*args, **kwargs)  # Save the object to generate the id
            self.order_number = self.generate_order_number()
            self.save()  # Save again to update the order_number
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"Order for {self.user.email}"

   
class OrderItem(models.Model):
    order = models.ForeignKey('Order', related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)