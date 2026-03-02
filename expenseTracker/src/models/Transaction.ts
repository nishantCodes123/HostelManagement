export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: "Food" | "Transportation" | "Miscellaneous";
  date: string;
}