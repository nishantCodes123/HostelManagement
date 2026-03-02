import { ExpenseService } from "./services/expenseService.js";
import { UI } from "./ui/UI.js";
const service = new ExpenseService();
new UI(service);
