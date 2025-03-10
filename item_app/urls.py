from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet

# Create a router and register the ItemViewSet
router = DefaultRouter()
router.register(r"items", ItemViewSet, basename="items")

urlpatterns = [
    # Include the router URLs
    path("", include(router.urls)),
]
