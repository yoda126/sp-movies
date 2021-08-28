// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const express = require("express");
const app = express();
publicdirpath = __dirname + '/public'
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: publicdirpath});
});

app.get("/login/", (req, res) => {
  res.sendFile("login.html", { root: publicdirpath});
});

app.get("/register/", (req, res) => {
  res.sendFile("register.html", { root: publicdirpath});
});

app.get("/admin/", (req, res) => {
  res.sendFile("admin.html", { root: publicdirpath});
});

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Frontend server has started listening on port ${PORT}`);
});