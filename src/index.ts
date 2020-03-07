import express from "express";
import socketio from "socket.io";
import http from "http";
import { addUser, removeUser, getUser, getUserInRoom } from "./user";
import mongoose from "mongoose";
import User from "./models/userModel";

const app = express();
const server = http.createServer(app);
const io = socketio(server);

interface messageConfig {
  user1: string;
  message: string;
}
interface Userconfig {
  id: string;
  name: string;
  room: string;
  message: string[];
}
io.on("connection", socket => {
  console.log("log:1->User got connected " + socket.id);
  let name: string;
  let room: string;

  socket.on("join", async ({ myname, myroom }) => {
    name = myname;
    room = myroom;
    console.log("log:2->On Join check room-> " + name, room);

    const existingUser = await User.findOne({ name: myname });

    if (await existingUser) {
      console.log("User already exists");
      return null;
    }
    //console.log(await existingUser);

    const user = await new User({
      name: myname,
      room: myroom,
      id: socket.id
    })
      .save()
      .then(() => console.log("User saved Succesfully"));

    //const thisuser = await User.findOne({ id: socket.id });

    console.log("log:3->saved-->" + socket.id);
    const user1: any = await User.findOne({ id: socket.id });
    console.log(user1);
    console.log("temp log:- " + (await user1.id));

    if (await user1.id) {
      let test: string = user1.room;
      socket.join(test);

      socket.emit("message", {
        user1: await user1.name,
        message: `Hey ${await user1.name} , Welcome to ${await user1.room}  `
      });

      console.log("log:4-> check test " + test);

      socket.broadcast.to(test).emit("message", {
        user1: await user1.name,
        message: `${await user1.name} has Joined!!!`
      });
    } else {
      console.log("theres an Error");
    }
  });

  socket.on("sendMessage", async (message, callback) => {
    //const user: any = await User.findOne({ name: myname });

    console.log("log:5->got-->" + socket.id);
    const user: any = await User.findOne({ id: socket.id });
    if (!user) {
      console.log("no user found");
      return null;
    }
    console.log("log:6->room check in sendMessage" + user.room);
    console.log("log:7-> message " + message);
    let test2: string = user.room;
    console.log("log:8->room of sendMessage" + test2);

    io.to(test2).emit("message", { user1: user.name, message: message });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("server is running");
});

mongoose
  .connect(
    "mongodb+srv://Devansh:Devansh@cluster0-ixpyc.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("connected to db");
    server.listen(5000, () => {
      console.log("listening on Port 5000....");
    });
  });
