import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';
import './styles.css';
import { Input } from './ui/input';
import { API, Auth } from 'aws-amplify';
import { BillType } from '@/types/bill';
import { CheckIcon } from '@radix-ui/react-icons';

export default function Bills() {
  const [billName, setBillName] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billAmount, setBillAmount] = useState<number>(0);
  const [billPaid, setBillPaid] = useState(false);
  const [billList, setBillList] = useState<BillType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<BillType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openBillId, setOpenBillId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const response = await API.get('deposit', '/bill', {});
        setBillList(response);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, []);

  const handleAddBill = async (e: React.FormEvent) => {
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

  const handleEditBill = async (id: string) => {
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
        resetForm(); // Reset form after editing
      } catch (error) {
        console.error('Error updating bill:', error);
      }
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await API.del('deposit', `/bill/${id}`, {});
      setBillList(billList.filter((bill) => bill.billId !== id));
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const toggleBillPaid = async (id: string) => {
    const updatedBills = billList.map((bill) =>
      bill.billId === id ? { ...bill, billPaid: !bill.billPaid } : bill
    );
    setBillList(updatedBills);

    // Optionally update the backend
    await API.put('deposit', `/bill/${id}`, {
      body: {
        billName: billList.find((bill) => bill.billId === id)?.billName,
        billAmount: billList.find((bill) => bill.billId === id)?.billAmount,
        billDate: billList.find((bill) => bill.billId === id)?.billDate,
        billPaid: !billList.find((bill) => bill.billId === id)?.billPaid,
      },
    });
  };

  const resetForm = () => {
    setBillName('');
    setBillDate('');
    setBillAmount(0);
    setIsDialogOpen(false);
    setEditingBill(null);
    setIsEditing(false);
  };

  const openEditDialog = (bill: BillType) => {
    setEditingBill(bill);
    setBillName(bill.billName);
    setBillDate(bill.billDate);
    setBillAmount(bill.billAmount);
    setBillPaid(bill.billPaid);
    setIsDialogOpen(true);
    setIsEditing(true);
  };

  const toggleAccordion = (billId: string) => {
    setOpenBillId(openBillId === billId ? null : billId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bills</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {billList.length === 0 ? (
            <p className="text-muted-foreground text-md mt-5">
              All your listed bills will be shown here.
            </p>
          ) : (
            <>
              <div className="mt-5">
                <p className="text-muted-foreground">
                  All your bills with their corresponding due dates
                </p>
              </div>
              <ul className="mt-4">
                {billList.map((bill) => (
                  <li key={bill.billId} className="border-b py-2">
                    <div
                      onClick={() =>
                        toggleAccordion(bill.billId ? bill.billId : '')
                      }
                      className="cursor-pointer flex justify-between items-center"
                    >
                      <span className="flex justify-between items-center">
                        <span className="flex items-center">
                          {bill.billPaid ? (
                            <CheckIcon className="mr-1" color="green" />
                          ) : (
                            <CheckIcon className="mr-1" color="white" />
                          )}
                          <span className={bill.billPaid ? '' : ''}>
                            {bill.billName}
                            {' - '}
                            <span className="text-muted-foreground ml-2">
                              ₱{bill.billAmount}
                            </span>
                          </span>
                        </span>
                      </span>
                      <span className="text-muted-foreground text-xs font-light">
                        {new Date(bill.billDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {openBillId === bill.billId && (
                      <div className="flex justify-end mt-2 -gap-x-2">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            toggleBillPaid(bill.billId?.toString() || '')
                          }
                          className="scale-75"
                        >
                          {bill.billPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => openEditDialog(bill)}
                          className="-ml-5 scale-75"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() =>
                            handleDeleteBill(bill.billId?.toString() || '')
                          }
                          className="scale-75"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogOverlay className="DialogOverlay" />
            <DialogTrigger asChild className="flex justify-end">
              <Button className="mt-4 ml-auto scale-90">Add a Bill</Button>
            </DialogTrigger>
            <DialogContent className="DialogContent">
              <DialogHeader>
                <DialogTitle className="font-semibold">
                  {isEditing ? 'Edit Bill' : 'Add a New Bill'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditing ? 'Edit the bill details' : 'Create a new bill'}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  isEditing
                    ? handleEditBill(editingBill?.billId || '')
                    : handleAddBill(e);
                }}
              >
                <div className="flex flex-col space-y-2 gap-2">
                  <Input
                    type="text"
                    placeholder="Bill Name"
                    value={billName}
                    onChange={(e) => setBillName(e.target.value)}
                    className="p-2 border-black"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Bill Amount"
                    value={billAmount}
                    onChange={(e) => setBillAmount(Number(e.target.value))}
                    className="p-2 border-black"
                    required
                  />
                  <Input
                    type="date"
                    placeholder="Bill Date"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="p-2"
                    required
                  />
                </div>
                <div className="flex justify-end mt-10">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="ml-2">
                    {isEditing ? 'Update Bill' : 'Add Bill'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
}
