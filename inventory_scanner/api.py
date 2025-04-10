from flask import Flask, jsonify, request
from db import Database
from auth import authenticate_user
from scanner import scan_barcode
import sys

app = Flask(__name__)
db = Database()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = authenticate_user(db, login=True, 
                           username=data.get('username'),
                           password=data.get('password'))
    return jsonify(user or {'error': 'Invalid credentials'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    user = authenticate_user(db, login=False,
                           username=data.get('username'),
                           password=data.get('password'))
    return jsonify(user or {'error': 'Registration failed'})

@app.route('/api/scan', methods=['POST'])
def scan():
    item_data = scan_barcode()
    if item_data:
        db.add_item(request.json['user_id'], item_data)
        return jsonify(item_data)
    return jsonify({'error': 'Scan failed'})

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    items = db.get_items(request.args.get('user_id'))
    return jsonify(items)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=10000)
