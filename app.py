from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Load in the data.json file
with open('static/data.json') as data_file:
    data = json.load(data_file)
    islands = data['islands']


def update_islands():
    with open('static/data.json') as data_file:
        data = json.load(data_file)
        islands = data['islands']
    return islands


# Sort islands by their name (ascending)
islands.sort(key=lambda i: i['name'])


@app.route('/')
def index():  # put application's code here
    global islands
    islands = update_islands()
    return render_template('index.html', islands=islands)


@app.route('/islands/<island_type>')
def island_info(island_type):
    # Get the island with the type
    try:
        island_list = [i for i in islands if i[island_type]]
    except KeyError:
        island_list = []
    return render_template("index.html", islands=island_list)


if __name__ == '__main__':
    app.run(debug=True, port=8080)
