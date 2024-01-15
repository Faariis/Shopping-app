# Shopping App Based on Lists

## Description

Before the explanation I would like to say that this project significantly enhanced my CRUD-building skills because it was done in 3 days.

# Database
I utilized MySQL for the project, naming the database "prodavnica" (store). It comprises of four tables: shoppers, shopping_lists, shopping_items, and shopping_list_items. I aimed for simplicity in database design. In the MySQL folder, you'll find files to create these tables, including a baza.txt file with queries. Upon initiation, check the .env file for connection details, ensuring PASSWORD and USERNAME are configured.

# Backend
For the backend, I employed Node.js and Express.js, incorporating numerous CRUD endpoints. Eight endpoints cater to basic functionalities for shoppers and products, covering GET, POST, PATCH, and DELETE operations. While I tested it all in Postman, I implemented only GET functions to display data on the screen. Regarding shopping lists, there are eight CRUD endpoints. The first fetches all lists, the second retrieves a single list (primarily for testing). A single POST function creates a list, subject to specific validations outlined in the task. Two PATCH functions are present—one deletes a list, allowing the input of new products, user IDs, and names (used for testing), while the other adds a new product. Three delete functions are available, removing an entire list, a single product from a list, and all lists, respectively.

# Frontend
Angular was employed for the frontend, I mainly used a combination of gray and white with light blue details.

# Logic
The logic ensures a product appears in no more than three lists. Additionally, I imposed restrictions, allowing only one list per user and preventing the addition of the same product twice to a list. All constraints trigger alerts in the frontend. For simplicity, I passed IDs in the requests.

# Running the Project
After opening the project, execute 'npm install' in the terminal. Once dependencies are installed, run 'npm start' for Node and 'ng serve' for Angular. Find the database script in the folder and refer to the .env file for configuration details.





