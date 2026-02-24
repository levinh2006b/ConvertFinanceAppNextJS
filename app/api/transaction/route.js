import { createResponse } from "../../common/configs/response.config.js";
import handleAsync from "../../common/utils/handle-async.util.js";
import { getTransactionsByFilterService,createTransactionService, getIncomeService, getExpenseService,downloadExcelService,getGroupTransactionService } from "./transaction.service.js";

export const getTransaction = handleAsync(async(req,res)=>{
    const income = await getTransactionsByFilterService(req.user.id,{ period: req.query.period });
    return createResponse(res,200,"Get income successfully",income);
})

export const createTransaction = handleAsync(async(req,res)=>{
    const transaction = await createTransactionService({
        ...req.body,
        userId: req.user.id,
        groupId: req.query.groupId
    });
    return createResponse(res,200,"Create transaction successfully",transaction);
})

export const getIncome = handleAsync(async(req,res)=>{
    const userId = req.user.id;
    const period = req.query.period;

    const income = await getIncomeService(userId, period);
    return createResponse(res,200,"Get income successfully",income);
})

export const getExpense = handleAsync(async(req,res)=>{
    const userId = req.user.id;
    const period = req.query.period;

    const expense = await getExpenseService(userId, period);
    return createResponse(res,200,"Get expense successfully",expense);
})

export const downloadExcel = handleAsync(async(req,res)=>{
    const userId = req.user.id;
    const period = req.query.period;

    const file = await downloadExcelService(userId, { period });
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(file);
})

export const getGroupTransaction = handleAsync(async(req,res)=>{
    const groupId = req.params.id;
    const period = req.query.period;
    const type = req.query.type;

    const groupTransaction = await getGroupTransactionService(groupId, { period,type });
    return createResponse(res,200,"Get group transaction successfully",groupTransaction);
})