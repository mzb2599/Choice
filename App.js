import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import AddCustomer from "./components/AddCustomer";
import BulkUpdate from "./components/BulkUpdate";
import CustomerList from "./components/CustomerList";
import CustomerOrders from "./components/CustomerOrders";
import StatusAlert from "./components/StatusAlert";
import ProductCatalog from "./components/ProductCatalog";
import ProductListPage from "./components/ProductListPage";
import BackupToDrive from "./components/BackupToDrive";
import {
  loadCustomers,
  saveCustomers as saveToStorage,
} from "./utils/localStorage";
import { parseBulkUpdates } from "./utils/bulkParser";
import { Styles } from "./styles/Styles";
import { ScrollView, View } from "react-native";
import AuthScreen from "./components/AuthScreen";
import { clearSession, getSession } from "./utils/auth";

const App = () => {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [bulkEntries, setBulkEntries] = useState([]);
  const [bulkDraft, setBulkDraft] = useState({
    customerName: "",
    amount: "",
    type: "received",
  });
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    getSession().then((stored) => {
      setSession(stored);
      setSessionLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchCustomers = async () => {
      const stored = await loadCustomers(session.user.id);
      setCustomers(Array.isArray(stored) ? stored : []);
    };

    fetchCustomers();
  }, [session]);

  const saveCustomers = (next) => {
    setCustomers(next);
    saveToStorage(next, session.user.id);
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

  const handleAddBulkEntry = () => {
    const amount = Number(bulkDraft.amount);
    const customerName = bulkDraft.customerName.trim();

    if (!customerName || !Number.isFinite(amount) || amount <= 0) {
      setUpdateStatus("Please select a customer and enter a valid amount.");
      setTimeout(() => setUpdateStatus(""), 4000);
      return;
    }

    setBulkEntries((prev) => [
      ...prev,
      {
        customerName,
        amount,
        type: bulkDraft.type,
      },
    ]);
    setBulkDraft((prev) => ({ ...prev, amount: "", type: "received" }));
    setUpdateStatus(`Added ${customerName} to the update queue.`);
    setTimeout(() => setUpdateStatus(""), 2500);
  };

  const handleBulkUpdate = () => {
    const updates = parseBulkUpdates(bulkEntries);
    if (updates.length === 0) {
      setUpdateStatus("Please add at least one update before saving.");
      setTimeout(() => setUpdateStatus(""), 4000);
      return;
    }

    const updatedCustomers = customers.map((customer) => {
      const customerUpdates = updates.filter(
        (update) => customer.name.toLowerCase() === update.name.toLowerCase(),
      );

      if (customerUpdates.length === 0) return customer;

      let balance = customer.balance;
      const newTransactions = customerUpdates.map((update) => {
        balance += update.type === "received" ? update.amount : -update.amount;

        return {
          date: new Date().toISOString(),
          amount: update.amount,
          type: update.type,
          balance,
        };
      });

      return {
        ...customer,
        balance,
        transactions: [...customer.transactions, ...newTransactions],
      };
    });

    saveCustomers(updatedCustomers);
    setBulkEntries([]);
    setBulkDraft({ customerName: "", amount: "", type: "received" });
    setUpdateStatus(`Successfully updated ${updates.length} customer(s)!`);
    setTimeout(() => setUpdateStatus(""), 3000);
  };

  const getAllTransactions = () => {
    return customers.flatMap((customer) =>
      (customer.transactions || []).map((transaction) => ({
        ...transaction,
        customerName: customer.name,
        customerId: customer.id,
      })),
    );
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

  const handleNavigate = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  if (sessionLoading) return null;
  if (!session) return <AuthScreen onAuthenticated={setSession} />;

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

  const totalBalance =
    customers && customers.reduce((sum, c) => sum + c.balance, 0);
  const todayBalance = getTodayTransactions().reduce(
    (sum, c) => sum + c.todayTotal,
    0,
  );

  const handleDataRestore = (backupData) => {
    if (backupData.customers) {
      setCustomers(backupData.customers);
    }
    setUpdateStatus("Data restored from backup successfully!");
    setTimeout(() => setUpdateStatus(""), 3000);
  };

  return (
    <View style={Styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Header
          totalBalance={totalBalance}
          todayBalance={todayBalance}
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onLogout={async () => {
            await clearSession();
            setSession(null);
          }}
        />

        <View style={Styles.content}>
          <StatusAlert updateStatus={updateStatus} />

          {activeTab === 0 && (
            <AddCustomer
              newCustomer={newCustomer}
              setNewCustomer={setNewCustomer}
              handleAddCustomer={handleAddCustomer}
              customers={customers}
              updateStatus={updateStatus}
            />
          )}

          {activeTab === 1 && (
            <BulkUpdate
              customers={customers}
              bulkEntries={bulkEntries}
              setBulkEntries={setBulkEntries}
              bulkDraft={bulkDraft}
              setBulkDraft={setBulkDraft}
              handleAddBulkEntry={handleAddBulkEntry}
              handleBulkUpdate={handleBulkUpdate}
              updateStatus={updateStatus}
            />
          )}

          {activeTab === 2 && (
            <CustomerList
              data={
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

          {activeTab === 3 && (
            <CustomerOrders transactions={getAllTransactions()} />
          )}

          {activeTab === 4 && <ProductCatalog userId={session.user.id} />}
          {activeTab === 5 && <ProductListPage userId={session.user.id} />}
          {activeTab === 6 && (
            <BackupToDrive
              customers={customers}
              onDataRestore={handleDataRestore}
              token={session.token}
              userId={session.user.id}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default App;
