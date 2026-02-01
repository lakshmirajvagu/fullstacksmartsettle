import Invitation from "../models/Invitation.js";
import Group from "../models/Group.js";
import User from "../models/user.js";


export const inviteUser = async (req, res) => {
  try {
    const { groupId, toUserId } = req.body;

    // 1) basic guards
    if (!groupId || !toUserId) {
      return res.status(400).json({ message: "groupId and toUserId required" });
    }

    if (String(toUserId) === String(req.userId)) {
      return res.status(400).json({ message: "Cannot invite yourself" });
    }

    // 2) group must exist
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // 3) inviter must be a member
    if (!group.members.map(String).includes(String(req.userId))) {
      return res.status(403).json({ message: "Not a group member" });
    }

    // 4) user must exist
    const user = await User.findById(toUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5) already in group? don't invite
    if (group.members.map(String).includes(String(toUserId))) {
      return res.status(400).json({ message: "User already in group" });
    }

    // 6) duplicate pending invite? don't create another
    const existingInvite = await Invitation.findOne({
      groupId,
      toUserId,
      status: "pending",
    });

    if (existingInvite) {
      return res.status(400).json({ message: "Invitation already sent" });
    }

    // 7) create invite
    const invite = await Invitation.create({
      groupId,
      fromUserId: req.userId,
      toUserId,
      status: "pending",
    });

    res.status(201).json({
      message: "Invitation sent",
      invite,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyInvitations = async (req, res) => {
  try {
    const invites = await Invitation.find({
      toUserId: req.userId,
      status: "pending",
    })
      .populate("groupId", "name")
      .populate("fromUserId", "username");  // ⭐ ADD THIS

    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const acceptInvitation = async (req, res) => {
  try {
    const { inviteId } = req.body;

    const invite = await Invitation.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    // add user to group
    await Group.findByIdAndUpdate(invite.groupId, {
      $addToSet: { members: req.userId },
    });
    await Invitation.findByIdAndDelete(invite._id);
    res.json({ message: "Joined group successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectInvitation = async (req, res) => {
  try {
    const { inviteId } = req.body;

   await Invitation.findByIdAndDelete(inviteId);
   
    res.json({ message: "Invitation rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
