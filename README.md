# 📰 Spread

[![GitHub Stars](https://img.shields.io/github/stars/Mayurwaghgpr/Spread?style=social)](https://github.com/Mayurwaghgpr/Spread/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Mayurwaghgpr/Spread?style=social)](https://github.com/Mayurwaghgpr/Spread/network/members)
[![MIT License](https://img.shields.io/github/license/Mayurwaghgpr/Spread)](LICENSE)

**Spread** is a full-stack publishing platform where users can write, share, and explore content with support for code snippets, rich text formatting, AI-powered post analysis, and developer-focused features.

---

## 📷 Live Demo

🔗 [https://spread-45xk.onrender.com](https://spread-45xk.onrender.com)

---

## 🚀 Features

- ✍️ Create posts with a dynamic editor (rich text + code snippets)
- 💡 AI-powered post analysis (point-by-point insights)
- 🔍 Unique username availability checker
- 👍 Like, 💬 comment, and 🔖 bookmark posts
- 🗨️ Mention users with `@username` in comments
- 👥 Follow and unfollow other users
- 🌗 Light, dark, and system theme support
- 🔐 Login with Google or GitHub
- 🔔 Real-time notifications (in development)
- 🛠️ Minor UX/UI enhancements and performance improvements

---

## 🛠️ Tech Stack

**Frontend:**

- React
- React Router DOM
- Redux
- TanStack Query
- Socket.io Client
- Tailwind CSS
- Monaco Editor
- Popover.js
- DOMPurify
- React Icons

**Backend:**

- Node.js
- Express.js
- JWT
- Socket.io
- Sequelize
- Multer
- Cloudinary
- OAuth (Google & GitHub) via Passport.js
- Nodemailer

**Database & Caching:**

- PostgreSQL
- Redis

**Security:**

- Helmet
- Express Rate Limit

---
## 📂 Folder Structure
Spread/
├── client/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── assets/ # Images and static files
│ │ ├── component/ # Reusable components
│ │ ├── hooks/ # Custom React hooks
│ │ ├── pages/ # Route-based pages
│ │ ├── sample/ # Demo or experimental files
│ │ ├── service/ # API call logic
│ │ ├── store/ # Redux store configuration
│ │ └── utils/ # Utility functions
│ └── test/
│ └── components/ # Component test cases
│
├── server/ # Express backend
│ ├── config/ # Configuration (DB, OAuth, etc.)
│ ├── controllers/ # Request handlers
│ ├── db/ # DB connection and triggers
│ ├── images/ # Uploaded images (temp/static)
│ ├── middleware/ # Middleware (auth, multer.js, passport.js)
│ ├── models/ # Sequelize models
│ ├── routes/ # API route definitions
│ ├── service/ # Worker services
│ └── socket/ # WebSocket event handlers
│
├── .env # Environment variables
└── README.md # Project documentation

---
## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Mayurwaghgpr/Spread.git

# Navigate into the project
cd Spread

# Install dependencies
npm install

# Start the development server
npm run dev

---
## 🤝 Contributing
Contributions are welcome and appreciated!
---

## ⑂ Fork the repository
```bash
Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'Add new feature')

Push to your branch (git push origin feature/your-feature)

Open a Pull Request
---
## 📄 License
- This project is licensed under the MIT License. See the LICENSE file for details.

## 📢 Feedback
If you find a bug or want to suggest a feature, feel free to [open an issue](https://github.com/Mayurwaghgpr/Spread/issues).

## 🙋‍♂️ Author
# Mayur Shashikant Wagh
- 🌐 [GitHub](https://github.com/Mayurwaghgpr)
- 📫 mayur2002wagh@gmail.com


## 🙌 Support
# If you like this project, consider giving it a ⭐️ and sharing it with others!
