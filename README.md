# Intuition
Defective and counterfeit products are a major problem for the automobile and industrial tools industries, compromising vehicle safety, decreasing production efficiency, and leading to frequent equipment breakdowns. This project presents an intelligent platform for selling automotive and industrial parts that integrates blockchain technology with AI-based fraud detection in order to address these issues. The platform offers a mechanism for confirming the authenticity of parts, guaranteeing that any tampering or counterfeiting is prevented as soon as it is discovered.

# Project Description

The first component of the project is a seller-side model, which is used to assess a seller's authenticity based on a variety of characteristics related to the seller, such as the quantity of returned goods per 100, the rate of delays, the rate of fulfilment, and other comparable characteristics. However, the buyer side model is utilised to determine whether the customer is attempting to return a counterfeit item after receiving the correct one. The user's account age, return to order ratio, and other comparable data are used by the model for this purpose. Then comes the third component, the Blockchain part, which is used to make sure there is no tampering in the supply chain.
![ApproachDiagram](https://github.com/user-attachments/assets/2d12a735-52fe-4618-a7dd-915dfa5d37ba)


# AI Models

## Dataset
The dataset used to train both models was created artificially based on pertinent criteria, such as the buyer-side model's user history, account age, return to order ratio, fullfillment rate, delay rate, number of returned items per 100, and seller sentiment.
There are 10000 instances for buyer side model and 50000 instances for the seller side model.These dataset can be seen the Dataset Folder.

## Buyer Side Model
A fraud detection system was implemented to analyze customer behavior patterns. The model incorporated historical user data, examining various indicators including the ratio of orders to returns, credit scores, and how often users modified their credentials. During the evaluation phase, three machine learning approaches were tested: Random Forest, Neural Network, and K-Nearest Neighbors (KNN). Among these options, the Random Forest algorithm demonstrated superior performance in identifying potentially fraudulent activities. This suggests that ensemble-based decision trees were most effective at capturing the complex patterns associated with fraudulent customer behavior.<br/>

<img src=https://github.com/NiharMandahas/Supply_Chain_Fraud_Detection/blob/main/visuals/buyer.jpeg width=600 height=400>

## Seller Side Model
To detect fraud at  seller level, supervised machine learning models are explored. The model selection process involves extensive experimentation and performance evaluation.  Feature engineering was performed to transform seller metrics into meaningful inputs. The models were trained using supervised learning techniques, with validation conducted to ensure their performance was optimal. The core of the fraud detection system relied on machine learning models. Several algorithms, including Random Forest, Logistic Regression, SVM, Decision Tree, Gradient Boosting, and XGBoost, were tested. After evaluation, Random Forest was selected for final implementation. Hyperparameter tuning was carried out to enhance the models’ effectiveness for real-world deployment.<br/>

<img src=https://github.com/NiharMandahas/Supply_Chain_Fraud_Detection/blob/main/visuals/seller.jpeg width=600 height=400>

## Deployment
The deployment of the models is done with the help of hugging face spaces using gradio on the free tier and can be used on the hugging face website as well as with an API endpoint.<br/>

<img src=https://github.com/NiharMandahas/Supply_Chain_Fraud_Detection/blob/main/visuals/seller_model.png width=600 height=400><br/>

[Seller Side](https://huggingface.co/spaces/kugo16/Seller-side-model)<br/>


<img src=https://github.com/NiharMandahas/Supply_Chain_Fraud_Detection/blob/main/visuals/buyer_model.png width=600 height=400><br/>

[Buyer Side](https://huggingface.co/spaces/NiharMandahas/KNN_Fraud)

# Blockchain
A blockchain system was developed to authenticate automotive parts. The system ensures that buyers can verify whether a product is sold by a genuine seller.

## How It Works
### Manufacturer Generates QR Code:
The manufacturer records details such as product specifications, manufacturer info, and seller details.
The data is stored on the blockchain.
A QR code is generated and attached to the product.

### Buyer Verification:
When purchasing a product, the buyer scans the QR code through the portal.
The system checks the blockchain to verify the seller’s authenticity.
The buyer gets a confirmation message if the seller is genuine.

### Smart Contract Execution:
Smart contracts ensure that all transactions and modifications are securely recorded.
This prevents tampering and ensures transparency in the supply chain.

### Technologies Used
Ganache GUI (Ethereum Blockchain Development)
Solidity (Smart Contract Development)
Web3.js (Blockchain Interaction)

# Frontend
The frontend that is mainly used to demonstrate the whole workflow is done using react and tailwind css
# Backend
Django is used to build the backend for the entire e-commerce platform. It is mostly used to store user data, their activities, and transmit this data to the SQL database for the website's general operation.  The mysql client module facilitates the connection to the locally hosted SQL database. Because the AI models are cloud-based, they can be accessed via a straightforward API, and Groq has access to an additional API that provides the logic behind the anticipated outcome. 

# SQL-Database
SQL Database is used to maintain all the working components of the website like authorization page, kart feature, checkout page, order detailsetc. Currently it uses MySQL database hosted on local server, but can be easily ported to anyother hosting service.

# Visuals


<img src=https://github.com/NiharMandahas/Supply_Chain_Fraud_Detection/blob/main/visuals/img1.jpeg width=600 height=400><br/>

<img src=https://github.com/NiharMandahas/Supply_Chain_Fraud_Detection/blob/main/visuals/img2.jpeg width=600 height=400><br/>

<img src=https://github.com/NiharMandahas/Supply_Chain_Fraud_Detection/blob/main/visuals/img3.jpeg width=600 height=400><br/>


