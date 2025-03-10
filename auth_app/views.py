from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, update_session_auth_hash
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    AccountSerializer,
    ChangePasswordSerializer,
)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "username": user.username,
                    "user_id": user.id,
                    "token": token.key,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data["username"],
                password=serializer.validated_data["password"],
            )
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return Response(
                    {
                        "username": user.username,
                        "user_id": user.id,
                        "token": token.key,
                    }
                )
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.user)
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"})


class AccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = AccountSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        if "old_password" in request.data and "new_password" in request.data:
            password_serializer = ChangePasswordSerializer(data=request.data)
            if password_serializer.is_valid():
                old_password = password_serializer.validated_data["old_password"]
                new_password = password_serializer.validated_data["new_password"]
                if not user.check_password(old_password):
                    return Response(
                        {"old_password": "Wrong password."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                print(user.check_password(old_password))
                user.set_password(new_password)
                user.save()
                return Response(
                    {"message": "Password updated successfully"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                password_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        else:
            # serializer = AccountSerializer(user, data=request.data, partial=True)
            # if serializer.is_valid():
            #     serializer.save()
            #     return Response(
            #         {"message": "Account updated successfully"},
            #         status=status.HTTP_200_OK,
            #     )
            return Response(
                {"error": "Invalid data provided"}, status=status.HTTP_400_BAD_REQUEST
            )
