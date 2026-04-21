# AI Smart Food Health Assistant

A smart web application designed to help individuals make better food choices and build healthier eating habits. The application evaluates food items based on the user's primary health goals (e.g., Weight Loss, Fitness, or General Health) and provides a health score, calorie estimate, nutritional tips, and a suggested healthier alternative.

## Hackathon Features
- **Goal-Oriented Feedback**: Advice dynamically adapts based on whether the user wants to lose weight, gain muscle, or maintain general health. 
- **Intelligent Logic**: Uses contextual inputs to build better eating behaviors. 
- **Modern UI**: A responsive, beautifully designed glassmorphism UI that feels highly premium.
- **Cloud Run Ready**: Contains the required Dockerfile for an instant containerized deployment.

## Repository Contents
- `index.html`: Main structured frontend markup.
- `style.css`: Dynamic glassmorphism styling, responsive layouts, and animations.
- `script.js`: Intelligent logic core evaluating food inputs for health metrics and customized feedback.
- `Dockerfile`: An NGINX-alpine powered container prepared specifically for GCP Cloud Run port 8080 execution.

## Deployment to Google Cloud Run
This project includes a Dockerfile configured to run an Nginx server listening on port 8080, which complies with Google Cloud Run serverless deployment requirements.

```bash
# Provide your precise Google Cloud project ID
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/food-health-app
gcloud run deploy food-health-app --image gcr.io/YOUR_PROJECT_ID/food-health-app --platform managed --region us-central1 --allow-unauthenticated
```
