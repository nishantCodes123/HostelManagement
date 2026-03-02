export class UI {
    // private editResidentId: string | null = null;
    constructor(service) {
        this.service = service;
        this.editResidentId = null;
        this.form = document.getElementById("residentForm");
        this.tableBody = document.getElementById("residentTableBody");
        this.statsDiv = document.getElementById("stats");
        this.roomSelect = document.getElementById("roomNumber");
        this.init();
    }
    init() {
        this.populateRoomDropdownForEdit();
        this.renderResidents();
        this.renderStats();
        this.handleFormSubmit();
        this.handleDelete();
        this.handleEdit();
    }
    // Populate only vacant rooms
    populateRoomDropdownForEdit(currentRoom) {
        this.roomSelect.innerHTML = "";
        const vacantRooms = this.service.getVacantRooms();
        let roomsToShow = [...vacantRooms];
        if (currentRoom) {
            const room = this.service.getRooms.find((r) => r.roomNumber === currentRoom);
            if (room) {
                roomsToShow.push(room);
            }
        }
        roomsToShow.forEach((room) => {
            const option = document.createElement("option");
            option.value = room.roomNumber.toString();
            option.textContent = `Room ${room.roomNumber}`;
            if (currentRoom && room.roomNumber === currentRoom) {
                option.selected = true;
            }
            this.roomSelect.appendChild(option);
        });
    }
    renderResidents() {
        this.tableBody.innerHTML = "";
        const residents = this.service.getResidents;
        residents.forEach((resident) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${resident.name}</td>
        <td>${resident.age}</td>
        <td>${resident.phone}</td>
        <td>${resident.roomNumber}</td>
        <td>${resident.checkInDate}</td>
        <td>
            <button data-id="${resident.id}" class="editBtn">Edit</button>
            <button data-id="${resident.id}" class="deleteBtn">Delete</button>
        </td>
      `;
            this.tableBody.appendChild(row);
        });
    }
    renderStats() {
        const stats = this.service.getRoomStates();
        this.statsDiv.innerHTML = `
      <p>Total Rooms: ${stats.total}</p>
      <p>Occupied Rooms: ${stats.occupied}</p>
      <p>Vacant Rooms: ${stats.vacant}</p>
    `;
    }
    handleFormSubmit() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.getElementById("name").value;
            const age = Number(document.getElementById("age").value);
            const phone = document.getElementById("phone")
                .value;
            const roomNumber = Number(this.roomSelect.value);
            const checkInDate = document.getElementById("checkInDate").value;
            try {
                if (this.editResidentId) {
                    this.service.updateResident(this.editResidentId, name, age, phone, roomNumber, checkInDate);
                    this.editResidentId = null;
                }
                else {
                    this.service.addResident(name, age, phone, roomNumber, checkInDate);
                }
                this.renderResidents();
                this.renderStats();
                this.populateRoomDropdownForEdit();
                this.form.reset();
            }
            catch (error) {
                alert(error.message);
            }
        });
    }
    handleDelete() {
        this.tableBody.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("deleteBtn")) {
                const id = target.getAttribute("data-id");
                if (id) {
                    this.service.removeResident(id);
                    this.renderResidents();
                    this.renderStats();
                    this.populateRoomDropdownForEdit();
                }
            }
        });
    }
    handleEdit() {
        this.tableBody.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("editBtn")) {
                const id = target.getAttribute("data-id");
                if (!id)
                    return;
                const resident = this.service.getResidents.find((r) => r.id === id);
                if (!resident)
                    return;
                // Fill form fields
                document.getElementById("name").value =
                    resident.name;
                document.getElementById("age").value =
                    resident.age.toString();
                document.getElementById("phone").value =
                    resident.phone;
                document.getElementById("checkInDate").value =
                    resident.checkInDate;
                // IMPORTANT: Repopulate dropdown including current room
                this.populateRoomDropdownForEdit(resident.roomNumber);
                this.editResidentId = id;
            }
        });
    }
}
