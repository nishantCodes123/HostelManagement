import { roomsAvailability } from "../data/roomsData.js";
export class hostelService {
    constructor() {
        this.rooms = [];
        this.resident = [];
        this.loadData();
    }
    // ! this is for loading the data into the memory
    loadData() {
        const storedRooms = localStorage.getItem("rooms");
        const storedResidents = localStorage.getItem("residents");
        if (storedRooms) {
            this.rooms = JSON.parse(storedRooms);
        }
        else {
            this.rooms = roomsAvailability;
        }
        if (storedResidents) {
            this.resident = JSON.parse(storedResidents);
        }
        else {
            this.resident = [];
        }
    }
    //! Getters for rooms and residents
    get getRooms() {
        return this.rooms;
    }
    get getResidents() {
        return this.resident;
    }
    //! Storing the data
    saveData() {
        localStorage.setItem("rooms", JSON.stringify(this.rooms));
        localStorage.setItem("residents", JSON.stringify(this.resident));
    }
    //! Add Resident
    addResident(name, age, phone, roomNumber, checkInDate) {
        const room = this.rooms.find((r) => r.roomNumber === roomNumber);
        if (!room) {
            throw new Error("Room doesnt exist");
        }
        else if (room.isOccupied) {
            throw new Error("Room is already occupied");
        }
        const newResident = {
            id: Date.now().toString(),
            name: name,
            age: age,
            phone: phone,
            roomNumber: roomNumber,
            checkInDate: checkInDate,
        };
        this.resident.push(newResident);
        room.isOccupied = true;
        this.saveData();
        console.log(this.rooms);
        console.log(this.resident);
    }
    // ! Deleting Resident
    removeResident(residentID) {
        const index = this.resident.findIndex((r) => r.id === residentID);
        if (index == -1) {
            throw new Error("Resident ID doesnt exist");
        }
        const resident = this.resident[index];
        const room = this.rooms.find((r) => r.roomNumber == resident.roomNumber);
        if (!room) {
            throw new Error("room doesnt exist");
        }
        room.isOccupied = false;
        this.resident.splice(index, 1);
        this.saveData();
        console.log("deleted succesfully");
    }
    //updating a resident
    updateResident(residentID, name, age, phone, roomNumber, checkInDate) {
        const index = this.resident.findIndex((r) => r.id === residentID);
        if (index === -1) {
            throw new Error("Resident ID does not exist");
        }
        const resident = this.resident[index];
        // If room changed
        if (resident.roomNumber !== roomNumber) {
            const oldRoom = this.rooms.find((r) => r.roomNumber === resident.roomNumber);
            const newRoom = this.rooms.find((r) => r.roomNumber === roomNumber);
            if (!newRoom)
                throw new Error("New room does not exist");
            if (newRoom.isOccupied)
                throw new Error("New room already occupied");
            if (oldRoom)
                oldRoom.isOccupied = false;
            newRoom.isOccupied = true;
            resident.roomNumber = roomNumber;
        }
        resident.name = name;
        resident.age = age;
        resident.phone = phone;
        resident.checkInDate = checkInDate;
        this.saveData();
    }
    // ! get vacant rooms
    getVacantRooms() {
        return this.rooms.filter((r) => !r.isOccupied);
    }
    // ! Get Occupied rooms
    getOccupiedRooms() {
        return this.rooms.filter((r) => r.isOccupied);
    }
    // !  Rooms States
    getRoomStates() {
        const total = this.rooms.length;
        const occupied = this.getOccupiedRooms().length;
        const vacant = total - occupied;
        return { total, occupied, vacant };
    }
}
