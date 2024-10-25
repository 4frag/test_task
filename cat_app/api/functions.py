from functools import wraps
from typing import Callable
from rest_framework.response import Response
from rest_framework import status


def auth_required(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            args[0].session['user_id']
            return func(*args, **kwargs)
        except KeyError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    return wrapper


def auth_required_class(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            args[1].session['user_id']
            return func(*args, **kwargs)
        except KeyError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    return wrapper
