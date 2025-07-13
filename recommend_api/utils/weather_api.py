import os
import requests
from dotenv import load_dotenv

load_dotenv()
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_temp_and_humidity(lat: float, lon: float) -> tuple[float]:
    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]

        return temp, humidity
        # weather_main = data["weather"][0]["main"]

        # mapping = {
        #     "Clear": "Clear",
        #     "Clouds": "Clouds",
        #     "Rain": "Rain",
        #     "Drizzle": "Rain",
        #     "Thunderstorm": "Rain",
        #     "Snow": "Snow",
        #     "Mist": "Mist",
        #     "Fog": "Mist",
        #     "Haze": "Mist",
        #     "Smoke": "Mist",
        #     "Dust": "Mist",
        #     "Sand": "Mist",
        # }

        # return mapping.get(weather_main, "Clear")  # 기본값 Clear

    except Exception as e:
        print(f"[Weather API Error] {e}")
        return "Clear"
