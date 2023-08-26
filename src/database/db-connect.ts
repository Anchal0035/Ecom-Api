import mongoose from "mongoose";

const connect = mongoose.connect('mongodb://127.0.0.1:27017/ols-db',

)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

export default connect;