export interface Resident{
    id:string;
    name:string;
    age:number;
    phone:string;
    checkInDate:string;
    roomNumber:number; //one-to-one mapping with rooms.ts (same property)
}