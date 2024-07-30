export interface DepositType {
  depositId?: string;
  name: string;
  depositAmount: number;
  depositNote: string;
  depositDate: string;
}

export interface WithdrawType {
  withdrawId?: string;
  name: string;
  withdrawAmount: number;
  withdrawNote: string;
  withdrawDate: string;
}

export interface BalanceType {
  balanceId?: string;
  balanceAmount: number;
  balanceDate: string;
}

export interface BillType {
  billId?: string;
  billName: string;
  billAmount: number;
  billDate: string;
  billPaid: boolean;
}
