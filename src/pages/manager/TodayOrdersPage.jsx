// TodayOrdersPage.jsx

import React, { useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import OrderPage from "./Orderpage";

export default function TodayOrdersPage({
  orders,
  onBack,
}) {

  const [tab, setTab] =
    useState("pending");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  // ================= FILTER =================

  const pendingOrders =
    orders.filter(
      (item) => !item.completed
    );

  const completedOrders =
    orders.filter(
      (item) => item.completed
    );

  const activeOrders =
    tab === "pending"
      ? pendingOrders
      : completedOrders;

  // ================= OPEN ORDER PAGE =================

  if (selectedOrder) {
    return (
      <OrderPage
        customer={selectedOrder}
        onBack={() =>
          setSelectedOrder(null)
        }
      />
    );
  }

  return (
    <div className="flex bg-gray-200 min-h-screen">

      {/* SIDEBAR */}
      <ManagerSidebar />

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6">

        {/* ================= TOP ================= */}

        <div className="flex items-center justify-between mb-5">

          <button
            onClick={onBack}
            className="bg-white shadow px-4 py-2 rounded-xl"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-blue-600">
            Today's Orders
          </h1>
        </div>

        {/* ================= TABS ================= */}

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
                tab === "pending"
                  ? "bg-red-500"
                  : "bg-green-500"
              }
            `}
          ></div> */}

          {/* TAB BUTTONS */}
          <div className="relative z-20 flex gap-2  pb-1 px-2 pt-2">

            <TabBtn
              text="Pending"
              active={tab === "pending"}
              color="red"
              onClick={() =>
                setTab("pending")
              }
            />

            <TabBtn
              text="Completed"
              active={tab === "completed"}
              color="green"
              onClick={() =>
                setTab("completed")
              }
            />

          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div
          className={`
            rounded-[28px]
            p-4
            shadow-xl
            transition-all
            duration-500

            ${
              tab === "pending"
                ? "bg-red-50"
                : "bg-green-50"
            }
          `}
        >

          <div className="space-y-4">

            {activeOrders.map(
              (item, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-2xl p-5 shadow"
                >

                  <div className="grid md:grid-cols-6 gap-4">

                    {/* DATE */}
                    <div>
                      <p className="text-gray-500 text-sm">
                        Date
                      </p>

                      <p className="font-bold">
                        {item.date}
                      </p>
                    </div>

                    {/* CUSTOMER */}
                    <div>
                      <p className="text-gray-500 text-sm">
                        Customer
                      </p>

                      <p className="font-bold">
                        {item.name}
                      </p>

                      <p className="text-sm">
                        {item.mobile}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.address}
                      </p>
                    </div>

                    {/* MANAGER */}
                    <div>
                      <p className="text-gray-500 text-sm">
                        Manager
                      </p>

                      <p className="font-semibold">
                        {item.manager}
                      </p>
                    </div>

                    {/* QTY */}
                    <div>
                      <p className="text-gray-500 text-sm">
                        Quantity
                      </p>

                      <p className="font-semibold">
                        {item.qty}
                      </p>
                    </div>

                    {/* AMOUNT */}
                    <div>
                      <p className="text-gray-500 text-sm">
                        Amount
                      </p>

                      <p>
                        Pending :
                        {" "}
                        ₹{item.pending}
                      </p>

                      <p>
                        Total :
                        {" "}
                        ₹{item.total}
                      </p>
                    </div>

                    {/* BUTTON */}
                    <div className="flex items-center">

                      <button
                        onClick={() =>
                          setSelectedOrder(item)
                        }
                        className={`
                          text-white
                          px-4
                          py-2
                          rounded-xl
                          w-full
                          transition

                          ${
                            tab === "pending"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-green-600 hover:bg-green-700"
                          }
                        `}
                      >
                        {
                          tab === "pending"
                            ? "Delivery"
                            : "Completed"
                        }
                      </button>

                    </div>

                  </div>
                </div>
              )
            )}

            {/* EMPTY */}
            {activeOrders.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-500 font-semibold">
                No Orders Found
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= TAB BUTTON ================= */

function TabBtn({
  text,
  active,
  onClick,
  color,
}) {

  const activeColor =
    color === "red"
      ? "from-red-600 to-red-400 border-red-700"
      : "from-green-600 to-green-400 border-green-700";

  const arrowColor =
    color === "red"
      ? "border-t-red-500"
      : "border-t-green-500";

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

          {/* ARROW FLOW */}
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