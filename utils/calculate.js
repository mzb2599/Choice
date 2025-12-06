/** Computes today's transactions for all customers */
export const getTodayTransactions = (customers) => {
  const today = new Date().toDateString();

  return customers.map((customer) => {
    const todayTrans = customer.transactions.filter(
      (t) => new Date(t.date).toDateString() === today
    );

    const todayTotal = todayTrans.reduce(
      (sum, t) => sum + (t.type === "received" ? t.amount : -t.amount),
      0
    );

    return { ...customer, todayTotal };
  });
};

/** Total balance across all customers */
export const getTotalBalance = (customers) =>
  customers.reduce((sum, c) => sum + c.balance, 0);

/** Today's total across all customers */
export const getTodayBalance = (todayList) =>
  todayList.reduce((sum, c) => sum + c.todayTotal, 0);
