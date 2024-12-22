import requests

def fetch_schedule(league: str):
    """
    Fetch game data from the ESPN API for a given league.
    
    Args:
        league (str): The league to fetch the schedule for (e.g., "mlb", "nba").
    
    Returns:
        list: A list of game events, or an error message if the request fails.
    """
    base_url = "https://site.api.espn.com/apis/site/v2/sports"
    league_urls = {
        "mlb": f"{base_url}/baseball/mlb/scoreboard",
        "nba": f"{base_url}/basketball/nba/scoreboard",
        "nfl": f"{base_url}/football/nfl/scoreboard",
        "nhl": f"{base_url}/hockey/nhl/scoreboard",
        "ncaafb": f"{base_url}/football/college-football/scoreboard"
    }
    
    url = league_urls.get(league.lower())
    
    if not url:
        return {"error": f"Unsupported league: {league}"}
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get("events", [])
    except requests.RequestException as e:
        return {"error": str(e)}
