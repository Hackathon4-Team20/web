import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { NavLink } from "react-router-dom";
import { MessageSquare, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// This is a test comment
const AdminDashboard = () => {
  const data = [
    { name: "15/5", positive: 20, negative: 10, neutral: 5 },
    { name: "21/5", positive: 22, negative: 8, neutral: 6 },
    { name: "27/5", positive: 18, negative: 12, neutral: 4 },
    { name: "3/6", positive: 25, negative: 7, neutral: 8 },
    { name: "9/6", positive: 28, negative: 5, neutral: 10 },
    { name: "14/6", positive: 30, negative: 3, neutral: 12 },
  ];

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      {/* Navigation Sidebar */}
      <div className="w-16 border-l border-border bg-[#A11858] flex flex-col items-center py-4 gap-4">
        <div className="flex flex-col items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-xl hover:bg-white/10 text-white"
          >
            <img
              src="/images/logo.png"
              alt="Website Logo"
              className="h-10 w-10"
            />
          </Button>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                isActive ? "bg-white/10" : "hover:bg-white/10"
              } text-white`
            }
          >
            <BarChart2 className="h-6 w-6" />
          </NavLink>
          <NavLink
            to="/admin/chat"
            className={({ isActive }) =>
              `h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                isActive ? "bg-white/10" : "hover:bg-white/10"
              } text-white`
            }
          >
            <MessageSquare className="h-6 w-6" />
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-3 flex justify-between items-center">
          <button className="bg-[#A11858] text-white px-3 py-1 rounded-lg text-sm">
            عرض جميع البيانات
          </button>
          <h1 className="text-xl font-bold text-[#A11858]">تحليل البيانات</h1>
        </header>

        {/* Dashboard Content */}
        <section className="flex-1 p-4 space-y-4 overflow-auto">
          {/* Top Row Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg shadow flex items-center justify-between text-right">
              <div>
                <h2 className="text-base font-semibold">المحادثات الإيجابية</h2>
                <p className="text-sm text-gray-600">12 محادثة</p>
              </div>
              <div className="bg-green-100 p-1 rounded-full">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow flex items-center justify-between text-right">
              <div>
                <h2 className="text-base font-semibold">المحادثات السلبية</h2>
                <p className="text-sm text-gray-600">8 محادثة</p>
              </div>
              <div className="bg-red-100 p-1 rounded-full">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow flex items-center justify-between text-right">
              <div>
                <h2 className="text-base font-semibold">المحادثات المحايدة</h2>
                <p className="text-sm text-gray-600">2 محادثة</p>
              </div>
              <div className="bg-gray-200 p-1 rounded-full">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 12H4"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow flex items-center justify-between text-right">
              <div>
                <h2 className="text-base font-semibold">معدل سرعة الرد</h2>
                <p className="text-sm text-gray-600">14 دقيقة</p>
              </div>
              <div className="bg-purple-100 p-1 rounded-full">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Middle Section: Chart and Top Issues */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg shadow">
              <h2 className="text-base font-semibold mb-3 text-right">
                تقييم المحادثات
              </h2>
              {/* Chart Placeholder */}
              <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="positive"
                      stroke="#22c55e"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="negative" stroke="#ef4444" />
                    <Line type="monotone" dataKey="neutral" stroke="#eab308" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <h2 className="text-base font-semibold mb-3 text-right">
                المشاكل الأكثر شيوعًا
              </h2>
              <ul className="list-none p-0 m-0">
                <li className="border-b py-1 text-right text-sm">1. الراتب</li>
                <li className="border-b py-1 text-right text-sm">
                  2. البطاقات البنكية
                </li>
                <li className="border-b py-1 text-right text-sm">
                  3. كلمة سر الحساب
                </li>
                <li className="border-b py-1 text-right text-sm">
                  4. تحويل إلى حساب خارج البنك
                </li>
                <li className="py-1 text-right text-sm">5. ما ضل مشاكل</li>
              </ul>
            </div>
          </div>

          {/* Bottom Section: Recent Negative Chats and Customer Service Employees */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg shadow">
              <h2 className="text-base font-semibold mb-3 text-right">
                أحدث المحادثات السلبية
              </h2>
              <div className="space-y-3">
                {/* Chat Item */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#A11858] flex items-center justify-center text-white font-semibold">
                    ح
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">حسين سمير سعدي</p>
                    <p className="text-xs text-gray-600">
                      السلام عليكم .. ما عندي مشكلة بس بدي أجرب
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">2 min</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#A11858] flex items-center justify-center text-white font-semibold">
                    ت
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">تيسير أمين محمد</p>
                    <p className="text-xs text-gray-600">
                      السلام عليكم .. ما عندي مشكلة بس بدي أجرب
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">2 min</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#A11858] flex items-center justify-center text-white font-semibold">
                    م
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">مسعود أحمد مصري</p>
                    <p className="text-xs text-gray-600">
                      السلام عليكم .. ما عندي مشكلة بس بدي أجرب
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">2 min</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#A11858] flex items-center justify-center text-white font-semibold">
                    أ
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">أحمد محمد محمود</p>
                    <p className="text-xs text-gray-600">
                      السلام عليكم .. ما عندي مشكلة بس بدي أجرب
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">2 min</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <h2 className="text-base font-semibold mb-3 text-right">
                موظفو خدمة العملاء
              </h2>
              <table className="min-w-full bg-white text-sm">
                <thead>
                  <tr>
                    <th className="py-1 px-2 border-b text-right">#</th>
                    <th className="py-1 px-2 border-b text-right">
                      اسم الموظف
                    </th>
                    <th className="py-1 px-2 border-b text-right">
                      عدد المحادثات
                    </th>
                    <th className="py-1 px-2 border-b text-right">
                      التقييم الأكثر تكرارًا
                    </th>
                    <th className="py-1 px-2 border-b text-right">
                      معدل سرعة الرد
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 px-2 border-b text-right">1.</td>
                    <td className="py-1 px-2 border-b text-right">
                      أحمد محمد أحمد
                    </td>
                    <td className="py-1 px-2 border-b text-right">12</td>
                    <td className="py-1 px-2 border-b text-right">إيجابي</td>
                    <td className="py-1 px-2 border-b text-right">
                      1 ساعة، 2 دقيقة
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border-b text-right">2.</td>
                    <td className="py-1 px-2 border-b text-right">
                      أحمد محمد أحمد
                    </td>
                    <td className="py-1 px-2 border-b text-right">12</td>
                    <td className="py-1 px-2 border-b text-right">إيجابي</td>
                    <td className="py-1 px-2 border-b text-right">
                      1 ساعة، 2 دقيقة
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border-b text-right">3.</td>
                    <td className="py-1 px-2 border-b text-right">
                      أحمد محمد أحمد
                    </td>
                    <td className="py-1 px-2 border-b text-right">12</td>
                    <td className="py-1 px-2 border-b text-right">إيجابي</td>
                    <td className="py-1 px-2 border-b text-right">
                      1 ساعة، 2 دقيقة
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border-b text-right">4.</td>
                    <td className="py-1 px-2 border-b text-right">
                      أحمد محمد أحمد
                    </td>
                    <td className="py-1 px-2 border-b text-right">12</td>
                    <td className="py-1 px-2 border-b text-right">إيجابي</td>
                    <td className="py-1 px-2 border-b text-right">
                      1 ساعة، 2 دقيقة
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border-b text-right">5.</td>
                    <td className="py-1 px-2 border-b text-right">
                      أحمد محمد أحمد
                    </td>
                    <td className="py-1 px-2 border-b text-right">12</td>
                    <td className="py-1 px-2 border-b text-right">إيجابي</td>
                    <td className="py-1 px-2 border-b text-right">
                      1 ساعة، 2 دقيقة
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border-b text-right">6.</td>
                    <td className="py-1 px-2 border-b text-right">
                      أحمد محمد أحمد
                    </td>
                    <td className="py-1 px-2 border-b text-right">12</td>
                    <td className="py-1 px-2 border-b text-right">إيجابي</td>
                    <td className="py-1 px-2 border-b text-right">
                      1 ساعة، 2 دقيقة
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border-b text-right">7.</td>
                    <td className="py-1 px-2 border-b text-right">
                      أحمد محمد أحمد
                    </td>
                    <td className="py-1 px-2 border-b text-right">12</td>
                    <td className="py-1 px-2 border-b text-right">إيجابي</td>
                    <td className="py-1 px-2 border-b text-right">
                      1 ساعة، 2 دقيقة
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
