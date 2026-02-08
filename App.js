import React, { useEffect, useState } from "react";
import HeaderWeb from "./components/Header";
import TabsWeb from "./components/Tabs";
import AddCustomerWeb from "./components/AddCustomer";
import BulkUpdateWeb from "./components/BulkUpdate";
import CustomerListWeb from "./components/CustomerList";
import StatusAlertWeb from "./components/StatusAlert";
import {
  loadCustomers,
  saveCustomers as saveToStorage,
} from "./utils/localStorage";
import { parseBulkUpdates } from "./utils/bulkParser";
import { styles } from "./styles/webStyles";

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [bulkUpdates, setBulkUpdates] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    const stored = loadCustomers();
    setCustomers(stored);
  }, []);

  const saveCustomers = (next) => {
    setCustomers(next);
    saveToStorage(next);
  };

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer = {
        id: Date.now(),
        name: newCustomer.name,
        phone: newCustomer.phone,
        balance: 0,
        transactions: [],
      };
      saveCustomers([...customers, customer]);
      setNewCustomer({ name: "", phone: "" });
      setUpdateStatus("Customer added successfully!");
      setTimeout(() => setUpdateStatus(""), 3000);
    }
  };

  const handleBulkUpdate = () => {
    const updates = parseBulkUpdates(bulkUpdates);
    if (updates.length === 0) {
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus(""), 4000);
      return;
    }

    const updatedCustomers = customers.map((customer) => {
      const update = updates.find(
        (u) =>
          customer.name.toLowerCase().includes(u.name.toLowerCase()) ||
          u.name.toLowerCase().includes(customer.name.toLowerCase()),
      );

      if (update) {
        const transaction = {
          date: new Date().toISOString(),
          amount: update.amount,
          type: update.type,
          balance:
            customer.balance +
            (update.type === "received" ? update.amount : -update.amount),
        };

        return {
          ...customer,
          balance: transaction.balance,
          transactions: [...customer.transactions, transaction],
        };
      }

      return customer;
    });

    saveCustomers(updatedCustomers);
    setBulkUpdates("");
    setUpdateStatus(`Successfully updated ${updates.length} customer(s)!`);
    setTimeout(() => setUpdateStatus(""), 3000);
  };

  const getTodayTransactions = () => {
    const today = new Date().toDateString();
    return customers.map((customer) => {
      const todayTrans = customer.transactions.filter(
        (t) => new Date(t.date).toDateString() === today,
      );
      const todayTotal = todayTrans.reduce(
        (sum, t) => sum + (t.type === "received" ? t.amount : -t.amount),
        0,
      );
      return { ...customer, todayTotal };
    });
  };

  const filteredCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm),
      );
    }

    if (filterDate === "today") {
      return getTodayTransactions().filter((c) => c.todayTotal !== 0);
    }

    return filtered;
  };

  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);
  const todayBalance = getTodayTransactions().reduce(
    (sum, c) => sum + c.todayTotal,
    0,
  );

  return (
    <div style={styles.container}>
      <HeaderWeb totalBalance={totalBalance} todayBalance={todayBalance} />
      <TabsWeb activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={styles.content}>
        <StatusAlertWeb updateStatus={updateStatus} />

        {activeTab === 0 && (
          <AddCustomerWeb
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
            handleAddCustomer={handleAddCustomer}
          />
        )}

        {activeTab === 1 && (
          <BulkUpdateWeb
            bulkUpdates={bulkUpdates}
            setBulkUpdates={setBulkUpdates}
            handleBulkUpdate={handleBulkUpdate}
          />
        )}

        {activeTab === 2 && (
          <CustomerListWeb
            filteredCustomers={
              filterDate === "today"
                ? getTodayTransactions().filter((c) => c.todayTotal !== 0)
                : filteredCustomers()
            }
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
          />
        )}
      </div>
    </div>
  );
};

export default App;
