# Intuition
Defective and counterfeit products are a major problem for the automobile and industrial tools industries, compromising vehicle safety, decreasing production efficiency, and leading to frequent equipment breakdowns. This project presents an intelligent platform for selling automotive and industrial parts that integrates blockchain technology with AI-based fraud detection in order to address these issues. The platform offers a mechanism for confirming the authenticity of parts, guaranteeing that any tampering or counterfeiting is prevented as soon as it is discovered.

# Project Description

The first component of the project is a seller-side model, which is used to assess a seller's authenticity based on a variety of characteristics related to the seller, such as the quantity of returned goods per 100, the rate of delays, the rate of fulfilment, and other comparable characteristics. However, the buyer side model is utilised to determine whether the customer is attempting to return a counterfeit item after receiving the correct one. The user's account age, return to order ratio, and other comparable data are used by the model for this purpose. Then comes the third component, the Blockchain part, which is used to make sure there is no tampering in the supply chain.

# AI Models

## Dataset
The dataset used to train both models was created artificially based on pertinent criteria, such as the buyer-side model's user history, account age, return to order ratio, fullfillment rate, delay rate, number of returned items per 100, and seller sentiment.
There are 10000 instances for buyer side model and 50000 instances for the seller side model.These dataset can be seen the Dataset Folder.

## Buyer Side Model

## Seller Side Model
To detect fraud at  seller level, supervised machine learning models are explored. The model selection process involves extensive experimentation and performance evaluation.  Feature engineering was performed to transform seller metrics into meaningful inputs. The models were trained using supervised learning techniques, with validation conducted to ensure their performance was optimal. The core of the fraud detection system relied on machine learning models. Several algorithms, including Random Forest, Logistic Regression, SVM, Decision Tree, Gradient Boosting, and XGBoost, were tested. After evaluation, Random Forest was selected for final implementation. Hyperparameter tuning was carried out to enhance the models’ effectiveness for real-world deployment.

## Deployment
The deployment of the models is done with the help of hugging face spaces using gradio on the free tier and can be used on the hugging face website as well as with an API endpoint.<br/>
[Seller Side](https://huggingface.co/spaces/kugo16/Seller-side-model)<br/>
[Buyer Side](https://huggingface.co/spaces/NiharMandahas/Customer_fraud_EL)

# Blockchain

# Frontend

# Backend

# Visuals
