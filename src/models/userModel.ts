import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  room: { type: String, required: true },
  id: { type: String, required: true },
  messages: { type: [] as string[] }
});

export default mongoose.model("User", userSchema);
// export class Url {
//   longUrl: {
//     type: String;
//     required: true;
//   };
//   shortUrl: { type: string };
//   date: { type: number };
// }

// export const tseting = getModelForClass(Url);
