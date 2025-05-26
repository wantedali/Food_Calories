import os
import requests
from serpapi import GoogleSearch
from PIL import Image
from io import BytesIO
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Replace with your actual SerpAPI key
SERPAPI_KEY = "d800049270738d4289215c622c19a5373cf1092278332af21f0c43799ac6e46d"

# Dictionary mapping dish names to their corresponding save directories
dishes = {
 "بط محشي أرز": r"D:/GP/bat_ma7shy_roz",
    "حمام محشي": r"D:/GP/7amam_ma7shy",
    "مسقعة باللحمة المفرومة": r"D:/GP/mosa2a_bella7ma",
    "كباب حلة": r"D:/GP/kabab_7alla",
    "محشي كرنب": r"D:/GP/ma7shy_kromb",
    "صينية سمك بالبطاطس": r"D:/GP/saneyet_samak",
    "كوارع": r"D:/GP/kaware3",
    "شوربة العدس": r"D:/GP/shorbet_3ads",
    "بطاطس محمرة": r"D:/GP/batates_m7amara",
    "بيض بالبسطرمة": r"D:/GP/beid_bel_basterma"
}

#  Create directories if they don't exist
for path in dishes.values():
    os.makedirs(path, exist_ok=True)

def download_image(url, save_dir, count):
    """Downloads and saves an image from a URL."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        img_format = img.format if img.format else "jpg"
        img.save(os.path.join(save_dir, f"image_{count}.{img_format.lower()}"))
        print(f"Saved {count} in {save_dir}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")

def fetch_images(search_term, save_dir):
    """Fetches images for a given search term and downloads them."""
    params = {
        "q": search_term,
        "tbm": "isch",
        "ijn": 0,
        "num": 100,  # Fetch 100 images per request
        "api_key": SERPAPI_KEY
    }

    count = 0
    page = 0

    while count < 1000:  # Fetch up to 1000 images
        params["ijn"] = page
        search = GoogleSearch(params)
        results = search.get_dict()
        images = results.get("images_results", [])

        if not images:
            print(f"No more images found for {search_term}.")
            break

        for img in images:
            if count >= 1000:
                break
            download_image(img["original"], save_dir, count)
            count += 1

        page += 1  # Move to the next page

# Run the function for each dish
for dish, path in dishes.items():
    print(f"Downloading images for: {dish}")
    fetch_images(dish, path)

print(" All images downloaded successfully!")
