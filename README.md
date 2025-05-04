# Card Processor

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

---

### 📦 Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

---

### 🖥️ Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💡 Design Decisions & Trade-offs

- **Elysia**: Chosen to gain hands-on experience, as it's part of your tech stack. It's amazing and for sure I will continue using it :)
- **Storage**: In-memory persistence was selected to keep things simple and meet project time constraints.
- **Security**:
  - `.env` is committed for easier setup.
  - No authentication is implemented, but token-based authorization is simulated via environment variables.
- **WebSockets**:
  - Implemented to notify the UI when file processing completes, removing the need for polling.
  - A `DELAY_MS` (it's currently ON with a value of 5000 ms) environment variable is available to simulate processing delays.
- **Validation**:
  - Card validation is handled using the `card-validator` library for reliable and consistent checks.
- **UI**:
  - Built using **Material UI** for rapid development and mobile-first responsiveness. Try resizing your screen or using a mobile device!
- **Future improvements**:
  - Add Turbo as the monorepo manager and create packages to be shared between the two apps, like eslint, typings, etc

---

## ⚠️ Assumptions & Known Limitations

### Assumptions

- **Processed Volume** refers to the **absolute value** of each transaction. I'm not sure if that's correct but that was my assumption.
- A card is **considered valid** if:
  1. The `card-validator` library successfully identifies its type.
  2. Its number starts with **3, 4, 5, or 6**. (This excludes certain card types like JCB.)
