from flask import Flask, request, jsonify
from flask_cors import CORS
import json

from sheets_controller import SheetsController
from chatgpt_controller import ChatGPTController

from game_session import GameSession

config = {}

with open("./server/config.json","r",encoding="utf-8") as f:
    config = json.load(f)


sheets = SheetsController(config["spreadsheet_id"])
 
settings = sheets.get_table_as_dict("settings")

themes = sheets.get_table_as_dict_2d("themes")

prompts = sheets.get_table_as_dict_2d("prompts")

captions = sheets.get_table_as_dict_2d("captions")


cards_list = sheets.get_table_with_header("cards")


chatgpt = ChatGPTController(config["gpt_key"],model=settings['model'])


app = Flask(__name__)
CORS(app)


game = {}

@app.route('/api/get_captions',methods=['GET'])
def get_captions():

    return jsonify({"languages": settings['languages'].split(', '),
                   "captions":captions})

@app.route('/api/new_game', methods=['POST'])
def new_game():
    print("NEW GAME CALLED")

    data = request.json
    language = data["language"]

    new_game = GameSession(ll_model = chatgpt,
                           prompts = prompts,
                           cards_list = cards_list,
                           themes = themes,
                           language = language)
    
    session_id = new_game.id

    game[session_id] = new_game

    return jsonify({"session_id": session_id})



@app.route('/api/get_cards', methods=['POST'])
def get_cards():
    data = request.json
    session_id = data["session_id"]

    cards = game[session_id].get_cards()

    return jsonify({"cards": cards})


@app.route('/api/start', methods=['POST'])
def start():
    data = request.json
    session_id = data["session_id"]

    next_title = game[session_id].next_title()

    return jsonify({"next_title": next_title})



@app.route('/api/apply_cards', methods=['POST'])
def apply_cards():
    data = request.json
    session_id = data["session_id"]
    print(data)
    selected_card_ids = data["selected_card_ids"]

    modified_title = game[session_id].apply_cards(selected_card_ids)

    return jsonify({"modified_title": modified_title})



@app.route('/api/action_ignore', methods=['POST'])
def action_ignore():
    data = request.json
    session_id = data["session_id"]

    next_title = game[session_id].action_ignore()

    return jsonify({"next_title": next_title})


@app.route('/api/action_post', methods=['POST'])
def action_post():
    data = request.json
    session_id = data["session_id"]

    next_title = game[session_id].action_post()
    
    return jsonify({"next_title": next_title})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
