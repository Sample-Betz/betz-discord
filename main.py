from dotenv import load_dotenv
from commands import fetch_schedule
import discord
import os

load_dotenv()  # Load all variables from the .env file
bot = discord.Bot(intents=discord.Intents.all())  # Create bot object with all intents

# Map league to image file
LEAGUE_LOGO_MAP = {
    "mlb": "assets/mlb_logo.png",
    "nba": "assets/nba_logo.png",
    "nhl": "assets/nhl_logo.png",
    "nfl": "assets/nfl_logo.png",
    "ncaafb": "assets/ncaafb_logo.png"
}

@bot.slash_command(
    name="schedule", 
    description="List of schedules for the given league", 
    guild_ids=[1280697290910076959]
)
async def show_schedule(ctx: discord.ApplicationContext, league: str = discord.Option(
    str,
    "Which league's schedule would you like to view?",
    choices=["mlb", "nba", "nfl", "nhl", "ncaafb"]
)):
    # Fetch the respective schedule based on the league choice
    events = fetch_schedule(league)

    # Check for errors
    if isinstance(events, dict) and "error" in events:
        await ctx.respond(f"Error fetching {league.upper()} data: {events['error']}")
        return

    # Check if there are any events
    if not events:
        await ctx.respond(f"No {league.upper()} games found.")
        return
    
    # Create an embed to display games
    embed = discord.Embed(
        title=f"{league.upper()} Schedule",
        color=discord.Color.blue()
    )

    # Set league logo as thumbnail
    logo_path = LEAGUE_LOGO_MAP.get(league.lower())
    if logo_path and os.path.exists(logo_path):
        # Use discord.File to send the file as an attachment
        with open(logo_path, 'rb') as logo_file:
            file = discord.File(logo_file, filename="logo.png")
            # Attach the file and set it as the thumbnail
            embed.set_thumbnail(url="attachment://logo.png")

    # Iterate through games
    for event in events:
        # Gives Clock Time - Period (shortDetail)
        status = event.get("status", {}).get("type", {}).get("shortDetail", "N/A")
        # Gives description (Scheduled / In Progress / Final)
        description = event.get("status", {}).get("type", {}).get("description", "N/A")
        # Iterates through competitions, gets teams per competition
        competition = event.get("competitions", [])[0]
        teams = competition.get("competitors", [])

        # Initialize team variables
        home_team = "N/A"
        away_team = "N/A"

        # Initialize different game statuses
        fstatus = ""
        ipstatus = ""

        # Get team details
        for team in teams:
            # Gets team name
            team_name = team.get("team", {}).get("displayName", "N/A")
            # Gets team score for the game
            score = team.get("score", 0)
            home_away = team.get("homeAway", "N/A")
            records = team.get("records", [])
            overall_record = next(
                (record.get("summary") for record in records if record.get("name") == "overall"),
                "0-0"
            )
            # Determine whether non-started, in-progress, or completed
            if description == "Final":
                fstatus += f"{team_name} - {score}\n"
            elif description == "In Progress" or description == "End of Period":
                ipstatus += f"{team_name} - {score}\n"
            if home_away == "home":
                home_team = f"{team_name} ({overall_record})"
            elif home_away == "away":
                away_team = f"{team_name} ({overall_record})"

        # Construct game name
        game_name = f"{away_team} @ {home_team}"

        if description == "Final":
            status = fstatus
        elif description == "In Progress" or description == "End of Period":
            description = status
            status = ipstatus

        # Add the game details to the embed
        embed.add_field(
            # Away Team (Record) @ Home Team (Record)
            name=game_name,
            # [Scheduled / In Progress (Shows clock + period/quarter) / Final]
            # Home Team - Score
            # Away Team - Score
            value=f"[**{description}**]\n{status}",
            inline=False
        )
    
    # Send the embed
    await ctx.respond(embed=embed, file=file)


# Bot message for start-up
@bot.event
async def on_ready():
    print(f"{bot.user} is ready and online!")

# Slash command - /hello
@bot.slash_command(name="hello", description="Say hello to the bot!", guild_ids=[1280697290910076959])
async def hello(ctx: discord.ApplicationContext):
    await ctx.respond("Hey!")

bot.run(os.getenv('TOKEN'))
