import  jwt from 'jsonwebtoken';
const JWT_SECRET = 'your_jwt_secret_key'; // Use dotenv in production



// Verify token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("authmiddelware")


  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
   console.log("token ",token)

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains id and role

    console.log("Authmiddleware user information",req.user)
  
    next();
  } catch (err) {
     console.log("error authentication")
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Allow only specific roles
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
        console.log(req.user.role)
      return next();
    }

    console.log("user role" ,req.user.role)
    return res.status(403).json({ message: `Access denied: insufficient role ${req.user.role}` });
  };
};

export {allowRoles,authMiddleware}
