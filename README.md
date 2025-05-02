# Ndagani Smart Furnitures

Ndagani Smart Furnitures is a full-stack web application designed to provide users with a seamless experience for browsing, ordering, and customizing furniture. The project incorporates a **Node.js** and **Express** backend, with an **Angular** frontend.

## Features

- **Furniture Browsing**: Users can explore a wide range of furniture options.
- **Order Management**: 
  - Place normal orders for available furniture.
  - Place custom orders with specific requirements.
- **Custom Order Progress**: 
  - Admin uploads images at every stage of the custom furniture-making process, including:
    - Material selection images.
    - Progress images.
    - Final product images.
- **Real-time Chat**: Users can communicate with the admin to discuss specifics and track their orders.

## Project Structure

```
ndagani-smart-furnitures/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── index.html
│   ├── angular.json
│   └── package.json
└── README.md
```

### Backend

The backend is located in the `backend` folder and is built with **Node.js** and **Express**. It uses **Prisma** for database management.

#### Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend

The frontend is located in the `frontend` folder and is built with **Angular** for a dynamic and responsive user interface.

#### Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   ng serve
   ```

## Live Demo

[Live Project Link](https://example.com) *(Update this link with the actual live project URL)*

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
