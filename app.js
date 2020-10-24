const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

let items = ["Summer Projects", "Biking", "Fitness"];
let workItems = [];

app.get("/", (req, res) => {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

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
