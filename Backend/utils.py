from collections import Counter, defaultdict
from itertools import groupby

def detect_duplicate_titles(user_posts):
    """
    Detect duplicate titles by the same user.
    """
    duplicate_titles = []
    for user_id, posts in user_posts.items():
        titles = [post['title'] for post in posts]
        grouped_titles = groupby(sorted(titles))
        duplicates = [title for title, group in grouped_titles if len(list(group)) > 1]
        if duplicates:
            duplicate_titles.append({"userId": user_id, "duplicates": duplicates})

    return duplicate_titles


def detect_suspicious_users(user_posts):
    """
    Identify users with more than 5 unique titles.
    """
    suspicious_users = []
    for user_id, posts in user_posts.items():
        unique_titles = set(post['title'] for post in posts)
        if len(unique_titles) > 5:
            suspicious_users.append(user_id)

    return suspicious_users


def calculate_user_word_counts(posts):
    """
    Calculate the word counts for each user based on their post titles.
    """
    user_word_counts = defaultdict(Counter)
    for post in posts:
        words = post['title'].lower().split()
        user_word_counts[post['userId']].update(words)

    return user_word_counts


def find_top_users(user_word_counts):
    """
    Identify the top 3 users with the most unique words.

    Args:
        user_word_counts (dict): A mapping of userId to their word frequency counter.

    Returns:
        list: A list of the top 3 users and their unique word counts.
    """
    unique_word_counts = {user_id: len(word_count) for user_id, word_count in user_word_counts.items()}
    return sorted(unique_word_counts.items(), key=lambda x: x[1], reverse=True)[:3]


def calculate_common_words(posts):
    """
    Find the most common words across all post titles.
    """
    all_words = Counter()
    for post in posts:
        all_words.update(post['title'].lower().split())

    return all_words.most_common(10)