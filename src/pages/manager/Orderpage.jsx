// OrderPage.jsx

import React, { useState } from "react";

export default function OrderPage({
  customer,
  onBack,
  onComplete,
}) {

  // ================= POPUPS =================

  const [popup, setPopup] =
    useState("");

  // ================= EDIT POPUP =================

  const [selectedEntry, setSelectedEntry] =
    useState(null);

  const [editPopup, setEditPopup] =
    useState(false);

  // ================= DATA =================

  const [jarDeliveries, setJarDeliveries] =
    useState([
      {
        qty: 5,
        rate: 25,
        amount: 125,
        by: "Hariom",
        date: "22-Apr-2026",
        time: "08:13 pm",
      },

      {
        qty: 5,
        rate: 25,
        amount: 125,
        by: "Hariom",
        date: "22-Apr-2026",
        time: "08:13 pm",
      },

      {
        qty: 5,
        rate: 25,
        amount: 125,
        by: "Hariom",
        date: "22-Apr-2026",
        time: "08:13 pm",
      },
    ]);

  const [waterDeliveries, setWaterDeliveries] =
    useState([
      {
        qty: 200,
        rate: 2,
        amount: 400,
        by: "Hariom",
        date: "22-Apr-2026",
        time: "07:30 pm",
      },
    ]);

  const [payments, setPayments] =
    useState([
      {
        amount: 1000,
        by: "Cash",
        date: "22-Apr-2026",
        time: "09:10 pm",
      },
    ]);

  // ================= FINAL =================

  const handleFinalSubmit = () => {

    if (onComplete) {
      onComplete(customer.id);
    }

    alert(
      `${customer.name} moved to completed`
    );

    onBack();
  };

  return (
    <div className="w-full max-w-[950px] mx-auto pb-20">

      {/* ================= TOP ================= */}

      <div className="bg-white rounded-3xl shadow-lg border border-gray-300 p-5 mb-5">

        <button
          onClick={onBack}
          className="bg-gray-200 px-4 py-2 rounded-lg mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-blue-600">
          {customer.name}
        </h1>

        <p className="mt-2 text-gray-700">
          📞 {customer.mobile}
        </p>

        <p className="text-gray-700">
          📍 {customer.address}
        </p>

        <p className="text-gray-700 mt-2">
          👨‍💼 Manager :
          {" "}
          {customer.manager}
        </p>

        <div className="mt-4 flex gap-4 flex-wrap">

          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-bold">
            Pending :
            {" "}
            ₹{customer.pending}
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">
            Total :
            {" "}
            ₹{customer.total}
          </div>

        </div>
      </div>

      {/* ================= JAR DELIVERY ================= */}

      <Section
        title="Jar Deliveries"
        btn="+ Deliver Jars"
        onClick={() =>
          setPopup("jar")
        }
      >

        {jarDeliveries.map(
          (item, index) => (

            <div
              key={index}
              onClick={() => {

                // ONLY LAST ENTRY CLICKABLE
                if (
                  index ===
                  jarDeliveries.length - 1
                ) {

                  setSelectedEntry({
                    ...item,
                    index,
                    type: "jar",
                  });

                  setEditPopup(true);
                }
              }}
              className={
                index ===
                jarDeliveries.length - 1
                  ? "cursor-pointer"
                  : ""
              }
            >

              <EntryRow
                left={`${item.qty} Jars`}
                middle={`₹${item.amount}`}
                by={item.by}
                date={item.date}
                time={item.time}
              />

            </div>
          )
        )}

      </Section>

      {/* ================= WATER DELIVERY ================= */}

      <Section
        title="Water Deliveries"
        btn="+ Deliver Water"
        onClick={() =>
          setPopup("water")
        }
      >

        {waterDeliveries.map(
          (item, index) => (

            <EntryRow
              key={index}
              left={`${item.qty} Ltr`}
              middle={`₹${item.amount}`}
              by={item.by}
              date={item.date}
              time={item.time}
            />
          )
        )}

      </Section>

      {/* ================= PAYMENTS ================= */}

      <Section
        title="Payments"
        btn="+ Add Payment"
        onClick={() =>
          setPopup("payment")
        }
      >

        {payments.map(
          (item, index) => (

            <EntryRow
              key={index}
              left={`₹${item.amount}`}
              middle={item.by}
              by={item.date}
              date={item.time}
            />
          )
        )}

      </Section>

      {/* ================= FINAL BUTTON ================= */}

      <button
        onClick={handleFinalSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-bold mt-8"
      >
         SUBMIT
      </button>

      {/* ================= JAR FORM ================= */}

      {popup === "jar" && (
        <JarForm
          onClose={() =>
            setPopup("")
          }
          onSubmit={(data) => {

            setJarDeliveries([
              data,
              ...jarDeliveries,
            ]);

            setPopup("");
          }}
        />
      )}

      {/* ================= WATER FORM ================= */}

      {popup === "water" && (
        <WaterForm
          onClose={() =>
            setPopup("")
          }
          onSubmit={(data) => {

            setWaterDeliveries([
              data,
              ...waterDeliveries,
            ]);

            setPopup("");
          }}
        />
      )}

      {/* ================= PAYMENT FORM ================= */}

      {popup === "payment" && (
        <PaymentForm
          onClose={() =>
            setPopup("")
          }
          onSubmit={(data) => {

            setPayments([
              data,
              ...payments,
            ]);

            setPopup("");
          }}
        />
      )}

      {/* ================= EDIT POPUP ================= */}

      {editPopup && selectedEntry && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

          <div className="bg-white w-full max-w-[420px] rounded-2xl p-5">

            <h2 className="text-2xl font-bold text-blue-600 mb-5">
              Edit Delivery
            </h2>

            {/* INPUTS */}

            <div className="space-y-4">

              <input
                value={selectedEntry.qty}
                onChange={(e) =>
                  setSelectedEntry({
                    ...selectedEntry,
                    qty: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg"
                placeholder="Quantity"
              />

              <input
                value={selectedEntry.amount}
                onChange={(e) =>
                  setSelectedEntry({
                    ...selectedEntry,
                    amount: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg"
                placeholder="Amount"
              />

              <input
                value={selectedEntry.by}
                onChange={(e) =>
                  setSelectedEntry({
                    ...selectedEntry,
                    by: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg"
                placeholder="Driver"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 mt-6">

              {/* SAVE */}

              <button
                onClick={() => {

                  const updated =
                    [...jarDeliveries];

                  updated[
                    selectedEntry.index
                  ] = selectedEntry;

                  setJarDeliveries(updated);

                  setEditPopup(false);
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
              >
                Save
              </button>

              {/* DELETE */}

              <button
                onClick={() => {

                  const updated =
                    jarDeliveries.filter(
                      (_, i) =>
                        i !==
                        selectedEntry.index
                    );

                  setJarDeliveries(updated);

                  setEditPopup(false);
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl"
              >
                Delete
              </button>

            </div>

            {/* CLOSE */}

            <button
              onClick={() =>
                setEditPopup(false)
              }
              className="w-full mt-3 bg-gray-300 py-3 rounded-xl"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

/* ================= SECTION ================= */

function Section({
  title,
  btn,
  onClick,
  children,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-300 p-5 mb-5">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold text-blue-600">
          {title}
        </h2>

        <button
          onClick={onClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          {btn}
        </button>

      </div>

      <div className="space-y-3">
        {children}
      </div>

    </div>
  );
}

/* ================= ENTRY ROW ================= */

function EntryRow({
  left,
  middle,
  by,
  date,
  time,
}) {
  return (
    <div className="border rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition">

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

        <div>
          <p className="text-gray-500 text-sm">
            Qty
          </p>

          <p className="font-bold">
            {left}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Amount
          </p>

          <p className="font-bold">
            {middle}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            By
          </p>

          <p className="font-bold">
            {by}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Date
          </p>

          <p className="font-bold">
            {date}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Time
          </p>

          <p className="font-bold">
            {time}
          </p>
        </div>

      </div>
    </div>
  );
}

/* ================= POPUP WRAPPER ================= */

function PopupWrapper({
  title,
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

      <div className="bg-white w-full max-w-[500px] rounded-2xl p-5">

        <h2 className="text-2xl font-bold mb-5 text-blue-600">
          {title}
        </h2>

        {children}

        <button
          onClick={onClose}
          className="mt-5 bg-red-500 text-white px-5 py-2 rounded-lg"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

/* ================= JAR FORM ================= */

function JarForm({
  onClose,
  onSubmit,
}) {

  const [form, setForm] =
    useState({
      qty: "",
      rate: "",
      amount: "",
      driver: "",
    });

  return (
    <PopupWrapper
      title="Jar Delivery"
      onClose={onClose}
    >

      <div className="space-y-4">

        <input
          placeholder="Quantity"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              qty: e.target.value,
            })
          }
        />

        <input
          placeholder="Rate"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              rate: e.target.value,
            })
          }
        />

        <input
          placeholder="Amount"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
        />

        <input
          placeholder="Driver"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              driver: e.target.value,
            })
          }
        />

        <button
          onClick={() =>
            onSubmit({
              ...form,
              by: form.driver,
              date: "22-Apr-2026",
              time: "08:13 pm",
            })
          }
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          Submit
        </button>

      </div>
    </PopupWrapper>
  );
}

/* ================= WATER FORM ================= */

function WaterForm({
  onClose,
  onSubmit,
}) {

  const [form, setForm] =
    useState({
      qty: "",
      rate: "",
      amount: "",
      driver: "",
    });

  return (
    <PopupWrapper
      title="Water Delivery"
      onClose={onClose}
    >

      <div className="space-y-4">

        <input
          placeholder="Liters"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              qty: e.target.value,
            })
          }
        />

        <input
          placeholder="Rate"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              rate: e.target.value,
            })
          }
        />

        <input
          placeholder="Amount"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
        />

        <input
          placeholder="Driver"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              driver: e.target.value,
            })
          }
        />

        <button
          onClick={() =>
            onSubmit({
              ...form,
              by: form.driver,
              date: "22-Apr-2026",
              time: "07:30 pm",
            })
          }
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          Submit
        </button>

      </div>
    </PopupWrapper>
  );
}

/* ================= PAYMENT FORM ================= */

function PaymentForm({
  onClose,
  onSubmit,
}) {

  const [form, setForm] =
    useState({
      amount: "",
      by: "",
    });

  return (
    <PopupWrapper
      title="Add Payment"
      onClose={onClose}
    >

      <div className="space-y-4">

        <input
          placeholder="Amount"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
        />

        <input
          placeholder="Payment Method"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            setForm({
              ...form,
              by: e.target.value,
            })
          }
        />

        <button
          onClick={() =>
            onSubmit({
              ...form,
              date: "22-Apr-2026",
              time: "09:10 pm",
            })
          }
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          Submit
        </button>

      </div>
    </PopupWrapper>
  );
}