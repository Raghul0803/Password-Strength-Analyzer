import re

def evaluate_password(password):
    score = 0
    feedback = []

    # Length
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Password should be at least 8 characters long.")

    # Uppercase
    if re.search(r"[A-Z]", password):
        score += 1
    else:
        feedback.append("Add at least one uppercase letter.")

    # Lowercase
    if re.search(r"[a-z]", password):
        score += 1
    else:
        feedback.append("Add at least one lowercase letter.")

    # Numbers
    if re.search(r"[0-9]", password):
        score += 1
    else:
        feedback.append("Add at least one number.")

    # Special characters
    if re.search(r"[!@#$%^&*()_+=\-./?]", password):
        score += 1
    else:
        feedback.append("Add at least one special character.")

    strength = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"]

    return {
        "score": score,
        "strength": strength[score],
        "feedback": feedback
    }
