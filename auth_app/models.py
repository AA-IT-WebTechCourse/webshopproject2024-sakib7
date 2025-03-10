from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model that extends the default Django User."""

    email = models.EmailField(unique=True)
