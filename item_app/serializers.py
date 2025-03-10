from rest_framework import serializers
from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            "id",
            "title",
            "description",
            "price",
            "date_added",
            "status",
            "seller",
            "buyer",
        ]
        read_only_fields = ["id", "date_added", "status", "seller", "buyer"]
