import { hostelService } from "./service/hostelService.js";
import { UI } from "./ui/ui.js";
const data = new hostelService();
new UI(data);
