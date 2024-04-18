# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import User, Cart


# def create_cart_for_new_user(sender, instance, created, **kwargs):
#     if created:
#         # Create a cart for the new user
#         Cart.objects.create(userId=instance.id)