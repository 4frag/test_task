import json
from channels.generic.websocket import WebsocketConsumer
from logging import getLogger
from asgiref.sync import async_to_sync
from copy import copy

from api.models import Chat, Message, User
from api.serializers import MessageSerializer


logger = getLogger('websocket')


class Messenger(WebsocketConsumer):
    def connect(self):
        try:
            """
            я знаю, что не стоит проверять доступ к чатам только при коннекте, тк его можно забанить, но до реконнекта к вебсокету он будет 
            иметь доступ к чату. но так как в тестовом задании не предполагалось наличии модерации чатов, то я не стал этого делать
            """

            user_id = self.scope['session']['user_id']
            chats = Chat.objects.filter(members__id=user_id)
            for chat in chats:
                async_to_sync(self.channel_layer.group_add)(f'chat_{chat.id}', self.channel_name)
                logger.info(f'user {user_id} joined to chat {chat.id} group')

            logger.info(f'user {user_id} connected to chat websocket')
            self.accept()
        except KeyError:
            logger.info('someone tried to connect to websocket without login!')
            self.disconnect()

    def receive(self, text_data):
        data = json.loads(text_data)
        try:
            user_id = self.scope['session']['user_id']
        except KeyError:
            self.disconnect(401)
            return

        data['author_id'] = user_id

        async_to_sync(self.channel_layer.group_send)(
            f'chat_{data['chat_id']}',
            {
                'type': 'chat.message',
                'data': data,
            },
        )

    def chat_message(self, event):
        data = copy(event['data'])
        author = User.objects.get(id=data['author_id'])

        data['author'] = author
        del data['author_id']

        message = Message.objects.create(**event['data'])

        serializer = MessageSerializer(message)
        data_send = serializer.data

        self.send(text_data=json.dumps(data_send))
