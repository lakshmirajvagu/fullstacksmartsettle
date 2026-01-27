import Transaction from "../models/transaction.js";
import Group from "../models/Group.js";
import { minimiseCashFlow } from "../utils/simplifyHeap.js";
import History from "../models/history.js";

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

export const getGroupTransactions = async (req, res) => {
  try {
    const { groupId } = req.params;

    const transactions = await Transaction.find({ groupId })
      .populate("fromUserId", "username")
      .populate("toUserId", "username");

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const simplifyTransactions = async (req, res) => {
  try {
    const { groupId } = req.body;

    const transactions = await Transaction.find({ groupId });

    if (transactions.length === 0) {
      return res.json({ message: "No transactions to simplify" });
    }

    const simplified = minimiseCashFlow(transactions);

    res.json({
      message: "Simplified result",
      simplified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveSettlement = async (req, res) => {
  try {
    const { groupId } = req.body;

    const transactions = await Transaction.find({ groupId });

    if (transactions.length === 0) {
      return res.json({ message: "No transactions to save" });
    }

    const simplified = minimiseCashFlow(transactions);

    await History.create({
      groupId,
      simplifiedTransactions: simplified,
    });

    await Transaction.deleteMany({ groupId });

    res.json({
      message: "Settlement saved and transactions cleared",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};