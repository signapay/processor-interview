import { Hono } from "hono";

const transactionRoutes = new Hono().get("/", (c) => {
  return c.json({
    books: [
      {
        id: "1",
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 24.99,
        category: "Fiction",
      },
      {
        id: "2",
        title: "Atomic Habits",
        author: "James Clear",
        price: 19.99,
        category: "Self-Help",
      },
      {
        id: "3",
        title: "Project Hail Mary",
        author: "Andy Weir",
        price: 27.99,
        category: "Science Fiction",
      },
      {
        id: "4",
        title: "Dune",
        author: "Frank Herbert",
        price: 21.99,
        category: "Science Fiction",
      },
    ],
  });
});

export default transactionRoutes;
