# 🌿 Green Grooves

> A centralized sustainability platform connecting students and individuals with NGOs, institutions, and eco-conscious organizations for volunteering, internships, and green events.

---

## 📌 Project Overview

**Green Grooves** solves the discovery gap between eager students—especially engineering and collegiate youth—and organizations running impactful environmental and sustainability initiatives. 

While organizations and government agencies regularly seek volunteers and interns, students often lack direct routes to find or apply for these opportunities. Green Grooves bridges this gap with an all-in-one portal featuring role-based dashboards, verified event listings, direct application processing, and an intelligent AI assistant.

---

## ✨ Key Features

- **Role-Based Portals:** Dedicated onboarding and login experiences for both **Users/Students** and **Organizations**.
- **Opportunity Discovery & Search:** Students can search, filter, and view events, internships, and volunteer requests hosted by specific organizations.
- **Organization Management:** Organizations can create profiles, upload their brand logos, and post events, volunteer services, and paid/unpaid internships.
- **Direct Application System:** Streamlined application submission for students applying to open service programs and internships.
- **AI-Powered Onboarding Assistant:** Integrated Azure AI Model Inference running `gpt-4o` to guide new users, answer platform FAQs, and explain registration/enrollment workflows.
- **Media Uploads:** Static media and logo hosting managed seamlessly with `multer`.

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose ODM](https://mongoosejs.com/)
- **AI & Inference:** [@azure-rest/ai-inference](https://www.npmjs.com/package/@azure-rest/ai-inference) (`gpt-4o` model) & `@azure/core-auth`
- **File Handling:** [Multer](https://www.npmjs.com/package/multer) for multipart/form-data image uploads
- **Security & Config:** `dotenv`, `cors`, `body-parser`

### Frontend & Assistants
- **Frontend Core:** Responsive UI with AngularJS dynamic data binding
- **Assistant Integration:** Azure AI endpoint & Tidio live guidance widgets

---

## 📂 Project Structure

```text
├── public/                 # Static front-end assets (HTML, styles, scripts)
│   ├── reghome.html        # Entry / Registration landing page
│   └── ...
├── uploads/                # Uploaded organization and event logos
├── server.js               # Express application setup, routes, and DB models
├── package.json            # Project dependencies and metadata
├── package-lock.json       # Resolved dependency tree
└── .env                    # Environment variables (private)
