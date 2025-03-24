from django.db import models
from django.contrib.auth.models import User

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    time_slot = models.TimeField()
    is_booked = models.BooleanField(default=False)

    class Meta:
        unique_together = ("date", "time_slot")  

    def __str__(self):
        return f"{self.user.username} - {self.date} {self.time_slot}"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verification_otp = models.CharField(max_length=6, null=True, blank=True)
    verified = models.BooleanField(default=False)
    verification_expiry = models.DateTimeField(null=True, blank=True)

    def __str__(self):  
        return self.user.username
    
import uuid

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"Password reset token for {self.user.username}"
    