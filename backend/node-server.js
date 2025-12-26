const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

// ================== LRU CACHE ==================
class LRU {
    constructor(cap) {
        this.capacity = cap;
        this.cache = new Map();
    }

    setCapacity(cap) {
        this.capacity = cap;
        this.cache.clear();
    }

    add(x) {
        x = String(x);
        if (this.cache.has(x)) this.cache.delete(x);
        else if (this.cache.size >= this.capacity)
            this.cache.delete(this.cache.keys().next().value);

        this.cache.set(x, true);
    }

    remove(x) {
        this.cache.delete(String(x));
    }

    clear() {
        this.cache.clear();
    }

    list() {
        return [...this.cache.keys()].map(String); // return uniform strings
    }
}

// ================== INSTANCE ==================
let cache = new LRU(3);

// ================== ROUTES ==================
app.get("/set/:c", (req,res)=>{ cache.setCapacity(req.params.c); res.send("OK"); });
app.get("/add/:x", (req,res)=>{ cache.add(req.params.x); res.send("Added"); });
app.get("/remove/:x", (req,res)=>{ cache.remove(req.params.x); res.send("Removed"); });
app.get("/clear", (req,res)=>{ cache.clear(); res.send("Cleared"); });
app.get("/list", (req,res)=> res.json(cache.list()));

// ================== SERVER ==================
app.listen(5000, ()=> console.log("🚀 BACKEND RUNNING → http://localhost:5000"));
