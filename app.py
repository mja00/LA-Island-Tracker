import json

from flask import Flask, render_template, send_from_directory
from flask_sitemap import Sitemap

app = Flask(__name__)
ext = Sitemap(app=app)

# Load in the data.json file
with open('static/data.json') as data_file:
    data = json.load(data_file)
    islands = data['islands']


def update_islands():
    with open('static/data.json') as data_file:
        data = json.load(data_file)
        islands = data['islands']
    return islands


# Look while this is really janky, it's just okay, don't judge me
# If I was using python3.10 then I'd just use a switch case
# but look at me using 3.9 like a fucking loser
def convert_island_type_to_proper_name(island_type):
    if island_type == 'adventure_island':
        return 'Adventure Islands'
    elif island_type == 'pvp_enabled':
        return 'PvP Islands'
    elif island_type == 'pirate_coin':
        return 'Pirate Coin Islands'
    elif island_type == 'honing_materials':
        return 'Honing Material Islands'
    elif island_type == 'engraving_island':
        return 'Engraving Book Islands'
    elif island_type == 'timed_island':
        return 'Timed Islands'
    elif island_type == 'una_task':
        return 'Una Task Islands'
    elif island_type == 'rapport':
        return 'Rapport Islands'
    elif island_type == 'token':
        return 'Islands with Tokens'


# Sort islands by their name (ascending)
islands.sort(key=lambda i: i['name'])


@app.route('/islands')
@app.route('/')
def index():  # put application's code here
    # global islands
    # islands = update_islands()
    return render_template('index.html', islands=islands, title="All Islands")


@app.route('/islands/<island_type>')
def island_info(island_type):
    # Get the island with the type
    try:
        island_list = [i for i in islands if i[island_type]]
    except KeyError:
        island_list = []
    return render_template("index.html", islands=island_list, title=convert_island_type_to_proper_name(island_type))


@app.route('/islands/tier/<tier>')
def island_tier(tier):
    # Get the islands with the specified tier
    try:
        island_list = [i for i in islands if i['tier'] == int(tier)]
    except KeyError:
        island_list = []
    return render_template("index.html", islands=island_list, title=f"Tier {tier} Islands")


@app.route('/islands/ilvl/<ilvl>')
def island_ilvl(ilvl):
    # Get the islands with an ilvl equal to or higher than the specified ilvl
    try:
        island_list = [i for i in islands if i['ilvl'] >= int(ilvl)]
    except KeyError:
        island_list = []
    return render_template("index.html", islands=island_list, title=f"Ilvl {ilvl}+ Islands")


@app.route('/browserconfig.xml')
def browser_config():
    return send_from_directory('static', 'favicons/browserconfig.xml')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicons/favicon.ico')


@ext.register_generator
def index():
    yield 'index', {}


@ext.register_generator
def island_info():
    for info, i in zip(islands[0], range(0, len(islands[0]))):
        # Skip the first 6 fields
        if i < 6:
            continue
        yield 'island_info', {'island_type': info}


@ext.register_generator
def island_tier():
    for tier in range(1, 4):
        yield 'island_tier', {'tier': tier}


if __name__ == '__main__':
    app.run(debug=True, port=8080)
