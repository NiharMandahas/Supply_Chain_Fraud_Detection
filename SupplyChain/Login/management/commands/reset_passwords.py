from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from Login.models import LoginDetails

class Command(BaseCommand):
    help = 'Resets all passwords to "pass"'

    def handle(self, *args, **kwargs):
        users = LoginDetails.objects.all()
        for user in users:
            user.password = make_password('pass')
            user.save()

        self.stdout.write(self.style.SUCCESS("All passwords have been reset to 'pass'."))
