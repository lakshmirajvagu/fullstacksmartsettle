import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    simplifiedTransactions: [
      {
        fromUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        toUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
