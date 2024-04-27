from django.urls import path
from .views import *


urlpatterns = [
    path('create-cart', CreateCartView.as_view(), name='create_cart'),
    path('mynetmall/my-store', ProductView.as_view(), name='mystore'),
    path('mynetmall/my-store/<int:pk>', MyProductView.as_view(), name='myproducts'),
    path('mynetmall/store/<int:pk>', SellerStoreView.as_view(), name='sellerstore'),
    path('mynetmall/my-store/<int:pk>/', ProductView.as_view(), name='deleteproduct'),
    path('mynetmall/my-store/add-product', ProductView.as_view(), name='addproduct'),
    path('mynetmall/my-store/edit-product/<int:pk>/', ProductView.as_view(), name='deleteproduct'),
    path('products/<int:pk>/', SelectedProductView.as_view(), name='selectedproduct'),
    path('mynetmall/my-cart/<int:pk>', CartView.as_view(), name='getcartitems'),
    path('mynetmall/single-checkout/<int:pk>', SingleCheckoutView.as_view(), name='getonecartitems'),
    path('mynetmall/pay', OrderView.as_view(), name='pay'),
    path('mynetmall/single-pay', SingleOrderView.as_view(), name='singlepay'),
    path('mynetmall/purchasehistory/<int:user_id>', OrderView.as_view(), name='myorders'),
    path('mynetmall/orderitems/<int:user_id>', OrderItemView.as_view(), name='myorderitems'),
    path('mynetmall/product-image', ProductImgView.as_view(), name='product_images'),
    path('mynetmall/product-image/<int:pk>', ProductImgView.as_view(), name='product_images_update'),
    path('mynetmall/<str:category>', ProductByCategoryView.as_view(), name='product_by_category'),
]