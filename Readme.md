# 🔗 URL Shortener (MERN - In Progress)

A basic URL Shortener backend application built using Node.js, Express, and MongoDB.  
This project allows users to convert long URLs into short URLs and redirect to the original link.

---

## 🚀 Current Features

- 🔗 Generate short URL from a long URL
- ↩️ Redirect to original URL using short ID
- 🗄️ Store URLs in MongoDB
- 📜 Maintain basic visit history

---

## 🛠️ Tech Stack

### Backend:

- Node.js
- Express.js

### Database:

- MongoDB (Mongoose)

### Utilities:

- shortid (for generating unique short IDs)
- dotenv

---

## 📂 Project Structure

backend/
│
├── controllers/
│ └── url.js
│
├── models/
│ └── url.js
│
├── routes/
│ └── url.js
│
├── index.js
├── connection.js
└── .env

---

## API Endpoints

➤ Create Short URL
POST /url

Body:

{
"url": "https://example.com"
}

Response:

{
"shortId": "abc123"
}
➤ Redirect to Original URL
GET /:shortId
Redirects user to the original URL
Also updates visit history

## Dependencies

express
mongoose
shortid
dotenv

👨‍💻 Author

Ajay Bhandari
