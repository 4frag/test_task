from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.views import Request, Response, status, APIView
from rest_framework.decorators import api_view
from logging import getLogger
from contextlib import suppress
from django.core.exceptions import ValidationError

from api.models import User, Cat, Message, Chat
from api.serializers import UserSerializer, CatSerializer, MessageSerializer
from api.permissions import AuthRequired
from api.functions import auth_required, auth_required_class


logger = getLogger('api')


@api_view(['GET'])
def ping(request: Request) -> Response:
    return Response({'message': 'pong!'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def session_status(request: Request) -> Response:
    try:
        return Response({'user_id': request.session['user_id']}, status=status.HTTP_200_OK)
    except KeyError:
        return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def login(request: Request) -> Response:
    data = request.data

    try:
        user = User.objects.get(username=data['username'])
        if user.password == data['password']:
            logger.info(f'Успешная авторизация пользователя {user.username}')
            request.session['user_id'] = user.id

            logger.info(dict(request.session))
            return Response({'user_id': user.id}, status=status.HTTP_200_OK)
        else:
            logger.info('Попытка авторизации с неправильным паролем')
            return Response({'message': 'Неверный пароль'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        logger.info('Попытка авторизации с несуществующим username')
        return Response({'message': 'Аккаунта с таким именем не существует. Вы можете его зарегистрировать'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def logout(request: Request) -> Response:
    with suppress(KeyError):
        del request.session['user_id']
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def register(request: Request) -> Response:
    data = request.data

    try:
        user = User.objects.get(username=data['username'])
        return Response({'message': 'Аккаунт с таким именем уже существует'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        try:
            user = User.objects.create(username=data['username'], password=data['password'])
        except ValidationError:
            logger.info(f'{data['username']} обращается к API не из фронтенда')
            return Response({'message': 'incorrect password format'}, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f'Успешное создание аккаунта {data['username']}')
        request.session['user_id'] = user.id
        return Response(status=status.HTTP_200_OK)


@auth_required
@api_view(['GET'])
def get_messages(request: Request) -> Response:
    query_messages = Message.objects.filter(author__id=request.session['user_id'])
    data = MessageSerializer(query_messages, many=True).data
    return Response(data=data)


@api_view(['GET'])
def get_or_create_chat(request: Request, interlocutor_id: int = None) -> Response:
    chat = Chat.objects.filter(members__id=request.session['user_id']).filter(members__id=interlocutor_id)

    if not chat.exists():
        chat = Chat.objects.create()
        chat.members.add(request.session['user_id'])
        chat.members.add(interlocutor_id)
    else:
        chat = chat.first()

    return Response(data={'chat_id': chat.id}, status=status.HTTP_200_OK)


class ChatsAPI(APIView):
    @auth_required_class
    def get(self, request: Request, chat_id=None) -> Response:
        user_id = request.session['user_id']
        if chat_id is None:
            chats_query = Chat.objects.filter(members__in=[User.objects.get(id=user_id)])

            data_serialized = []
            for chat in chats_query:
                interlocutor = User.objects.get(id=chat.members.exclude(id=user_id)[0].id)

                data_serialized.append(
                    {
                        'id': chat.id,
                        'interlocutor': UserSerializer(interlocutor).data,
                        'last_message': MessageSerializer(Message.objects.filter(chat=chat).last()).data,
                    }
                )
            return Response(data=data_serialized, status=status.HTTP_200_OK)
        else:
            try:
                chat = Chat.objects.get(id=chat_id)
            except Chat.DoesNotExist:
                return Response({'message': 'chat with such id does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            data_serialized = {
                'id': chat.id,
                'interlocutor': UserSerializer(interlocutor).data,
                'last_message': MessageSerializer(Message.objects.filter(chat=chat).last()).data,
            }
            return Response(data=data_serialized, status=status.HTTP_200_OK)


class MessagesAPI(APIView):
    @auth_required_class
    def get(self, request: Request) -> Response:
        chat_id = self.request.query_params.get('chat_id')
        if chat_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user_id = request.session['user_id']
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return Response({'message': 'chat with such id does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        if {'id': user_id} not in chat.members.values('id'):
            return Response({'message': 'you are not a member of this chat'}, status=status.HTTP_400_BAD_REQUEST)

        messages = Message.objects.filter(chat=chat)

        data_serialized = MessageSerializer(data=messages, many=True)
        data_serialized.is_valid()
        data_serialized = data_serialized.data
        return Response(data=data_serialized, status=status.HTTP_200_OK)


class UserViewSet(ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [AuthRequired]

    def get_queryset(self):
        if self.request.query_params.get('query'):
            return self.queryset.filter(username__startswith=self.request.query_params.get('query')).exclude(id=self.request.session['user_id'])
        return self.queryset


class CatsViewSet(ModelViewSet):
    serializer_class = CatSerializer
    queryset = Cat.objects.all()
    permission_classes = [AuthRequired]

    def get_queryset(self):
        return self.queryset.filter(owner__id=self.request.session['user_id'])

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Cat.objects.create(**request.data, owner=User.objects.get(id=request.session['user_id']))
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            cat = Cat.objects.get(id=pk)
            for field in request.data:
                setattr(cat, field, request.data[field])
            cat.save()
            return Response(status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
