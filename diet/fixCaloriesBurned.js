const mongoose = require("mongoose")

// Use environment variable or a more descriptive placeholder
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/diet" // Changed from hardcoded value

const workoutSessionSchema = new mongoose.Schema({
  userId: String,
  planId: String,
  planName: String,
  completedExercises: Array,
  caloriesBurned: Number,
  duration: Number,
  date: Date,
})

const WorkoutSession = mongoose.model("WorkoutSession", workoutSessionSchema)

const userSchema = new mongoose.Schema({
  weight: Number,
})
const User = mongoose.model("User", userSchema)

// Change this flag to false if you want to actually SAVE changes later
const DRY_RUN = true

async function updateCalories() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB ✅")

    const sessions = await WorkoutSession.find({
      $or: [{ caloriesBurned: { $exists: false } }, { caloriesBurned: 0 }],
    })

    console.log(`Found ${sessions.length} workout sessions to update.`)

    for (const session of sessions) {
      const user = await User.findById(session.userId)
      const userWeight = user?.weight || 70

      const durationMinutes = session.duration || 45
      const durationHours = durationMinutes / 60
      const MET = 6

      const caloriesBurned = Math.round(MET * userWeight * durationHours)

      console.log(`Session ID: ${session._id}`)
      console.log(` - User Weight: ${userWeight} kg`)
      console.log(` - Duration: ${durationMinutes} min`)
      console.log(` - Calculated Calories Burned: ${caloriesBurned} kcal`)

      if (!DRY_RUN) {
        session.caloriesBurned = caloriesBurned
        await session.save()
        console.log(`✅ Saved updated session ${session._id}`)
      } else {
        console.log(`🛑 Dry run: No changes saved.`)
      }

      console.log("------------------------")
    }

    if (DRY_RUN) {
      console.log("Dry run completed. No data was changed.")
    } else {
      console.log("All workout sessions updated successfully!")
    }

    process.exit(0)
  } catch (error) {
    console.error("Error updating sessions:", error)
    process.exit(1)
  }
}

updateCalories()
