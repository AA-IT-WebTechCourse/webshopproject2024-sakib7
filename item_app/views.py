from .models import User, Item
from .serializers import ItemSerializer
from rest_framework import serializers, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db import transaction


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by("-date_added")
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        """
        Customize permissions based on the action.
        Allow public access for 'list' and 'retrieve' actions.
        """
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]  # Public access for viewing items
        return super().get_permissions()

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "list":
            queryset = queryset.filter(status="on_sale")
            search_query = self.request.query_params.get("search", None)
            print(search_query)
            if search_query:
                queryset = queryset.filter(title__icontains=search_query)
        return queryset

    def perform_create(self, serializer):
        # Attach the authenticated user as the seller
        serializer.save(seller=self.request.user)

    def update(self, request, *args, **kwargs):
        # Allow editing only by the seller and only for items on sale
        # partial = kwargs.pop("partial", False)
        instance = self.get_object()
        if instance.seller != request.user:
            return Response(
                {"detail": "You are not the seller of this item."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if instance.status != "on_sale":
            return Response(
                {"detail": "Only items on sale can be edited."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_items(self, request):
        # Fetch items categorized by status

        items_on_sale = Item.objects.filter(
            seller=request.user, status="on_sale"
        ).order_by("-date_added")
        items_sold = Item.objects.filter(seller=request.user, status="sold")
        items_purchased = Item.objects.filter(buyer=request.user, status="sold")

        response = {
            "on_sale": ItemSerializer(items_on_sale, many=True).data,
            "sold": ItemSerializer(items_sold, many=True).data,
            "purchased": ItemSerializer(items_purchased, many=True).data,
        }
        return Response(response)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def pay(self, request):
        """
        Handles payment for items in the cart. Accepts a list of items with their IDs and submitted prices.
        Payload example:
        [
            {"id": 1, "price": 10.0},
            {"id": 2, "price": 20.0}
        ]
        """
        cart = request.data
        if not cart or not isinstance(cart, list):
            return Response(
                {"detail": "Invalid payload. Expected a list of items."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        issues = []
        successful_items = []

        try:
            with transaction.atomic():
                for item_data in cart:
                    item_id = item_data.get("id")
                    price = item_data.get("price")

                    if not item_id or price is None:
                        issues.append(
                            {
                                "id": item_data.get("id"),
                                "detail": "Each item must include 'id' and 'price'.",
                            }
                        )
                        continue

                    try:
                        # Fetch and lock the item for update
                        item = Item.objects.select_for_update().get(id=item_id)

                        # Check if the item is still available
                        if item.status != "on_sale":
                            issues.append(
                                {
                                    "id": item_id,
                                    "title": item.title,
                                    "detail": "Item is no longer available.",
                                }
                            )
                            continue

                        # Check if the price has changed
                        if float(price) != float(item.price):
                            issues.append(
                                {
                                    "id": item_id,
                                    "title": item.title,
                                    "detail": "Price has changed.",
                                    "new_price": item.price,
                                }
                            )
                            continue

                        # Mark item as sold
                        item.status = "sold"
                        item.buyer = request.user
                        item.save()
                        successful_items.append(item)

                    except Item.DoesNotExist:
                        issues.append({"id": item_id, "detail": "Item does not exist."})

                if issues:
                    # If there are issues, rollback the transaction
                    raise ValueError("Some items could not be processed.")

                # Return success response
                return Response(
                    {
                        "detail": "Payment successful.",
                        "purchased_items": ItemSerializer(
                            successful_items, many=True
                        ).data,
                    },
                    status=status.HTTP_200_OK,
                )

        except ValueError:
            # Return issues if any problem occurred
            return Response(
                {
                    "detail": "Some items could not be processed.",
                    "error": issues,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"], permission_classes=[])
    def populate_db(self, request):
        try:
            with transaction.atomic():
                User.objects.all().delete()
                Item.objects.all().delete()

                users = []
                for i in range(6):
                    user = User.objects.create_user(
                        username=f"testuser{i + 1}",
                        password=f"pass{i + 1}",
                        email=f"testuser{i + 1}@shop.aa",
                    )
                    users.append(user)

                # Assign 10 items each to the first 3 users
                for i in range(3):
                    seller = users[i]
                    for j in range(10):
                        Item.objects.create(
                            title=f"Item {j + 1} by {seller.username}",
                            description=f"Description for Item {j + 1}",
                            price=(j + 1) * 10.0,
                            seller=seller,
                        )

            return Response(
                {"message": "Database populated with test data successfully."},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
