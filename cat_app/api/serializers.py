from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from api.models import Cat, User, Message


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = ['name', 'birth_date', 'breed', 'hairiness', 'id']


class MessageSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    date_of_send = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'text', 'date_of_send', 'author']

    def get_author(self, obj):
        return obj.author.username

    def get_date_of_send(self, obj):
        return obj.date_of_send.strftime('%H:%M:%S, %m/%d/%Y')
