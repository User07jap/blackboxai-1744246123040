import getpass
from db import Database

def authenticate_user(db, login=True):
    username = input("Username: ")
    password = getpass.getpass("Password: ")
    
    if login:
        user = db.get_user(username)
        if user and user['password'] == password:
            print("Login successful!")
            return user
        print("Invalid credentials")
        return None
    else:
        if db.add_user(username, password):
            print("Registration successful!")
        else:
            print("Registration failed")
