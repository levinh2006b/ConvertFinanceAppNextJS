import { getAddUpSummaryService, getDailySummaryService, getCategorySummaryService ,getGroupAddUpSummaryService,getGroupDailySummaryService,getGroupMemberProportionsService} from "./dashboard.service.js";
import handleAsync from "../../common/utils/handle-async.util.js";
import { createResponse } from "../../common/configs/response.config.js";

export const getAddUpSummary = handleAsync(async(req,res)=>{
    const userId = req.user.id;
    const period = req.query.period;
    const dailySummary = await getAddUpSummaryService(userId,period);
    return createResponse(res,200,"Get add up summary successfully",dailySummary);
})

export const getDailySummary = handleAsync(async(req,res)=>{
    const userId = req.user.id;
    const period = req.query.period;
    const dailySummary = await getDailySummaryService(userId,period);
    return createResponse(res,200,"Get daily summary successfully",dailySummary);
})

export const getCategorySummary = handleAsync(async(req,res)=>{
    const userId = req.user.id;
    const period = req.query.period;
    const categorySummary = await getCategorySummaryService(userId,period);
    return createResponse(res,200,"Get category summary successfully",categorySummary);
})

export const getGroupAddUpSummary = handleAsync(async(req,res)=>{
    const groupId = req.params.groupId;
    const period = req.query.period;
    const dailySummary = await getGroupAddUpSummaryService(groupId,period);
    return createResponse(res,200,"Get group add up summary successfully",dailySummary);
})

export const getGroupDailySummary = handleAsync(async(req,res)=>{
    const groupId = req.params.groupId;
    const period = req.query.period;
    const dailySummary = await getGroupDailySummaryService(groupId,period);
    return createResponse(res,200,"Get group daily summary successfully",dailySummary);
})

export const getGroupMemberProportions = handleAsync(async(req,res)=>{
    const groupId = req.params.groupId;
    const period = req.query.period;
    const memberProportions = await getGroupMemberProportionsService(groupId,period);
    return createResponse(res,200,"Get group member proportions successfully",memberProportions);
})



