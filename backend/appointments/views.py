from rest_framework import generics, permissions , status
from .models import Appointment , Profile ,PasswordResetToken
import uuid
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from .serializers import AppointmentSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view , permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def forget(request):
    if request.method == "POST":
        data = request.data
        print("Received data:", data)
        
        if 'email' not in data:
            return Response({"message": "Please enter the email"}, status=400)
        else:
            try:
                user = User.objects.get(email=data['email'])
                print("User found:", user)
                
                if user.profile.verified: 
                    print("User is verified")
                    otp = get_random_string(length=6, allowed_chars='0123456789')

                    subject = 'Email Verification OTP'
                    message = f'Your OTP for email verification is: {otp}'
                    send_mail(
                        subject,
                        message,
                        settings.EMAIL_HOST_USER,
                        [data['email']],
                        fail_silently=False,
                    )
                    user.profile.verification_otp = otp  
                    user.profile.save()

                    user.profile.verification_expiry = timezone.now() + timedelta(days=1)
                    user.profile.save()

                    return Response({"message": "User registered successfully.  OTP sent to your email."}, status=201)
                else:
                    return Response({"message": "User is not registered or not verified"}, status=400)
            
            except ObjectDoesNotExist:
                return Response({"message": "Invalid email, user does not exist."}, status=404)
            except Exception as e:
                print("Error occurred:", e)  
                return Response({"message": f"An error occurred: {str(e)}"}, status=500)

class SetNewPassword(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def put(self, request):
        print("Request Data:", request.data)
        token = request.data.get("token")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        print(token)

        if not token or not new_password or not confirm_password:
            return Response({"error": "Token, new password, and confirm password are required"}, status=400)
        
        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)

        try:
            password_reset_token = PasswordResetToken.objects.get(token=token)

            if timezone.now() > password_reset_token.expires_at:
                return Response({"error": "Token has expired"}, status=400)

            user = password_reset_token.user

            user.set_password(new_password)
            user.save()
            
            password_reset_token.delete()

            return Response({"message": "Password has been successfully reset."}, status=200)
        
        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Invalid or expired token"}, status=400)

class VerifyOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        otp = request.data["otp"]

        if not otp:
            return Response({"error": "OTP is required"}, status=400)
        
        try:
            profile = Profile.objects.get(verification_otp=otp)
            user = profile.user

            if timezone.now() > profile.verification_expiry:
                return Response({"error": "OTP expired. Please request a new one."}, status=400)

            profile.verified = True
            profile.save()

            user.is_active = True
            user.save()

            reset_token = uuid.uuid4()  
            password_reset_token = PasswordResetToken.objects.create(
                user=user,
                token=reset_token,
                created_at=timezone.now(),
                expires_at=timezone.now() + timedelta(hours=1)  
            )

            print(reset_token)
            return Response({"message": "Email verified successfully", "reset_token": str(reset_token)}, status=200)
        
        except Profile.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=400)
        

class RegisterUser(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data["username"]
        email = request.data["email"]
        password = request.data["password"]
        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=400)
        
        user = User.objects.create_user(username=username, email=email, password=password)
        
        otp = get_random_string(length=6, allowed_chars='0123456789')

        subject = 'Email Verification OTP'
        message = f'Your OTP for email verification is: {otp}'
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        user.profile.verification_otp = otp 
        user.profile.save()

        user.profile.verification_expiry = timezone.now() + timedelta(days=1)
        user.profile.save()

        return Response({"message": "User registered successfully.  OTP sent to your email."}, status=201)

class LoginUser(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        try:
            user = authenticate(username=username, password=password)
            if user:
                if not user.profile.verified:
                    user.delete()
                    return Response({"error": "User is not verified. Data has been deleted."}, status=400)

                refresh = RefreshToken.for_user(user)
                return Response({
                    "username": str(user.username),
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "message": "Login successful"
                }, status=200)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=400)
        
class AvailableAppointments(APIView):
    def get(self, request):
        date = request.query_params.get("date")
        if not date:
            return Response({"error": "Date is required"}, status=400)

        day_of_week = datetime.strptime(date, "%Y-%m-%d").weekday()
        if day_of_week == 6:  
            return Response({"message": "No appointments on Sunday"}, status=400)

        booked_slots = list(
            Appointment.objects.filter(date=date, is_booked=True)
            .values_list("time_slot", flat=True)
        )
        booked_slots = [slot.strftime("%H:%M") for slot in booked_slots]  # Convert to string

        all_slots = ["09:00", "10:00", "11:00", "12:00","13:00", "14:00", "15:00", "16:00"]

        response_data = [
            {"time_slot": slot, "status": "booked" if slot in booked_slots else "available"}
            for slot in all_slots
        ]

        return Response({"slots": response_data})

class BookAppointment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        date = request.data.get("date")
        time_slot = request.data.get("time_slot")

        if Appointment.objects.filter(date=date, time_slot=time_slot).exists():
            return Response({"error": "Slot already booked"}, status=400)

        Appointment.objects.create(user=request.user, date=date, time_slot=time_slot, is_booked=True)
        return Response({"message": "Appointment booked successfully"}, status=201)

class UserAppointments(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        today = timezone.now().date()
        return Appointment.objects.filter(user=self.request.user, date__gte=today)

class DoctorAppointments(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            return Appointment.objects.none()
        today = timezone.now().date()
        return Appointment.objects.filter(date__gte=today)
    
class DeleteAppointment(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        date = request.data.get('date')
        time_slot = request.data.get('time_slot')

        if not date or not time_slot:
            return Response({"error": "Both 'date' and 'time_slot' are required to delete an appointment."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            appointment = Appointment.objects.get(date=date, time_slot=time_slot, user=request.user)
            appointment.delete()
            return Response({"message": "Appointment successfully deleted."}, status=status.HTTP_200_OK)

        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found for this date and time."}, status=status.HTTP_404_NOT_FOUND)