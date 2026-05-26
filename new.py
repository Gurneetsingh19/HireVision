import google.generativeai as genai

genai.configure(api_key="AIzaSyBZGkzi6JZ445_x-XX7yTiYvIOZJcqMwJE")

for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"Model Name: {m.name}")