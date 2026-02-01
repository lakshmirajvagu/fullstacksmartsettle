import Group from "../models/Group.js";
import Invitation from "../models/Invitation.js";
import { io } from "../../server.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.userId,
      members: [req.userId], // ⭐ add selected users
    });

    res.status(201).json({
      message: "Group created",
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.userId,
    }).populate("members", "username email");

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const acceptInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation)
      return res.status(404).json({ message: "Invitation not found" });

    const group = await Group.findById(invitation.groupId);

    // add member ONLY HERE
    if (!group.members.includes(invitation.toUserId)) {
      group.members.push(invitation.toUserId);
      await group.save();
    }

    // 🔥 REAL-TIME UPDATE
    io.to(invitation.groupId.toString()).emit("groupMembersUpdated");

    await Invitation.findByIdAndDelete(req.params.id);

    res.json({ message: "Joined group" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.members = group.members.filter(
      (id) => id.toString() !== userId
    );

    await group.save();
    io.to(groupId).emit("groupMembersUpdated");

    res.json({ message: "Member removed", group });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const exitGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId; // from auth middleware

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.members = group.members.filter(
      (id) => id.toString() !== userId
    );

    await group.save();
    io.to(groupId).emit("groupMembersUpdated");
    res.json({ message: "Exited group successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
