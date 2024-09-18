const express = require("express");
const app = express();

const port = 8080;
const path = require("path");

const { v4: uuidv4 } = require("uuid");

const mysql = require("mysql2");
const multer = require("multer");

const upload = multer({ dest: "public/uploads/" });

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "instagram_db",
  password: "root",
});

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

let posts = [
  {
    id: uuidv4(),
    username: "akashraj",
    profile_pic: "profile1.jpg",
    post_pic: "post1.jpg",
    content: "Nothing is permanent in the world.",
  },
  {
    id: uuidv4(),
    username: "pinky",
    profile_pic: "profile2.jpg",
    post_pic: "post2.jpg",
    content: "Everyday is a new day.",
  },
  {
    id: uuidv4(),
    username: "riya",
    profile_pic: "profile3.jpg",
    post_pic: "post3.jpg",
    content: "Hard work is important to achieve success.",
  },
];

app.get("/instagram", (req, res) => {
  let q = `SELECT * FROM posts`;
  try {
    connection.query(q, (err, posts) => {
      if (err) throw err;
      posts.forEach((post) => {
        post.post_pic = post.post_pic
          .replace(/\\/g, "/")
          .replace("public/", "");
      });
      posts.forEach((post) => {
        post.profile_pic = post.profile_pic
          .replace(/\\/g, "/")
          .replace("public/", "");
      });
      console.log(posts);
      res.render("index.ejs", { posts });
    });
  } catch (err) {
    console.log(err);
    res.send("Error in DB");
  }
});

app.get("/", (req, res) => {
  res.redirect("/instagram");
});

app.get("/instagram/new", (req, res) => {
  res.render("new.ejs");
});

app.post(
  "/instagram",
  upload.fields([{ name: "profile_pic" }, { name: "post_pic" }]),
  (req, res) => {
    const username = req.body.username;
    const content = req.body.content;
    const profilePicPath = req.files.profile_pic[0].path; // Path to the uploaded profile picture
    const postPicPath = req.files.post_pic[0].path; // Path to the uploaded post picture

    // No 'id' in the query since it's auto-incremented
    const sql = `INSERT INTO posts (username, profile_pic, post_pic, content) VALUES (?, ?, ?, ?)`;
    try {
      connection.query(
        sql,
        [username, profilePicPath, postPicPath, content],
        (err, result) => {
          if (err) throw err;
          res.redirect("/instagram");
        }
      );
    } catch (err) {
      console.log(err);
      res.send("error in DB");
    }
  }
);

app.get("/instagram/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM posts WHERE id = ${id}`;
  try {
    connection.query(q, (err, post) => {
      if (err) throw err;
      post = post.map((p) => {
        p.profile_pic = p.profile_pic
          .replace(/\\/g, "/")
          .replace("public/", "");
        p.post_pic = p.post_pic.replace(/\\/g, "/").replace("public/", "");
        return p;
      });
      console.log(post);
      res.render("show.ejs", { post });
    });
  } catch (err) {
    console.log(err);
    res.send("Error in DB");
  }
});
app.patch("/instagram/:id", (req, res) => {
  let { id } = req.params;
  let newConent = req.body.content;
  let q = `UPDATE posts SET content="${newConent}" WHERE id=${id}`;
  try {
    connection.query(q, (err, post) => {
      if (err) throw err;
      console.log(post);
      res.redirect("/instagram");
    });
  } catch (err) {
    console.log(err);
    res.send("Eroor in DB");
  }
});

app.get("/instagram/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM posts WHERE id=${id}`;
  try {
    connection.query(q, (err, post) => {
      if (err) throw err;
      console.log(post);
      res.render("edit.ejs", { post });
    });
  } catch (err) {
    console.log(err);
    res.send("Error in DB");
  }
});

app.delete("/instagram/:id", (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM posts WHERE id=${id}`;
  try {
    connection.query(q, (err, post) => {
      if (err) throw err;
      console.log(post);
      res.redirect("/instagram");
    });
  } catch (err) {
    console.log(err);
    res.send("Error in DB");
  }
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
