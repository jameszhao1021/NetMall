from django.urls import path
from .views import ProductView, SelectedProductView, SellerStoreView, MyProductView, CartView

urlpatterns = [
    path('mynetmall/my-store', ProductView.as_view(), name='mystore'),
    path('mynetmall/my-store/<int:pk>', MyProductView.as_view(), name='myproducts'),
    path('mynetmall/store/<int:pk>', SellerStoreView.as_view(), name='sellerstore'),
    path('mynetmall/my-store/<int:pk>/', ProductView.as_view(), name='deleteproduct'),
    path('mynetmall/my-store/add-product', ProductView.as_view(), name='addproduct'),
    path('mynetmall/my-store/edit-product/<int:pk>/', ProductView.as_view(), name='deleteproduct'),
    path('products/<int:pk>/', SelectedProductView.as_view(), name='selectedproduct'),
    
]