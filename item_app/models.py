from django.db import models
from auth_app.models import User


# Create your models here.
class Item(models.Model):
    STATUS_CHOICES = [
        ("on_sale", "On Sale"),
        ("sold", "Sold"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_added = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="on_sale")
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="items_sold"
    )
    buyer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="items_purchased",
    )

    def __str__(self):
        return self.title
