const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const items = ["Summer Projects", "Biking", "Fitness"];
const workItems = [];

app.get("/", (req, res) => {
  
const day = date.getDate();
res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", (req, res) => {
  
  let item = req.body.newItem;
  
  if(req.body.list === "Work List") {
      workItems.push(item);
      res.redirect("/work");
  }else {
      items.push(item);
      res.redirect("/");
  }
  
});

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, () => console.log("Server started on port 3000."));
