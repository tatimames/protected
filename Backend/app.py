from flask import Flask, jsonify, request
import requests
from collections import defaultdict
import utils

app = Flask(__name__)

JSONPLACEHOLDER_URL = "https://jsonplaceholder.typicode.com/posts"


@app.route('/posts', methods=['GET'])
def fetch_posts():
    try:
        response = requests.get(JSONPLACEHOLDER_URL)
        response.raise_for_status() 
        return jsonify(response.json()), 200
    except requests.RequestException:
        return jsonify({"error": "Failed to fetch posts"}), 500


@app.route('/anomalies', methods=['GET'])
def identify_anomalies():
    """
    Identify posts with anomalies:
    1. Titles shorter than 15 characters.
    2. Duplicate titles by the same user.
    3. Users with more than 5 unique titles (potential bot behavior).
    """
    try:
        response = requests.get(JSONPLACEHOLDER_URL)
        response.raise_for_status()
        posts = response.json()
    except requests.RequestException:
        return jsonify({"error": "Failed to fetch posts"}), 500

    # Rearrange posts by user ID
    user_posts = defaultdict(list)
    for post in posts:
        user_posts[post['userId']].append(post)

    anomalies = {
        "short_titles": [post for post in posts if len(post['title']) < 15],
        "duplicate_titles": utils.detect_duplicate_titles(user_posts),
        "suspicious_users": utils.detect_suspicious_users(user_posts),
    }

    return jsonify(anomalies), 200


@app.route('/summary', methods=['GET'])
def summarize_data():
    """
    Generate a summary of data:
    1. Top 3 users with the most unique words in titles.
    2. Most common words across all titles.
    """
    try:
        response = requests.get(JSONPLACEHOLDER_URL)
        response.raise_for_status()
        posts = response.json()
    except requests.RequestException:
        return jsonify({"error": "Failed to fetch posts"}), 500

    user_word_counts = utils.calculate_user_word_counts(posts)
    top_users = utils.find_top_users(user_word_counts)

    most_common_words = utils.calculate_common_words(posts)

    summary = {
        "top_users": top_users,
        "most_common_words": most_common_words,
    }

    return jsonify(summary), 200


if __name__ == '__main__':
    app.run(debug=True)
