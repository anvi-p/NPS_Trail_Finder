const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

const app = express();
process.stdin.setEncoding("utf8");

const hikes = require("./routes/hikes");
const parks = require("./routes/parks");
const comments = require("./routes/comments");
const allComments = require("./routes/allComments");

const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`Web server is listening on port ${port}`)
})

/******* EXPRESS ROUTING CODE ********/
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use("/search", hikes);
app.use("/parks", parks);
app.use("/comments", comments);
app.use("/allComments", allComments);

app.use('/', (request, response) => {
    response.render("index");
});