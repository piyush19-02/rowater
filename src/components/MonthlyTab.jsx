// MonthlyTab.jsx

import React, { useState } from "react";
import {
  monthlyCustomers,
  deliveries,
} from "../data/demoData";

import OrderPage from "../pages/manager/Orderpage";

export default function MonthlyTab() {

  const [activeTab, setActiveTab] =
    useState("pending");

  // ORDER PAGE
  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  // TODAY
  const today = "2026-04-18";

  // CUSTOMER DATA
  const customerData =
    monthlyCustomers.map((customer) => {

      const customerDeliveries =
        deliveries.filter(
          (d) =>
            d.customer_id === customer.id
        );

      const totalDue =
        customerDeliveries.reduce(
          (sum, d) =>
            sum +
            (d.amount - d.received),
          0
        );

      const todayDelivery =
        customerDeliveries.find(
          (d) => d.date === today
        );

      return {
        ...customer,
        due: totalDue,
        served:
          todayDelivery ? true : false,
      };
    });

  // PENDING
  const pendingCustomers =
    customerData.filter(
      (c) => !c.served
    );

  // COMPLETED
  const completedCustomers =
    customerData.filter(
      (c) => c.served
    );

  // OPEN ORDER PAGE
  if (selectedCustomer) {
    return (
      <OrderPage
        customer={selectedCustomer}
        onBack={() =>
          setSelectedCustomer(null)
        }
      />
    );
  }

  return (
    <div className="w-full max-w-[700px]">

      {/* ================= TABS AREA ================= */}

      <div className=" mb-8">

        {/* FLOW LINE
        <div
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
              activeTab === "pending"
                ? "bg-red-500"
                : "bg-green-500"
            }
          `}
        ></div> */}

        {/* TABS */}
        <div className="relative z-20 flex gap-2  pb- px-2 pt-2">

          <TabBtn
            text="Pending"
            active={activeTab === "pending"}
            color="red"
            onClick={() =>
              setActiveTab("pending")
            }
          />

          <TabBtn
            text="Completed"
            active={activeTab === "completed"}
            color="green"
            onClick={() =>
              setActiveTab("completed")
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
            activeTab === "pending"
              ? "bg-red-50"
              : "bg-green-50"
          }
        `}
      >

        {/* ================= PENDING ================= */}

        {activeTab === "pending" && (
          <div className="space-y-4">

            {pendingCustomers.map(
              (customer) => (
                <div
                  key={customer.id}
                  onClick={() =>
                    setSelectedCustomer(
                      customer
                    )
                  }
                  className="bg-white border border-red-300 rounded-2xl p-4 cursor-pointer hover:shadow-md transition"
                >

                  <div className="flex justify-between">

                    <div className="mt-3 space-y-1 mb-6">

                      <p className="text-gray-700">
                        👤 Name :
                        {" "}
                        <span className="font-semibold">
                          {customer.name}
                        </span>
                      </p>

                      <p className="text-gray-700">
                        📞 Mobile :
                        {" "}
                        <span className="font-semibold">
                          {customer.mobile}
                        </span>
                      </p>

                      <p className="text-gray-700">
                        📍 Address :
                        {" "}
                        <span className="font-semibold">
                          {customer.address}
                        </span>
                      </p>

                      <p className="text-gray-700">
                        💰 Last Payment Date :
                        {" "}
                        <span className="font-semibold">
                          22-Apr-2026
                        </span>
                      </p>

                      <p className="text-gray-700">
                        🚚 Last Served Date :
                        {" "}
                        <span className="font-semibold">
                          23-Apr-2026
                        </span>
                      </p>

                    </div>

                    <div>
                      <p className="text-red-500 font-bold text-lg">
                        ₹
                        {
                          customer.due
                        }
                      </p>
                    </div>

                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ================= COMPLETED ================= */}

        {activeTab === "completed" && (
          <div className="space-y-4">

            {completedCustomers.map(
              (customer) => (
                <div
                  key={customer.id}
                  className="bg-white border border-green-300 rounded-2xl p-4"
                >

                  <div className="flex justify-between">

                    <div>

                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {customer.name}

                        <span className="text-green-600">
                          ✔
                        </span>
                      </h3>

                      <p className="text-sm text-gray-500">
                        {
                          customer.mobile
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        {
                          customer.address
                        }
                      </p>

                    </div>

                    <div>
                      <p className="text-red-500 font-bold text-lg">
                        ₹
                        {
                          customer.due
                        }
                      </p>
                    </div>

                  </div>
                </div>
              )
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/* ================= TAB ================= */

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