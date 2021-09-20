const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const app = express();

mongoose.connect("mongodb://localhost:27017/twitter");

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));

const userSchema = new Schema({
    name: String,
    age: Number
});

const postSchema = new Schema({
    title: String,
    text: String,
    userId: String
});

const User = mongoose.model("users", userSchema);
const Post = mongoose.model("posts", postSchema);

app.post("/users", (req, res) => {
    const user = new User({
        name: req.body.name,
        age: req.body.age
    });
    user.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Data is saved");
        }
    });
});

app.get("/users", (req, res) => {
    User.find({}, (err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.send(docs);
        }
    });
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            res.send(doc);
        }
    });
});

app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const userData = {
        name: req.body.name,
        age: req.body.age
    };
    User.findByIdAndUpdate(id, userData, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            res.send(doc);
        }
    });
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("200 OK");
        }
    });
});

app.post("/users/:userId/posts/", (req, res) => {
    const post = new Post({
        title: req.body.title,
        text: req.body.text,
        userId: req.params.userId
    });
    post.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("User posted a new twit");
        }
    });
});

app.get("/users/:userId/posts/", (req, res) => {
    Post.find({}, (err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.send(docs);
        }
    });
});

app.get("/users/:userId/posts/:postId", (req, res) => {
    const postId = req.params.postId;
    Post.findById(postId, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            res.send(doc);
        }
    });
});

app.delete("/users/:userId/posts/:postId", (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;
    Post.findById(postId, (err, doc) => {
        try {
            if (err) {
                res.send(err);
            } else {
                if (doc !== null && doc.userId === userId) {
                    Post.findByIdAndDelete(postId, (err) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send(doc);
                        }
                    });
                } else {
                    res.send("Something went wrong");
                }
            }
        } catch (e) {
            res.send("Something went wrong");
        }
    });
});

app.put("/users/:userId/posts/:postId", (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const postData = {
        title: req.body.title,
        text: req.body.text,
        userId: req.params.userId
    };
    Post.findById(postId, (err, doc) => {
        try {
            if (err) {
                res.send(err);
            } else {
                if (doc !== null && doc.userId === userId) {
                    Post.findByIdAndUpdate(postId, postData, (err) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send(doc);
                        }
                    });
                } else {
                    res.send("Something went wrong");
                }
            }
        } catch (e) {
            res.send("Something went wrong");
        }
    });
});

app.listen(8123);
