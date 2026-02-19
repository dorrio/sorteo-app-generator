import sys
import time
import urllib.request
import urllib.error
import hashlib

BASE_URL = "http://localhost:3000/api/og"
TYPES_TO_TEST = [
    "secret-santa", "team", "dice", "coin", "rps",
    "card", "bingo", "country", "month", "list-randomizer"
]

def get_image(type_param):
    url = f"{BASE_URL}?type={type_param}"
    try:
        with urllib.request.urlopen(url) as response:
            if response.status != 200:
                print(f"Error fetching {type_param}: Status {response.status}")
                return None
            return response.read()
    except urllib.error.URLError as e:
        print(f"Error fetching {type_param}: {e}")
        return None

def main():
    print("Waiting for server...")
    # Simple retry logic to wait for server
    for i in range(60):
        try:
            with urllib.request.urlopen(BASE_URL) as response:
                if response.status == 200:
                    break
        except:
            time.sleep(1)
            print(".", end="", flush=True)
    else:
        print("\nServer not reachable.")
        sys.exit(1)
    print("\nServer is up.")

    print("Fetching generic image (type=unknown)...")
    generic_img = get_image("unknown")
    if not generic_img:
        sys.exit(1)

    generic_hash = hashlib.md5(generic_img).hexdigest()
    print(f"Generic image hash: {generic_hash}")

    print("Fetching control image (type=wheel)...")
    wheel_img = get_image("wheel")
    if not wheel_img:
        sys.exit(1)

    wheel_hash = hashlib.md5(wheel_img).hexdigest()
    if wheel_hash == generic_hash:
        print("CRITICAL: Control type 'wheel' matches generic image! Setup might be wrong.")
        # We don't exit here because if everything is broken, we want to know
    else:
        print("Control type 'wheel' differs from generic. Good.")

    failed = False
    for t in TYPES_TO_TEST:
        print(f"Testing type='{t}'...", end=" ")
        img = get_image(t)
        if not img:
            print("ERROR: Could not fetch.")
            failed = True
            continue

        img_hash = hashlib.md5(img).hexdigest()
        if img_hash == generic_hash:
            print(f"FAIL: Matches generic image.")
            failed = True
        else:
            print(f"PASS: Unique branding.")

    if failed:
        print("Verification FAILED: Some types are missing branding.")
        sys.exit(1)
    else:
        print("Verification PASSED: All types have unique branding.")
        sys.exit(0)

if __name__ == "__main__":
    main()
