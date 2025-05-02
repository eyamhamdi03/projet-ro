# projet-ro

## Frontend Setup

We are using **Next.js** for the frontend with **Tailwind CSS** and other useful libraries.

### Install dependencies

```bash
cd frontend

npm install -D tailwindcss postcss autoprefixer

npm install next@latest react@latest react-dom@latest

npx shadcn@latest init

npm install class-variance-authority tailwind-variants lucide-react
```

---

## Backend Setup

We are using **Python** with **FastAPI** (if you plan to add that later) or any Python backend, and **MongoDB** as the database.

### Install dependencies

```bash
cd backend

pip install motor pymongo
```

---

## Database

We are using **MongoDB** as our database.
Please make sure to create a database named:

```
ro-project
```

with the following collections:

* `Ressource`
* `Demand`
