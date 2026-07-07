const { Schema, model } = require("mongoose");

const lectureSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    batchName: {
      type: String,
      required: true,
      trim: true,
    },

    lectureDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("Lecture", lectureSchema);
