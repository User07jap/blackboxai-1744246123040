import sqlite3
import os
import sys

class Database:
    def __init__(self):
        try:
            db_path = os.path.join(os.path.dirname(__file__), 'inventory.db')
            self.connection = sqlite3.connect(db_path)
            self.connection.row_factory = sqlite3.Row
            self._create_tables()
        except sqlite3.Error as e:
            print(f"Database connection error: {e}")
            sys.exit(1)

    def _create_tables(self):
        cursor = self.connection.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                barcode TEXT NOT NULL,
                name TEXT NOT NULL,
                quantity INTEGER DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, barcode)
            )
        """)
        self.connection.commit()
        cursor.close()

    def add_user(self, username, password):
        cursor = self.connection.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, password)
            )
            self.connection.commit()
            return True
        except sqlite3.IntegrityError as e:
            print(f"Error adding user: {e}")
            return False
        finally:
            cursor.close()

    def get_user(self, username):
        cursor = self.connection.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        )
        user = cursor.fetchone()
        cursor.close()
        return user

    def add_item(self, user_id, item_data):
        cursor = self.connection.cursor()
        try:
            cursor.execute(
                """INSERT INTO items 
                (user_id, barcode, name, quantity) 
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id, barcode) DO UPDATE SET quantity = quantity + 1""",
                (user_id, item_data['barcode'], item_data['name'], 1)
            )
            self.connection.commit()
            return True
        except sqlite3.Error as e:
            print(f"Error adding item: {e}")
            return False
        finally:
            cursor.close()

    def get_items(self, user_id):
        cursor = self.connection.cursor()
        cursor.execute(
            "SELECT * FROM items WHERE user_id = ?",
            (user_id,)
        )
        items = cursor.fetchall()
        cursor.close()
        return items
