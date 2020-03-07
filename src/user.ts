import mongoose from "mongoose";
import User from "./models/userModel";

const users: any[] = [];

const addUser = (id: any, myname: string, myroom: string) => {
  console.log("name is " + myname);

  const existingUser = User.findOne({ name: myname });

  if (existingUser) {
    console.log("its here");
    return { error: "Username already taken, try another" };
  }
  //console.log(await existingUser);

  const user = new User({
    name: myname,
    room: myroom,
    id: id
  })
    .save()
    .then(() => console.log("User saved Succesfully"));

  const thisuser = User.findOne({ id: id });

  return null;
};

const removeUser = (id: any) => {
  const index = users.findIndex(user => user.id == id);
  if (index != 1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id: any) => {
  return User.findOne({ id: id });
};

const getUserInRoom = (myroom: any) => {
  users.filter(user => user.myroom == myroom);
};

export { getUser, getUserInRoom, addUser, removeUser };
