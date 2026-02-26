import Group from "@/models/group.model";
import User from "@/models/user.model";
import Invite from "@/models/invite.model";
import mongoose from "mongoose";

export const createGroupService = async({name,description,owner})=>{
    const group = await Group.create({ name, description, owner, members: [{ userId: owner, role: 'admin' }] });
    return group;
}
export const getMyGroupsService = async(userId) => {
    const groups = await Group.find({ 'members.userId': userId });
    return groups;
}

export const getMyGroupService = async(groupId)=>{
      const objectIdGroupId = new mongoose.Types.ObjectId(groupId);

      const groupArray = await Group.aggregate([
          {
              $match: { _id: objectIdGroupId }
          },
          {
              $lookup: {
                  from: 'users',
                  localField: 'members.userId',
                  foreignField: '_id',
                  as: 'memberDetails'
              }
          },
          {
              $lookup: {
                  from: 'users',
                  localField: 'owner',
                  foreignField: '_id',
                  as: 'ownerDetails'
              }
          },
          {
              $project: {
                  _id: 1,
                  name: 1,
                  description: 1,
                  owner: {
                      _id: { $arrayElemAt: ['$ownerDetails._id', 0] },
                      username: { $arrayElemAt: ['$ownerDetails.username', 0] },
                  },
                  members: {
                      $map: {
                          input: '$members',
                          as: 'member',
                          in: {
                              userId: '$$member.userId',
                              role: '$$member.role',
                              username: {
                                  $let: {
                                      vars: { userDetail: { $first: { $filter: { input: '$memberDetails', as: 'detail', cond: { $eq: ['$$detail._id', '$$member.userId'] } } } } },
                                      in: '$$userDetail.username'
                                  }
                              },
                              email: {
                                  $let: {
                                      vars: { userDetail: { $first: { $filter: { input: '$memberDetails', as: 'detail', cond: { $eq: ['$$detail._id', '$$member.userId'] } } } } },
                                      in: '$$userDetail.email'
                                  }
                              },
                              profilePic: {
                                  $let: {
                                      vars: { userDetail: { $first: { $filter: { input: '$memberDetails', as: 'detail', cond: { $eq: ['$$detail._id', '$$member.userId'] } } } } },
                                      in: '$$userDetail.profilePic'
                                  }
                              }
                          }
                      }
                  }
              }
          }
      ]);
      return groupArray[0] || null;
}

export const findUsersService = async (username,userId) => {
    if(username.length==0||username.trim().length==0){
        return [];
    }
    let invitees=[];
    invitees = await User.find({ username: { $regex: username, $options: 'i' }, _id:{$ne:userId} }).limit(10).select("-password");
    if (invitees.length === 0) {
        throwError(200, "No user found");
    }
    return invitees;
};

export const sendInvitesService = async ({ groupId, inviterId, inviteesID }) => {
    const existingMember = await Group.findOne({ 
        _id: groupId, 
        'members.userId': { $in: inviteesID } 
    });

    if (existingMember) {
        throwError(400, `Một hoặc nhiều người dùng đã ở trong nhóm này.`);
    }
    const invitesToCreate = inviteesID.map(inviteeId => ({
        groupId: groupId,
        inviterId: inviterId,
        inviteeId: inviteeId,
    }));
    const createdInvites = await Invite.insertMany(invitesToCreate);

    if (!createdInvites || createdInvites.length === 0) {
        throwError(500, "Không thể tạo lời mời.");
    }
    return createdInvites;
};

export const getInvitesService = async (userId) => {
    const invites = await Invite.find({ inviteeId: userId })
        .populate({
            path: 'inviterId', 
            select: 'username email profilePic' 
        })
        .populate({
            path: 'groupId', 
            select: 'name' 
        });

    const formattedInvites = invites.map(invite => {
        const inviteObject = invite.toObject();
        return {
            ...inviteObject,
            inviter: inviteObject.inviterId,
            group: inviteObject.groupId,
            inviterId: undefined,
            groupId: undefined
        };
    });

    return formattedInvites;
};

export const acceptInviteService = async(id,userId)=>{
    const invite = await Invite.findById(id);
    if(!invite){
        throwError(404,"Invite not found");
    }
    if(invite.inviteeId!=userId){
        throwError(400,"You are not the invitee");
    }
    await Group.findByIdAndUpdate(invite.groupId,{ $push: { members: { userId: userId, role: "member" } } });
    await Invite.findByIdAndDelete(id);
    return;
}

export const declineInviteService = async(id,userId)=>{
    const invite = await Invite.findById(id);
    if(!invite){
        throwError(404,"Invite not found");
    }
    if(invite.inviteeId!=userId){
        throwError(400,"You are not the invitee");
    }
    await Invite.findByIdAndDelete(id);
    return;
}
