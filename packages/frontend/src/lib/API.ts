import { Auth, API } from 'aws-amplify';
import {
  DepositType,
  WithdrawType,
  BalanceType,
  BillType,
} from '@/types/types';

// AUTHENTICATION
export const checkAuth = async (
  setName: React.Dispatch<React.SetStateAction<string>>,
  setDailyDeposit: React.Dispatch<React.SetStateAction<number | null>>,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>
) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    setName(user.attributes.name || '');
    setDailyDeposit(
      user.attributes['custom:dailyDeposit']
        ? parseFloat(user.attributes['custom:dailyDeposit'])
        : 0
    );
    setIsAuthenticated(true);
  } catch {
    setIsAuthenticated(false);
  }
};

export const fetchUser = async (
  setName: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    setName(user.attributes.name || '');

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

export const fetchUserDailyDeposit = async (
  setName: React.Dispatch<React.SetStateAction<string>>,
  setDepositAmount: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const user = await fetchUser(setName);
    const userDailyDeposit = user.attributes['custom:dailyDeposit']
      ? parseFloat(user.attributes['custom:dailyDeposit'])
      : 0;
    setDepositAmount(userDailyDeposit);
  } catch (error) {
    console.error('Error fetching user daily deposit:', error);
  }
};
// END OF AUTHENTICATION ============================================================================

// DEPOSIT
export const fetchDeposits = async (
  setDeposits: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await API.get('deposit', `/deposit`, {});
    const sortedDeposits = response.sort(
      (
        a: { depositDate: string | number | Date },
        b: { depositDate: string | number | Date }
      ) => new Date(b.depositDate).getTime() - new Date(a.depositDate).getTime()
    );
    setDeposits(sortedDeposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
  }
};

export const createDeposit = async (deposit: DepositType) => {
  try {
    const response = await API.post('deposit', `/deposit`, {
      body: deposit,
    });
    console.log('Deposit created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating deposit:', error);
    throw error;
  }
};

// END OF DEPOSIT ============================================================================

// WITHDRAW
export const fetchWithdrawals = async (
  setWithdrawals: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await API.get('deposit', `/withdraw`, {});
    const sortedWithdrawals = response.sort(
      (
        a: { withdrawDate: string | number | Date },
        b: { withdrawDate: string | number | Date }
      ) =>
        new Date(b.withdrawDate).getTime() - new Date(a.withdrawDate).getTime()
    );
    setWithdrawals(sortedWithdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
  }
};

export const createWithdrawal = async (withdraw: WithdrawType) => {
  try {
    const response = await API.post('deposit', `/withdraw`, {
      body: withdraw,
    });
    console.log('Withdrawal created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    throw error;
  }
};

// END OF WITHDRAW============================================================================

// BALANCE
export const fetchBalance = async (
  setBalance: React.Dispatch<React.SetStateAction<number | null>>
) => {
  try {
    const response = await API.get('deposit', `/balance`, {});
    const sortedBalances = response.sort(
      (
        a: { balanceDate: string | number | Date },
        b: { balanceDate: string | number | Date }
      ) => new Date(b.balanceDate).getTime() - new Date(a.balanceDate).getTime()
    );

    if (sortedBalances.length > 0 && sortedBalances[0].balanceAmount) {
      setBalance(sortedBalances[0].balanceAmount);
    } else {
      console.error('No balance returned from API');
      setBalance(0);
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
    setBalance(0);
  }
};

export const fetchBalanceHistory = async (
  setBalanceHistory: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await API.get('deposit', `/balance`, {});
    const sortedBalanceHistory = response.sort(
      (
        a: { balanceDate: string | number | Date },
        b: { balanceDate: string | number | Date }
      ) => new Date(a.balanceDate).getTime() - new Date(b.balanceDate).getTime()
    );
    setBalanceHistory(sortedBalanceHistory);
  } catch (error) {
    console.error('Error fetching balance history:', error);
  }
};

export const createBalance = async (balance: BalanceType) => {
  try {
    const response = await API.post('deposit', `/balance`, {
      body: balance,
    });
    console.log('Balance created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating balance:', error);
    throw error;
  }
};

// END OF BALANCE ============================================================================

// BILLS
export const fetchBills = async (
  setBillList: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await API.get('deposit', '/bill', {});
    setBillList(response);
  } catch (error) {
    console.error('Error fetching bills:', error);
  }
};

export const createBill = async (
  e: React.FormEvent,
  billName: string,
  billAmount: number,
  billDate: string,
  billPaid: boolean,
  billList: BillType[],
  setBillList: React.Dispatch<React.SetStateAction<any>>,
  resetForm: () => void
) => {
  e.preventDefault();
  if (billName && billDate) {
    try {
      const response = await API.post('deposit', '/bill', {
        body: {
          billName: billName,
          billAmount: billAmount,
          billDate: billDate,
          billPaid: billPaid,
        },
      });
      setBillList([...billList, { ...response, paid: false }]);
      resetForm();
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  }
};

export const editBill = async (
  id: string,
  billName: string,
  billAmount: number,
  billDate: string,
  billPaid: boolean,
  billList: BillType[],
  setBillList: React.Dispatch<React.SetStateAction<any>>,
  resetForm: () => void,
  editingBill: BillType | null
) => {
  if (editingBill) {
    try {
      await API.put('deposit', `/bill/${id}`, {
        body: {
          billName,
          billAmount,
          billDate,
          billPaid,
        },
      });
      const updatedBills = billList.map((bill) =>
        bill.billId === id
          ? { ...bill, billName, billAmount, billDate, billPaid }
          : bill
      );
      setBillList(updatedBills);
      resetForm();
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  }
};

export const deleteBill = async (
  id: string,
  billList: BillType[],
  setBillList: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    await API.del('deposit', `/bill/${id}`, {});
    setBillList(billList.filter((bill) => bill.billId !== id));
  } catch (error) {
    console.error('Error deleting bill:', error);
  }
};

export const toggleBillPaid = async (
  id: string,
  billList: BillType[],
  setBillList: React.Dispatch<React.SetStateAction<any>>
) => {
  const updatedBills = billList.map((bill) =>
    bill.billId === id ? { ...bill, billPaid: !bill.billPaid } : bill
  );
  setBillList(updatedBills);

  await API.put('deposit', `/bill/${id}`, {
    body: {
      billName: billList.find((bill) => bill.billId === id)?.billName,
      billAmount: billList.find((bill) => bill.billId === id)?.billAmount,
      billDate: billList.find((bill) => bill.billId === id)?.billDate,
      billPaid: !billList.find((bill) => bill.billId === id)?.billPaid,
    },
  });
};

// END OF BILLS ============================================================================
