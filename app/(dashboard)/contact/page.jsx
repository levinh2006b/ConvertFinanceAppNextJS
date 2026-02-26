"use client";

import React from 'react';

const Contact = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 mt-4 bg-blue-50 rounded-2xl shadow-blue-200 shadow-sm border border-blue-100">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-gray-700 text-lg mb-6 text-center max-w-lg">
                Nếu bạn gặp bất kỳ vấn đề nào trong quá trình sử dụng ứng dụng quản lý chi tiêu Spend Wise, đừng ngần ngại gửi tin nhắn cho đội ngũ hỗ trợ nhé!
            </p>
            
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                    Email hỗ trợ:
                </p>
                <a href="mailto:support@spendwise.com" className="text-blue-500 hover:underline text-xl">
                    support@spendwise.com
                </a>
                
                <div className="mt-6">
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                        Hotline:
                    </p>
                    <p className="text-blue-500 text-xl font-medium">
                        0123.456.789
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;