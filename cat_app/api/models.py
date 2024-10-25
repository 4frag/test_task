from django.db import models


class User(models.Model):
    username = models.CharField(max_length=100, unique=True, verbose_name='Логин')
    password = models.CharField(max_length=64, verbose_name='sha-256 hash от пароля')

    def __str__(self):
        return self.username


class Cat(models.Model):
    name = models.CharField(max_length=100, verbose_name='Имя кота')
    birth_date = models.DateField(blank=True, null=True, verbose_name='Дата рождения')
    breed = models.CharField(max_length=100, null=True, blank=True, default='', verbose_name='Порода')
    hairiness = models.PositiveIntegerField(null=True, blank=True, default=1, verbose_name='Коэффициент волосатости')
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE, verbose_name='Собственник')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs) -> None:
        if isinstance(self.hairiness, int):
            if self.hairiness > 0 and self.hairiness < 6:
                super().save(*args, **kwargs)

            return None
        super().save(*args, **kwargs)


class Chat(models.Model):
    members = models.ManyToManyField(User)


class Message(models.Model):
    author = models.ForeignKey(to=User, related_name='send_messages', on_delete=models.CASCADE)
    chat = models.ForeignKey(to=Chat, related_name='messages', on_delete=models.CASCADE)

    text = models.CharField(max_length=1000)
    date_of_send = models.DateTimeField(auto_now_add=True, editable=False)
