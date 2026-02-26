import { calculateDateRange } from "@/lib/transaction.service";
import mongoose from "mongoose";
import Transaction from "@/models/transaction.model";

export const getAddUpSummaryService = async (userId, period) => {
    const effectivePeriod = period || '30d';
    const { startDate, endDate } = calculateDateRange(effectivePeriod);

    const dailyData = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: "$_id",
                income: 1,
                expense: 1
            }
        }
    ]);

    const summaryMap = new Map(dailyData.map(item => [item.date, item]));
    const fullSummary = [];
    
    let runningTotalIncome = 0;
    let runningTotalExpense = 0;
    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        const dateString = day.toISOString().split('T')[0];

        if (summaryMap.has(dateString)) {
            const dayData = summaryMap.get(dateString);
            runningTotalIncome += dayData.income;
            runningTotalExpense += dayData.expense;
        }
        fullSummary.push({
            date: dateString,
            income: runningTotalIncome,
            expense: runningTotalExpense,
            surplus: runningTotalIncome - runningTotalExpense
        });
    }

    return fullSummary;
};

export const getDailySummaryService = async (userId, period) => {
    const { startDate, endDate } = calculateDateRange(period);

    const dailyData = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate },
                groupId: null,
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: "$_id",
                income: 1,
                expense: 1
            }
        }
    ]);

    const summaryMap = new Map(dailyData.map(item => [item.date, item]));
    const fullSummary = [];
    
    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        const dateString = day.toISOString().split('T')[0];

        let dailyIncome = 0;
        let dailyExpense = 0;

        if (summaryMap.has(dateString)) {
            const dayData = summaryMap.get(dateString);
            dailyIncome = dayData.income;
            dailyExpense = dayData.expense;
        }

        fullSummary.push({
            date: dateString,
            income: dailyIncome,
            expense: dailyExpense,
            surplus: dailyIncome - dailyExpense
        });
    }

    return fullSummary;
};


const processProportions = (categories, threshold = 0.05) => {
    if (!categories || categories.length === 0) {
        return [];
    }
    
    const total = categories.reduce((sum, item) => sum + item.amount, 0);
    if (total === 0) {
        return [];
    }

    const mainSlices = [];
    let otherAmount = 0;

    categories.forEach(item => {
        if (item.amount / total < threshold) {
            otherAmount += item.amount;
        } else {
            mainSlices.push({ category: item.category, amount: item.amount });
        }
    });

    if (otherAmount > 0) {
        mainSlices.push({ category: "Other", amount: otherAmount });
    }

    return mainSlices;
};


export const getCategorySummaryService = async (userId, period) => {
    const { startDate, endDate } = calculateDateRange(period);

    const result = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate },
                groupId: null,
            },
        },
        {
            $group: {
                _id: { type: "$type", category: "$category" },
                totalAmount: { $sum: "$amount" },
            },
        },
        {
            $group: {
                _id: "$_id.type",
                categories: {
                    $push: {
                        category: "$_id.category",
                        amount: "$totalAmount",
                    },
                },
            },
        },
    ]);

    let incomeCategories = [];
    let expenseCategories = [];

    result.forEach(group => {
        if (group._id === 'income') {
            incomeCategories = group.categories;
        } else if (group._id === 'expense') {
            expenseCategories = group.categories;
        }
    });

    const finalIncome = processProportions(incomeCategories);
    const finalExpense = processProportions(expenseCategories);

    return {
        income: finalIncome,
        expense: finalExpense,
    };
};

export const getGroupAddUpSummaryService = async (groupId, period) => {
    const { startDate, endDate } = calculateDateRange(period);

    const dailyData = await Transaction.aggregate([
        {
            $match: {
                groupId: new mongoose.Types.ObjectId(groupId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: "$_id",
                income: 1,
                expense: 1
            }
        }
    ]);

    const summaryMap = new Map(dailyData.map(item => [item.date, item]));
    const fullSummary = [];
    
    let runningTotalIncome = 0;
    let runningTotalExpense = 0;

    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        const dateString = day.toISOString().split('T')[0];

        let dailyIncome = 0;
        let dailyExpense = 0;

        if (summaryMap.has(dateString)) {
            const dayData = summaryMap.get(dateString);
            dailyIncome = dayData.income;
            dailyExpense = dayData.expense;
        }

        runningTotalIncome += dailyIncome;
        runningTotalExpense += dailyExpense;

        fullSummary.push({
            date: dateString,
            income: runningTotalIncome,
            expense: runningTotalExpense,
            surplus: runningTotalIncome - runningTotalExpense
        });
    }

    return fullSummary;
};

export const getGroupDailySummaryService = async (groupId, period) => {
    const { startDate, endDate } = calculateDateRange(period);

    const dailyData = await Transaction.aggregate([
        {
            $match: {
                groupId: new mongoose.Types.ObjectId(groupId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: "$_id",
                income: 1,
                expense: 1
            }
        }
    ]);

    const summaryMap = new Map(dailyData.map(item => [item.date, item]));
    const fullSummary = [];
    
    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        const dateString = day.toISOString().split('T')[0];

        let dailyIncome = 0;
        let dailyExpense = 0;

        if (summaryMap.has(dateString)) {
            const dayData = summaryMap.get(dateString);
            dailyIncome = dayData.income;
            dailyExpense = dayData.expense;
        }

        fullSummary.push({
            date: dateString,
            income: dailyIncome,
            expense: dailyExpense,
            surplus: dailyIncome - dailyExpense
        });
    }

    return fullSummary;
};

export const getGroupMemberProportionsService = async (groupId, period) => {
    const { startDate, endDate } = calculateDateRange(period);
    const result = await Transaction.aggregate([
        {
            $match: {
                groupId: new mongoose.Types.ObjectId(groupId),
                date: { $gte: startDate, $lte: endDate },
            }
        },
        {
            $group: {
                _id: { 
                    userId: "$userId", 
                    type: "$type" 
                },
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $lookup: {
                from: "users", 
                localField: "_id.userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $group: {
                _id: null,
                income: {
                    $push: {
                        $cond: [
                            { $eq: ["$_id.type", "income"] },
                            { name: "$userDetails.username", value: "$totalAmount" },
                            "$$REMOVE" 
                        ]
                    }
                },
                expense: {
                    $push: {
                        $cond: [
                            { $eq: ["$_id.type", "expense"] },
                            { name: "$userDetails.username", value: "$totalAmount" },
                            "$$REMOVE"
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                income: 1,
                expense: 1
            }
        }
    ]);

    if (result.length === 0) {
        return { income: [], expense: [] };
    }

    return result[0];
};

