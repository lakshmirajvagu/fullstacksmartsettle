import Transaction from "../models/transaction.js";
import Group from "../models/Group.js";

export const addTransaction = async (req, res) => {
  try {
    const { groupId, toUserId, amount } = req.body;

    // check group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // only group members can add transaction
    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ message: "Not a group member" });
    }

    const transaction = await Transaction.create({
      groupId,
      fromUserId: req.userId,
      toUserId,
      amount,
    });

    res.status(201).json({
      message: "Transaction added",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
