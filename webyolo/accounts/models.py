from django.contrib.auth.hashers import make_password, check_password
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


class MyUserManager(BaseUserManager):
    def create_user(self, nickname, email, password, **extra_fields):
        """
        Create user
        """
        if not email:
            raise ValueError('The Email field must be set')
        if not nickname:
            raise ValueError('Nickname must be set')
        email = self.normalize_email(email)
        user = self.model(nickname=nickname, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        """
        Set user as superuser
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        print(username, email, password, extra_fields)

        return self.create_user(username, email, password, **extra_fields)


class MyUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=300)
    nickname = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=50, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)

    objects = MyUserManager()

    REQUIRED_FIELDS = ['email', 'password', ]

    USERNAME_FIELD = 'nickname'
    EMAIL_FIELD = 'email'

    def __str__(self):
        return self.nickname

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

