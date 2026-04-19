import { getSession } from "../services/firebaseDB.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    // Check token with Firebase Sessions 
    const session = await getSession(token);
    
    if (!session) {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    req.user = { id: session.id, email: session.email };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export default authMiddleware;
