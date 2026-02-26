import Transaction from "@/models/transaction.model";
import * as XLSX from "xlsx";

export const createTransactionService = async({userId,groupId,amount,type,category,description})=>{
    const transaction = await Transaction.create({userId,groupId,amount,type,category,description});
    return transaction;
}

export const getIncomeService = async (userId, period) => {
    return getTransactionsByFilterService(userId, { type: 'income', period });
};

export const getExpenseService = async (userId, period) => {
    return getTransactionsByFilterService(userId, { type: 'expense', period });
};

export const getGroupTransactionService = async (groupId, filters={}) => {
    const query = { groupId };
    const { period, type } = filters;

    if (type && ['income', 'expense'].includes(type)) {
        query.type = type;
    }
    
    const { startDate, endDate } = calculateDateRange(period);
    query.date = { $gte: startDate, $lte: endDate };

    const transactions = await Transaction.find(query).sort({ date: -1 });
    return transactions;
}

export const getTransactionsByFilterService = async (userId, filters = {}) => {
    const query = { userId, groupId: null };
    const { type, period } = filters;

    if (type && ['income', 'expense'].includes(type)) {
        query.type = type;
    }   
    
    const { startDate, endDate } = calculateDateRange(period);
    query.date = { $gte: startDate, $lte: endDate };   

    const transactions = await Transaction.find(query).sort({ date: -1 });
    return transactions;
};

export const calculateDateRange = (period) => {
    const endDate = new Date();
    let startDate;

    switch (period) {
        case '7d':
            startDate = new Date();
            startDate.setDate(endDate.getDate() - 7);
            break;
        case '1m':
            startDate = new Date();
            startDate.setMonth(endDate.getMonth() - 1);
            break;
        case '3m':
            startDate = new Date();
            startDate.setMonth(endDate.getMonth() - 3);
            break;
        case '1y':
            startDate = new Date();
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        default:
            startDate = new Date(0);
            break;
    }

    return { startDate, endDate };
};

export const downloadExcelService = async (userId, filter={}) => {
    const transactions = await getTransactionsByFilterService(userId, filter);

    const data=transactions.map(transaction=>{
        return {
            Date:transaction.date,
            Amount:transaction.type==='income'?transaction.amount:-transaction.amount,
            Category:transaction.category,
            Description:transaction.description,     
        }
    })

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'transaction');
    const file = XLSX.write(workbook, {bookType:'xlsx',type:'buffer'});
    return file;
}