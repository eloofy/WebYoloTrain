import random
from django.core.mail import send_mail
from django.conf import settings

def generate_code():
    return str(random.randint(100000, 999999))

def send_verification_email(email, code):
    send_mail(
        subject='Код подтверждения регистрации',
        message=f'Ваш код подтверждения: {code}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email]
    )