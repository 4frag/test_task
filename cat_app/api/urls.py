from django.urls import path
from rest_framework.routers import SimpleRouter

from api.views import (
    ping,
    login,
    register,
    session_status,
    UserViewSet,
    MessagesAPI,
    CatsViewSet,
    ChatsAPI,
    logout,
    get_messages,
    get_or_create_chat,
)

router = SimpleRouter()
router.register('users', UserViewSet)
router.register('cats', CatsViewSet)

urlpatterns = [
    path('ping/', ping),
    path('sessionStatus/', session_status),
    path('login/', login),
    path('logout/', logout),
    path('register/', register),
    path('getMessages/', get_messages),
    path('getOrCreateChat/<int:interlocutor_id>/', get_or_create_chat),
    path('chats/', ChatsAPI.as_view()),
    path('chats/<int:chat_id>/', ChatsAPI.as_view()),
    path('messages/', MessagesAPI.as_view()),
] + router.urls
