const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const pool = require("../config/db")

router.post("/register", async (req , res) => {
    const {email, username, password} = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await pool.query(
            "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, username",
            [email, username, hashedPassword]
        );
        res.status(201).json(user.rows[0]);
    } catch (err) {
      res.status(400).json({ error: "Usuario ya existe o datos invalidos" });  
    }

});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    try {
        
        const user = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if(user.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const valid = await bcrypt.compare(password, user.rows[0].password);
        if(!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: "Error en login" });
    }

});

module.exports = router;
