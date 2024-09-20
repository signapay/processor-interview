// routes/reset.tsx (or a different file depending on your Remix structure)
import { ActionFunction, redirect, json } from "@remix-run/node";

export const action: ActionFunction = async () => {
  try {
    const response = await fetch("http://localhost:4000/reset", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to reset the system.");
    }

    return redirect("/");
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};
