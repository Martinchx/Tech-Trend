import mongoose from "mongoose";
import {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_CLUSTER,
  MONGO_DATABASE,
} from "./config.js";

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.5mhykd7.mongodb.net/${MONGO_DATABASE}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
      }
    );

    console.log(`MongoDB connection successful`);
  } catch (err) {
    console.log(err);
  }
})();
