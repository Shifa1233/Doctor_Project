from django.urls import path
from .views import *

urlpatterns = [
    path("register/", RegisterUser.as_view()),
    path("login/", LoginUser.as_view()), 
    path('verify-otp/', VerifyOTP.as_view()),
    path('forget/', forget , name='forget'),
    path("available-slots/", AvailableAppointments.as_view()),
    path("book-appointment/", BookAppointment.as_view()),
    path("my-appointments/", UserAppointments.as_view()),
    path('delete/', DeleteAppointment.as_view(), name='delete-appointment'),
    path("doctor-appointments/", DoctorAppointments.as_view()),
    path('set/', SetNewPassword.as_view()),
]
