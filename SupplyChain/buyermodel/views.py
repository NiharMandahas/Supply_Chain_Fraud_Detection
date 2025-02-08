from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from review.models import BuyerDetails
from gradio_client import Client

# Initialize Gradio Client
client = Client("NiharMandahas/Customer_fraud_EL",verbose=True)

@csrf_exempt
def buyer_fraud_prediction(request):
    """API to return fraud prediction for a given buyer_id"""
    buyer_id = request.GET.get("buyer_id")

    if not buyer_id:
        return JsonResponse({"error": "buyer_id is required"}, status=400)

    try:
        buyer = BuyerDetails.objects.get(buyer_id=buyer_id)
    except BuyerDetails.DoesNotExist:
        return JsonResponse({"error": "Buyer not found"}, status=404)

    # Call Gradio model for fraud prediction
    fraud_prediction = client.predict(
        account_age=buyer.Account_Age,
        cred_changes_freq=float(buyer.Cred_change),
        return_order_ratio=float(buyer.retorder),
        vpn_usage=buyer.VPN,
        credit_score=float(buyer.Credit_Score),
        api_name="/predict"
    )
    print(fraud_prediction)
    return JsonResponse({"buyer_id": buyer.buyer_id, "fraud_prediction": fraud_prediction})
