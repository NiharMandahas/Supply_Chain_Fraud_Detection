from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from gradio_client import Client
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
import json
from .models import SellerDetails
import logging
import os
from groq import Groq


logger = logging.getLogger(__name__)

@csrf_exempt
def predict_seller_score(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        # Parse input data from the request body
        data = json.loads(request.body)
        print(data)
        # Extract comments from request
        comments = data.get('comments', [])
        
        # Initialize sentiment Gradio client
        client_senti = Client("NiharMandahas/comment_sentiment")
        
        # Analyze sentiment for all comments
        sentiments = []
        # print(comments)

        for comment in comments:
            try:
                result = client_senti.predict(
                    param_0=comment,
                    api_name="/predict"
                )
                # Ensure this debug print doesn't trigger multiple executions
                logger.info(f"Sentiment for comment '{comment}': {result}")
                
                sentiment_score = 1 if result['label'] == 'POSITIVE' else 0
                print(sentiment_score)
                sentiments.append(sentiment_score)
            except Exception as e:
                logger.warning(f"Error fetching sentiment for comment: '{comment}' - {str(e)}")

        
        # Calculate majority sentiment
        if sentiments:
            positive_count = sum(1 for score in sentiments if score > 0)
            negative_count = sum(1 for score in sentiments if score <= 0)
            sentiment = 1 if positive_count >= negative_count else 0
        else:
            sentiment = 1  # Default sentiment if no comments
            # category = data.get('Category')

        print(f"this is the one:{sentiment}")
        category = 'Automotive'
        account_age = float(data.get('account_age', 0))
        return_rate = float(data.get('return_rate', 0))
        fullfillment_rate = float(data.get('fullfillment_rate', 0))
        delay_rate = float(data.get('delay_rate', 0))
        cancelled_rate = float(data.get('cancelled_rate', 0))
        listings = 1  
        print(category)
        print(account_age)
        print(return_rate)
        print(fullfillment_rate)
#      
        # Initialize Gradio client
        client = Client("kugo16/Seller-side-model")
        values={"Account_Age_months":account_age,
            "Return_Rate_per_100":return_rate,
            "Fullfillment_rate":fullfillment_rate,
            "Delay_Rate_rate":delay_rate,
            "Cancelled_rate":cancelled_rate,
            "Listings":listings,
            "Sentiment":sentiment}
        
        
        
        # Call Gradio model for prediction
        result = client.predict(
            model_name="Random_Forest",
            Category=category,
            Account_Age_months=account_age,
            Return_Rate_per_100=return_rate,
            Fullfillment_rate=fullfillment_rate,
            Delay_Rate_rate=delay_rate,
            Cancelled_rate=cancelled_rate,
            Listings=listings,
            Sentiment=sentiment,
            api_name="/predict"
        )

        if result=='Not Fraud':
            prompt="The given values are the attribute values of e-commerce sellers based on these values suggest the reason why they might not be fraud in about 50 words strictly and give it from a third party prespective"

            summary=process_values_with_groq(values,prompt)
            print(summary)

        
        else:
            prompt="The given values are the attribute values of e-commerce sellers based on these values suggest the reason why they might be fraud in about 50 words strictly and give it from a third party prespective"

            summary=process_values_with_groq(values,prompt)
            



        # Log the prediction
        logger.info(f'Prediction score from Gradio: {result}')
        
        return JsonResponse({
            'success': True, 
            'prediction': result,
            'summary':summary, 
            'sentiment_details': {
                'total_comments': len(comments),
                'positive_sentiment_count': positive_count if 'positive_count' in locals() else 0,
                'negative_sentiment_count': negative_count if 'negative_count' in locals() else 0
            }
        }, status=200)
    
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    

def process_values_with_groq(values, prompt):
    key = ""
    client = Groq(api_key=key)
    
    # Handle dictionary input
    if isinstance(values, dict):
        # Convert dictionary to a formatted string
        values_str = ", ".join([f"{k}: {v}" for k, v in values.items()])
    else:
        # Fallback to previous string conversion for list/other types
        values_str = ", ".join(map(str, values))
    
    # Construct the full prompt
    full_prompt = f"{prompt}\n\nValues to process: {values_str}"
    
    # Make the API call
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": full_prompt
            }
        ],
        model="llama-3.3-70b-versatile"
    )
    
    # Return the generated response
    return chat_completion.choices[0].message.content

@api_view(['GET'])
def get_seller_details(request, seller_id):
    try:
        # Fetch the SellerDetails by seller_id (as a string)
        seller = get_object_or_404(SellerDetails, seller_id=seller_id)
        
        # Prepare the response data
        seller_data = {
            'seller_id': seller.seller_id,
            'email': seller.email,
            'seller_name': seller.seller_name,
            'account_age_months': seller.account_age_months,
            'return_rate_per_100': seller.return_rate_per_100,
            'fulfillment_rate': seller.fulfillment_rate,
            'delay_rate': seller.delay_rate,
            'cancelled_rate': seller.cancelled_rate,
            # 'sentiment': seller.sentiment,
        }

        # Return the data as a JSON response
        return JsonResponse({'success': True, 'seller_details': seller_data}, status=200)
    
    except SellerDetails.DoesNotExist:
        return JsonResponse({'error': 'Seller not found'}, status=404)
