import Group from "../models/Group.js";
import History from "../models/history.js";

export const getGroupHistory = async (req, res) => {
  try {
    // Step 1: find all groups of this user
    const groups = await Group.find({ members: req.userId });

    const groupIds = groups.map((g) => g._id);

    // Step 2: get history of those groups
    const history = await History.find({
      groupId: { $in: groupIds },
    })
      .populate("groupId", "name")
      .populate("simplifiedTransactions.fromUserId", "username")
      .populate("simplifiedTransactions.toUserId", "username")
      .sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
