"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Đổi từ react-router-dom sang next/navigation
import Link from 'next/link'; // Đổi từ react-router-dom sang next/link
import { GlobalOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Spin } from 'antd';
import { Wallet, ChartArea, HandCoins, LogOut, Settings, Contact, Users, PlusCircle, MailPlus } from "lucide-react";

import ProfilePic from "@/components/ProfilePic"; // Dùng @/
import instance from "@/lib/instance"; // Chuyển từ utils sang lib theo cấu trúc mới
import { API_PATH } from "@/lib/apiPath";

const { Header, Content, Sider } = Layout;

const topItems = [
    { key: "language", icon: <GlobalOutlined />, label: "Language" },
    { key: "profile", icon: <ProfilePic />, label: <span className="pl-3">Profile</span> }
];

// Thêm { children } vào tham số
const DashboardLayout = ({ children }) => {
    const { token: { colorBgContainer } } = theme.useToken();
    const router = useRouter(); // Thay cho useNavigate
    const pathname = usePathname(); // Thay cho useLocation

    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoadingGroups(true);
                const response = await instance.get(API_PATH.GROUP.GET_MY_GROUPS);
                setGroups(response.data.data);
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            } finally {
                setLoadingGroups(false);
            }
        };
        fetchGroups();
    }, []);

    const sidebarItems = useMemo(() => {
        const groupSubMenuItems = groups.map(group => ({
            key: `/group/${group._id}`,
            label: group.name,
        }));
        
        groupSubMenuItems.push(
            { type: 'divider' },
            { key: '/group/create', label: 'Create', icon: <PlusCircle size={16} /> },
            { key: '/group/invite', label: 'Invite', icon: <MailPlus size={16} /> }
        );

        return [
            { key: "/", icon: <ChartArea />, label: "Dashboard" },
            { key: "/income", icon: <Wallet />, label: "Income" },
            { key: "/expense", icon: <HandCoins />, label: "Expense" },
            { type: 'divider' },
            { key: "/group", icon: <Users />, label: "Group", children: loadingGroups ? null : groupSubMenuItems },
            { type: 'divider' },
            { key: "/setting", icon: <Settings />, label: "Setting" },
            { key: "/contact", icon: <Contact />, label: "Our Contact" },
            { key: "/logout", icon: <LogOut />, label: "Logout" },
        ];
    }, [groups, loadingGroups]);

    const handleMenuClick = ({ key }) => {
        if (key === '/logout') {
            localStorage.removeItem('token');
            router.push('/login'); // Thay cho navigate('/login')
        } else {
            router.push(key); // Thay cho navigate(key)
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className='flex items-center justify-between shadow-md shadow-blue-200'>
                <Link href="/"><h1 className='text-xl font-semibold text-white'>Spend Wise</h1></Link>
                <Menu theme="dark" mode="horizontal" items={topItems} style={{ minWidth: 0, flex: 'auto', justifyContent: 'flex-end' }} />
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }} className="shadow-md shadow-blue-200">
                    {loadingGroups ? (
                        <div className="flex justify-center items-center h-full"><Spin /></div>
                    ) : (
                        <Menu
                            mode="inline"
                            selectedKeys={[pathname]} // Thay location.pathname bằng pathname
                            defaultOpenKeys={pathname.startsWith('/group') ? ['/group'] : []}
                            style={{ height: '100%', borderRight: 0 }}
                            items={sidebarItems}
                            onClick={handleMenuClick}
                        />
                    )}
                </Sider>
                <Layout>
                    <Content className="shadow-md shadow-blue-200 m-8 rounded-lg p-6 bg-white">
                        {/* Hiển thị nội dung các trang con tại đây */}
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;