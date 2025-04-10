
Built by https://www.blackbox.ai

---

```markdown
# Inventory Scanner

The Inventory Scanner is a web application that allows users to scan barcodes and manage an inventory of items. The application utilizes modern web technologies to provide a seamless user experience, incorporating features such as real-time barcode scanning, inventory management, and an intuitive user interface.

## Project Overview

This project includes a front-end developed using HTML, CSS, and JavaScript, paired with a Spring Boot back-end for managing item data. The front-end utilizes libraries such as Tailwind CSS for styling and Quagga.js for barcode scanning. Users can view and manage their inventory either by scanning items or entering barcodes manually.

## Installation

To run this project locally, you need to set up the front-end and back-end components. Follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/inventory-scanner.git
   cd inventory-scanner
   ```

2. **Set up the back-end:**
   - Navigate to the back-end directory (assuming it's where your Spring Boot project is).
   - Ensure you have Java and Maven installed.
   - Run the application using:
     ```bash
     ./mvnw spring-boot:run
     ```
   - The back-end API will run on `http://localhost:8080`.

3. **Set up the front-end:**
   - Open `index.html` in your web browser (`file://` URL) or serve it using a local server.

## Usage

- **Start Scanning:** Click the "Start Scanner" button to open the barcode scanner.
- **Manual Entry:** Enter a barcode in the input field and click "Add Item" to manually add it to the inventory.
- **View Inventory:** Click on "View All Items" to see a detailed list of all items in the inventory.
- **Scan an Item:** Aim the camera at a barcode; once detected, the item will be added to the inventory.

The application also provides a modal for adding item descriptions during scanning.

## Features

- Real-time barcode scanning with camera access.
- Manual entry for barcodes.
- Dynamic inventory management: add, view, and delete items.
- User-friendly interface built with Tailwind CSS.
- Responsive design suitable for mobile and desktop environments.
- View raw data of inventory items in a modal.

## Dependencies

Here are the main dependencies used in this project:

- **Frontend:**
  - Tailwind CSS for styling
  - Font Awesome for icons
  - Quagga.js for barcode scanning
  
- **Backend:**
  - Spring Boot for Java-based web applications
  - Spring Data JPA for database operations

Ensure you have these dependencies configured correctly in your project.

## Project Structure

The project structure is as follows:

```
inventory-scanner/
|-- index.html              # The main HTML file for the scanner interface
|-- items.html              # HTML file to display all inventory items
|-- style.css               # CSS styles for the application
|-- app.js                  # JavaScript for handling scanning and inventory logic
|-- items.js                # JavaScript for managing items in the items view
|-- InventoryScannerApplication.java  # Main entry point for the Spring Boot application
|-- InventoryController.java          # REST controller for handling inventory requests
|-- ItemRepository.java               # JPA repository interface for item management
```

### Additional HTML/CSS Files

- **`index.html`** - The main interface for scanning and inventory management.
- **`items.html`** - Displays a listing of all stored inventory items.
- **`style.css`** - Contains styles for all components, making use of Tailwind CSS.

### Additional Java Classes

- **`InventoryController.java`** - Manages API requests for inventory operations.
- **`ItemRepository.java`** - Provides database access methods for items.

## License

This project is open-source and available under the MIT License. Feel free to contribute and improve upon the code.

---

For any issues or contributions, please submit a pull request or create an issue in the repository. Thank you for checking out the Inventory Scanner project!
```