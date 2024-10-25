from rest_framework.permissions import BasePermission


class AuthRequired(BasePermission):
    def has_permission(self, request, view):
        try:
            request.session['user_id']
            return True
        except KeyError:
            return False
