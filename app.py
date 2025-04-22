import requests

def main() -> None:
    """
    Main function that lets a user know what direction the express lanes are going in
    :return:
    """
    print("=" * 60)
    print()
    print("WELCOME TO HOVerview")
    print()
    print("=" * 60)
    print()

    print("EXPRESS LANES ARE...")
    print(cheating_via_their_api())


def cheating_via_their_api() -> str:
    """
    This returns the api call they have apparently saying what direction the express lanes are going
    Even though they don't actually just post this on their website
    :return:
    """

    direction_api_url = "https://www.expresslanes.com/maps-api/lane-status"

    response = requests.get(direction_api_url)

    response_dict: dict = response.json()

    return response_dict['road95and395']


if __name__ == "__main__":
    main()