const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true, min: 10 },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  gender: { type: String, required: false, enum: ["male", "female", "other"] },
  activityLevel: { type: String, required: false, enum: ["sedentary", "light", "moderate", "active"] },
  goal: { type: String, required: false, enum: ["lose_weight", "maintain", "gain_muscle"] },
  allergy: { type: String, required: false }, // Optional allergy
  hasAllergyInfo: { type: Boolean, default: false }, // Tracks if allergy info was entered
});

// Virtual property to check if user details are complete
userSchema.virtual("hasDetails").get(function () {
  return this.height != null &&
         this.weight != null &&
         this.gender != null &&
         this.activityLevel != null &&
         this.goal != null;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
