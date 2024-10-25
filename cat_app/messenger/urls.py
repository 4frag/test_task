from django.urls import path

from messenger.views import index


urlpatterns = [
    path('index/', index),
]
