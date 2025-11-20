from flask import Flask, request, jsonify
from flask_cors import CORS  # <--- Make sure this says 'flask_cors', NOT 'flash' or 'flask'
from password_strength import evaluate_password

app = Flask(__name__)
CORS(app)  # <--- This line unlocks the browser connection

@app.route('/check-password', methods=['POST'])
def check_password():
    data = request.get_json()
    password = data.get('password', '')

    result = evaluate_password(password)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)