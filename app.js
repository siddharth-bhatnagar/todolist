//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin:tQMOWo0OUznly6Uf@cluster0.eey2u.mongodb.net/todolistDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useFindAndModify: false
});

const itemsSchema = {
  name: String,
};

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = new mongoose.model("List", listSchema);


app.get("/", function (req, res) {
  Item.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length === 0) {
        Item.insertMany(defaultItems, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to the database.");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: data });
      }
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, (err, foundList) => {
    if (!err) {
      if(!foundList) {
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
      
        list.save();

        res.redirect("/" + customListName);
      } else {
       res.render("list", {listTitle: foundList.name, newListItems: foundList.items })
      }
    }
  });
  

});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });

  if(listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }


});

app.post("/delete", (req, res) => {
  const checkeditemId = req.body.checkbox;
  const listName = req.body.listName;
 if (listName === "Today") {
  Item.findByIdAndRemove(checkeditemId, (err) => {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });
 } else {
   List.findOneAndDelete({name: listName}, {$pull: {items: {id: checkeditemId}}}, (err, foundList) => {
    if (!err) {
      res.redirect("/" + listName);
    }
   });
 }
 
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
