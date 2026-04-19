import { Router } from "express";
import {
  findUserByEmail,
  findUserById,
  createUser,
  getProfile,
  saveProfile,
  generateId,
  createSession
} from "../services/firebaseDB.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email, and password are required" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const id = generateId();

    // Plain text password since bcrypt is removed as requested
    const user = await createUser({ id, name, email, password });

    // Create empty health profile
    await saveProfile(id, { onboardingComplete: false });

    // Create session token stored in Firebase
    const token = await createSession(user.id, user.email);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email }
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Since we removed bcrypt, we do a pure string match
    // Note: old users with hashed passwords will either need to be recreated or we permit them if password matches exactly
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const profile = await getProfile(user.id);

    // Create session token stored in Firebase
    const token = await createSession(user.id, user.email);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          location: user.location
        },
        onboardingComplete: profile?.onboardingComplete || false
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

export default router;
