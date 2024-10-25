from django.urls import path

from api.consumers import Messenger


websocket_urlpatterns = [
    path('ws/chat/', Messenger.as_asgi()),
]
