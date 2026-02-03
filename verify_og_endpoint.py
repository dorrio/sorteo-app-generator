import requests

def test_og_endpoint():
    url = "http://localhost:3000/api/og"
    params = {
        "name": "Test Winner",
        "type": "wheel",
        "title": "My Awesome Giveaway",
        "color": "#FF0000"
    }

    try:
        response = requests.get(url, params=params)
        print(f"Status Code: {response.status_code}")
        print(f"Content Type: {response.headers.get('content-type')}")

        if response.status_code != 200:
            print("Error Content:", response.text)
        else:
            print("Success! Image generated.")
            # Verify it's actually an image
            if response.headers.get('content-type') == 'image/png':
                with open('test_cert.png', 'wb') as f:
                    f.write(response.content)
                print("Saved to test_cert.png")
            else:
                print("Response was 200 but not an image/png")

    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_og_endpoint()
