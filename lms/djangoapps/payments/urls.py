from django.urls import path
from . import views

urlpatterns = [
    path("stripe/checkout/", views.create_stripe_checkout, name="stripe-checkout"),
    path("mobile-money/", views.mobile_money_payment, name="mobile-money"),
    path("paypal/", views.paypal_payment, name="paypal-payment"),
    path("history/", views.list_payments, name="payment-history"),
    path("webhooks/stripe/", views.stripe_webhook, name="stripe-webhook"),
]
