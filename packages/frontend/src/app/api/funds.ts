import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: { method: string; body: { name: any; amount: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { id: number; name: string; amount: number; createdAt: Date; } | { id: number; name: string; amount: number; createdAt: Date; }[]): void; new(): any; }; }; }) {
  if (req.method === 'GET') {
    const funds = await prisma.fund.findMany();
    res.status(200).json(funds);
  } else if (req.method === 'POST') {
    const { name, amount } = req.body;
    const newFund = await prisma.fund.create({
      data: { name, amount },
    });
    res.status(201).json(newFund);
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
