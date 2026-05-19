// ManagerDashboard.jsx

import React, { useState } from "react";

import ManagerSidebar from "../../components/ManagerSidebar";
import MonthlyTab from "../../components/MonthlyTab";
import ExpensesTab from "../../components/ExpenseTab";

import UpcomingOrdersPage from "./UpcomingOrdersPage";
import TodayOrdersPage from "./TodayOrdersPage";

export default function ManagerDashboard() {

  const [activeTab, setActiveTab] =
    useState("orders");

  const [showUpcoming, setShowUpcoming] =
    useState(false);

  const [showTodayOrders, setShowTodayOrders] =
    useState(false);

  // ================= ALL ORDERS =================

  const pendingOrders = [

    {
      id: 1,
      date: "25-Apr-2026",
      name: "Rohit Sharma",
      mobile: "9999999999",
      address: "Vijay Nagar Indore",
      manager: "Hariom",
      qty: "10 Jars",
      pending: 500,
      total: 1200,
      completed: false,
    },

    {
      id: 2,
      date: "25-Apr-2026",
      name: "Aman Verma",
      mobile: "8888888888",
      address: "Bhawarkua Indore",
      manager: "Hariom",
      qty: "200 Ltr",
      pending: 200,
      total: 900,
      completed: false,
    },

    {
      id: 3,
      date: "26-Apr-2026",
      name: "Suresh",
      mobile: "7777777777",
      address: "Dewas",
      manager: "Hariom",
      qty: "5 Jars",
      pending: 0,
      total: 500,
      completed: true,
    },
  ];

  // ================= TODAY FILTER =================

  const today = "25-Apr-2026";

  const todayOrders =
    pendingOrders.filter(
      (item) =>
        item.date === today
    );

  // ================= PAGE OPEN =================

  if (showTodayOrders) {
    return (
      <TodayOrdersPage
        orders={todayOrders}
        onBack={() =>
          setShowTodayOrders(false)
        }
      />
    );
  }

  if (showUpcoming) {
    return (
      <UpcomingOrdersPage
        onBack={() =>
          setShowUpcoming(false)
        }
      />
    );
  }

  return (
    <div className="flex bg-gray-200 min-h-screen overflow-hidden">

      {/* SIDEBAR */}
      <ManagerSidebar />

      {/* MAIN */}
      <div className="flex-1 p-3 md:p-6 pb-24 md:pb-6">

        {/* ================= TOP TABS ================= */}

        <div className="relative mb-8">

          {/* FLOW LINE */}
          {/* <div
            className={`
              absolute
              left-2
              right-2
              top-[60px]
              h-[12px]
              rounded-full
              transition-all
              duration-500

              ${
                activeTab === "orders"
                  ? "bg-blue-500"
                  : activeTab === "monthly"
                  ? "bg-cyan-500"
                  : "bg-red-500"
              }
            `}
          ></div> */}

          {/* TAB BUTTONS */}
          <div className="relative z-20 flex gap-2 pb-1 px-2 pt-2">

            <TopBtn
              text="Orders"
              active={activeTab === "orders"}
              color="blue"
              onClick={() =>
                setActiveTab("orders")
              }
            />

            <TopBtn
              text="Monthly"
              active={activeTab === "monthly"}
              color="cyan"
              onClick={() =>
                setActiveTab("monthly")
              }
            />

            <TopBtn
              text="Expenses"
              active={activeTab === "expenses"}
              color="red"
              onClick={() =>
                setActiveTab("expenses")
              }
            />

          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div
          className={`
            relative
            z-10
            p-3 md:p-5
            rounded-[28px]
            shadow-2xl
            transition-all
            duration-500

            ${
              activeTab === "orders"
                ? "bg-blue-50"
                : activeTab === "monthly"
                ? "bg-cyan-50"
                : "bg-red-50"
            }
          `}
        >

          {/* ================= ORDERS TAB ================= */}

          {activeTab === "orders" && (

            <div className="w-full bg-white rounded-3xl p-3 md:p-5 shadow-lg border border-blue-200">

              {/* ================= TODAY ================= */}

              <div
                onClick={() =>
                  setShowTodayOrders(true)
                }
                className="border-2 border-blue-600 rounded-2xl p-3 md:p-4 mb-5 bg-white cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
              >

                <div className="flex justify-between items-center mb-4">

                  <h2 className="text-blue-600 font-bold text-base md:text-lg">
                    Today's Pending Orders
                  </h2>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm shadow">
                    View
                  </button>
                </div>

                {/* BOX */}
                <div className="flex flex-col md:flex-row border border-gray-300 rounded-xl overflow-hidden">

                  {/* LEFT */}
                  <div className="flex-1 p-4 md:p-5 md:border-r border-gray-300">

                    <h3 className="text-blue-600 font-semibold mb-5 text-lg">
                      Jar Orders
                    </h3>

                    <Info
                      text={`${todayOrders.filter((o) =>
                        o.qty.includes("Jar")
                      ).length} Orders`}
                    />

                    <Info
                      text={`${todayOrders
                        .filter((o) =>
                          o.qty.includes("Jar")
                        )
                        .reduce(
                          (sum, o) =>
                            sum +
                            parseInt(o.qty),
                          0
                        )} Jars`}
                    />

                    <Info
                      text={`₹${todayOrders
                        .filter((o) =>
                          o.qty.includes("Jar")
                        )
                        .reduce(
                          (sum, o) =>
                            sum + o.total,
                          0
                        )} Total`}
                    />

                  </div>

                  {/* RIGHT */}
                  <div className="flex-1 p-4 md:p-5 border-t md:border-t-0 border-gray-300">

                    <h3 className="text-cyan-500 font-semibold mb-5 text-lg">
                      Water Orders
                    </h3>

                    <Info
                      text={`${todayOrders.filter((o) =>
                        o.qty.includes("Ltr")
                      ).length} Orders`}
                    />

                    <Info
                      text={`${todayOrders
                        .filter((o) =>
                          o.qty.includes("Ltr")
                        )
                        .reduce(
                          (sum, o) =>
                            sum +
                            parseInt(o.qty),
                          0
                        )} Ltr`}
                    />

                    <Info
                      text={`₹${todayOrders
                        .filter((o) =>
                          o.qty.includes("Ltr")
                        )
                        .reduce(
                          (sum, o) =>
                            sum + o.total,
                          0
                        )} Total`}
                    />

                  </div>

                </div>
              </div>

              {/* ================= UPCOMING ================= */}

              <div
                onClick={() =>
                  setShowUpcoming(true)
                }
                className="border-2 border-cyan-500 rounded-2xl p-3 md:p-4 bg-white cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
              >

                <h2 className="text-cyan-500 font-bold text-base md:text-lg mb-4">
                  Upcoming Orders
                </h2>

                <div className="flex flex-col md:flex-row border border-gray-300 rounded-xl overflow-hidden">

                  {/* LEFT */}
                  <div className="flex-1 p-4 md:p-5 md:border-r border-gray-300">

                    <h3 className="text-blue-600 font-semibold mb-5 text-lg">
                      Jar Orders
                    </h3>

                    <Info text="20 Orders" />
                    <Info text="80 Jars" />
                    <Info text="Rs. 7000" />

                  </div>

                  {/* RIGHT */}
                  <div className="flex-1 p-4 md:p-5 border-t md:border-t-0 border-gray-300">

                    <h3 className="text-cyan-500 font-semibold mb-5 text-lg">
                      Water Orders
                    </h3>

                    <Info text="30 Orders" />
                    <Info text="8000 Ltr water" />
                    <Info text="Rs. 30000" />

                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ================= MONTHLY ================= */}

          {activeTab === "monthly" && (
            <MonthlyTab />
          )}

          {/* ================= EXPENSES ================= */}

          {activeTab === "expenses" && (
            <ExpensesTab />
          )}

        </div>
      </div>
    </div>
  );
}

/* ================= TOP TAB BUTTON ================= */

function TopBtn({
  text,
  active,
  onClick,
  color,
}) {

  const activeColor =
    color === "blue"
      ? "from-blue-600 to-blue-400 border-blue-700"
      : color === "cyan"
      ? "from-cyan-600 to-cyan-400 border-cyan-700"
      : "from-red-600 to-red-400 border-red-700";

  const arrowColor =
    color === "blue"
      ? "border-t-blue-500"
      : color === "cyan"
      ? "border-t-cyan-500"
      : "border-t-red-500";

  return (
    <button
      onClick={onClick}
      className={`
        relative
        min-w-[110px]
        px-5
        py-3
        rounded-t-2xl
        font-bold
        text-sm md:text-base
        transition-all
        duration-300
        overflow-visible
        border-2

        ${
          active
            ? `
              text-white
              scale-[1.04]
              shadow-xl
              ${activeColor}
            `
            : `
              bg-white
              text-gray-700
              border-gray-300
              hover:bg-gray-100
            `
        }
      `}
    >

      {/* ACTIVE BG */}
      {active && (
        <>
          <div
            className={`
              absolute
              inset-0
              rounded-t-2xl
              bg-gradient-to-r
              ${activeColor}
            `}
          ></div>

          {/* ARROW */}
          <div
            className={`
              absolute
              left-1/2
              -translate-x-1/2
              top-full
              w-0
              h-0
              border-l-[16px]
              border-r-[16px]
              border-t-[16px]
              border-l-transparent
              border-r-transparent
              ${arrowColor}
            `}
          ></div>
        </>
      )}

      {/* TEXT */}
      <span className="relative z-10">
        {text}
      </span>

    </button>
  );
}

/* ================= INFO ================= */

function Info({ text }) {
  return (
    <div className="mb-4 text-gray-700 font-medium text-sm md:text-base">
      {text}
    </div>
  );
}