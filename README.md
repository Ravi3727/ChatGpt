### ChatGPT Low Level Design - Production Grade Clone  
#### A fully functional, production-grade, pixel-perfect ChatGPT clone built from scratch without AI assistance in development (used only for learning and writing this README 😅) — built to demonstrate architectural, backend, and frontend design expertise.  

Live Demo: https://chat-gpt-gamma-five-82.vercel.app  

#### ✅ Features 
✨ Pixel-perfect ChatGPT-style UI 

💬 Real-time Chat powered by Vercel AI SDK (model: gemini-2.0-flash-exp) 

🧠 Chat Memory Management 

🖼️ File & Image Upload (Cloudinary integration) 
 
✍️ Message Editing Support 

🔒 Clerk Authentication 

📦 MongoDB backend with modular Express.js API 

☁️ Deployed on Vercel with fully configured environment 

🧱 Clean, modular, monorepo-style codebase architecture  

#### 📁 Folder Structure  
``` 
├── app/                   # Frontend (Next.js App Router)  
│   ├── (web)/             # Pages & Layouts  
│   ├── components/        # Reusable UI components 
│   ├── lib/               # Utilities (e.g., file upload, validators) 
│   └── ui/                # UI building blocks (chat box, sidebar etc.) 
├── backend/               # Express.js backend API 
│   ├── routes/            # Route handlers 
│   ├── controllers/       # Request logic 
│   ├── models/            # MongoDB Schemas 
│   └── utils/             # Cloudinary, multer, DB config 
├── public/                # Static assets 
├── .env.example           # Sample environment file 
└── README.md              # This file

```

#### 🧪 Technologies Used  

```

| Category           | Stack                                           |  
| ------------------ | ----------------------------------------------- |    
| **Frontend**       | Next.js (App Router), TailwindCSS, Lucide-react | 
| **Backend**        | Node.js, Express.js                             | 
| **Database**       | MongoDB (Mongoose)                              | 
| **Authentication** | Clerk                                           | 
| **Validation**     | Zod                                             | 
| **File Upload**    | Multer, Cloudinary                              | 
| **AI Integration** | Vercel AI SDK + Gemini 2.0 Flash Exp            | 
```

#### 🔌 Backend Routes  

##### 1. POST /api/addChat 
Adds a new chat or updates an existing one. 

Payload: 
 
``` 
{ 
  "title": "My first chat", 
  "userId": "user_xyz", 
  "question": "What is LLD?", 
  "chatId": "new", // or existing chatId 
  "answer": "LLD is...", 
  "fileUrls": ["https://cloudinary.com/abc.png"] 
} 
```

##### 2. GET /api/chat/[userId] 
Fetch all chats for a specific user. 

Params: userId 

##### 3. POST /api/editChat 
Update a specific message in a chat. 

Payload: 
``` 
{ 
  "chatId": "chat_xyz", 
  "messageId": "msg_abc", 
  "question": "Updated question?", 
  "answer": "Updated answer.", 
  "title": "Updated Chat Title" 
}  
```

##### 4. GET /api/getChatByChatId 
Get full chat data by chatId. 

Params: chatId 

5. POST /api/upload 
Upload image/file to Cloudinary. 

Payload: multipart/form-data 
Return: Cloudinary file URL 


##### 🧬 MongoDB Schema (Chat Collection) 
Each document in the Chat collection contains: 

``` 
{ 
  _id: ObjectId, 
  userId: String, 
  title: String, 
  chatId: String, 
  messages: [ 
    { 
      messageId: String, 
      question: String, 
      answer: String, 
      fileUrls: [String] 
    } 
  ], 
  createdAt: Date, 
  updatedAt: Date 
}   
```

##### 🛠️ Local Setup Instructions 

1. Clone the Repository
``` 
git clone https://github.com/Ravi3727/ChatGpt.git  
cd chatgpt-clone 
```

#### 2. Install Dependencies  
 
``` 
pnpm install 
```

##### 3. Set Up Environment Variables  
Create a .env file in the root using .env.example as reference. Fill in: 

``` 
MONGODB_URI=<your-mongo-uri> 
CLOUDINARY_CLOUD_NAME=<cloud-name> 
CLOUDINARY_API_KEY=<api-key> 
CLOUDINARY_API_SECRET=<api-secret> 
CLERK_SECRET_KEY=<your-clerk-secret> 
CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
```


##### 4. Run the App 
```
npm run dev
```

Backend and frontend will run in monorepo-style within the same Next.js app structure.  


##### 🙌 A Note from the Developer 
This entire project was built from scratch, without using any AI for development help — as an intentional exercise to practice full-stack production-grade design. Hope you like it! 

Also check out my whiteboard application that I built independently too! 😄  

``` 
https://white-board-web-application.vercel.app  
```



 

   


 























