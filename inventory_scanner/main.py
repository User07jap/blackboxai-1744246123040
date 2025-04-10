import sys
from auth import authenticate_user
from scanner import scan_barcode
from db import Database

def main():
    db = Database()
    print("Inventory Management System")
    print("1. Login")
    print("2. Register")
    print("3. Exit")
    
    while True:
        choice = input("Enter choice: ")
        if choice == "1":
            user = authenticate_user(db, login=True)
            if user:
                scanner_menu(db, user)
        elif choice == "2":
            authenticate_user(db, login=False)
        elif choice == "3":
            sys.exit()
        else:
            print("Invalid choice")

def scanner_menu(db, user):
    print("\nScanner Menu")
    print("1. Scan Item")
    print("2. View Inventory")
    print("3. Logout")
    
    while True:
        choice = input("Enter choice: ")
        if choice == "1":
            item_data = scan_barcode()
            if item_data:
                db.add_item(user['id'], item_data)
        elif choice == "2":
            items = db.get_items(user['id'])
            print("\nInventory:")
            for item in items:
                print(f"{item['name']} - {item['quantity']}")
        elif choice == "3":
            return
        else:
            print("Invalid choice")

if __name__ == "__main__":
    main()
