# Data Anomalies Dashboard

## Description
A dashboard for viewing anomalies and summaries of data from the JSONPlaceholder API.

## Project Structure
- **Backend**: Flask app (Python).
- **Frontend**: React app (JavaScript).

---

## How to Build and Run the Application

> **Note:** Ensure that Docker Engine is running on your computer before proceeding.

### **1. Clone the Repository**

Clone the repository to your local machine using the following command:

```bash
git clone <repository-url>
```

### **2. Build and Start the Application**

Navigate to the project's root folder and run the following command to build and launch the application:

```bash
docker compose up --build -d
```

---

## Access the Application

- Ensure both the backend and frontend servers are running.
- Open your browser and navigate to: [http://localhost:3000](http://localhost:3000).

---

## Backend Endpoints

### **1. `/posts`**
Fetches and returns raw data from the JSONPlaceholder API.

### **2. `/anomalies`**
Processes and identifies posts with the following conditions:
- Titles shorter than 15 characters.
- Duplicate titles by the same user.
- Users with more than 5 posts having similar titles (e.g., detecting bots or bad actors).

### **3. `/summary`**
- Identifies the users (`userId`) with the most unique words across all their post titles.
- Returns the top three users based on this metric.
- Lists the most frequently used words across all post titles.

---

## Frontend Features

### **1. Anomalies Table**
Displays flagged posts with:
- **Columns**: `userId`, `id`, `title`, and the `reason` for flagging.
- **Filtering**: Filter anomalies by `userId` using the searchbar.
- **Sorting**: Sort anomalies by any column by clicking on then.

### **2. Summary Panel**
Provides insights based on the `/summary` endpoint:
- **Top Users**: Displays the top three users with the most unique words in their post titles.
- **Common Words**: Highlights frequently used words. **Hover over the word to see how many times it was used**.

---
