import { hostelService } from "../service/hostelService.js";

export class UI {
  private form: HTMLFormElement;
  private tableBody: HTMLTableSectionElement;
  private statsDiv: HTMLDivElement;
  private roomSelect: HTMLSelectElement;
  private editResidentId: string | null = null;
  // private editResidentId: string | null = null;
  constructor(private service: hostelService) {
    this.form = document.getElementById("residentForm") as HTMLFormElement;
    this.tableBody = document.getElementById(
      "residentTableBody",
    ) as HTMLTableSectionElement;
    this.statsDiv = document.getElementById("stats") as HTMLDivElement;
    this.roomSelect = document.getElementById(
      "roomNumber",
    ) as HTMLSelectElement;

    this.init();
  }

  private init(): void {
    this.populateRoomDropdownForEdit();
    this.renderResidents();
    this.renderStats();
    this.handleFormSubmit();
    this.handleDelete();
    this.handleEdit();
  }

  // Populate only vacant rooms
private populateRoomDropdownForEdit(currentRoom?: number): void {
  this.roomSelect.innerHTML = "";

  const vacantRooms = this.service.getVacantRooms();
  let roomsToShow = [...vacantRooms];

  if (currentRoom) {
    const room = this.service.getRooms.find(
      (r) => r.roomNumber === currentRoom
    );

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

  private renderResidents(): void {
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

  private renderStats(): void {
    const stats = this.service.getRoomStates();

    this.statsDiv.innerHTML = `
      <p>Total Rooms: ${stats.total}</p>
      <p>Occupied Rooms: ${stats.occupied}</p>
      <p>Vacant Rooms: ${stats.vacant}</p>
    `;
  }

  private handleFormSubmit(): void {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = (document.getElementById("name") as HTMLInputElement).value;
      const age = Number(
        (document.getElementById("age") as HTMLInputElement).value,
      );
      const phone = (document.getElementById("phone") as HTMLInputElement)
        .value;
      const roomNumber = Number(this.roomSelect.value);
      const checkInDate = (
        document.getElementById("checkInDate") as HTMLInputElement
      ).value;

      try {
  if (this.editResidentId) {
    this.service.updateResident(
      this.editResidentId,
      name,
      age,
      phone,
      roomNumber,
      checkInDate
    );

    this.editResidentId = null;
  } else {
    this.service.addResident(
      name,
      age,
      phone,
      roomNumber,
      checkInDate
    );
  }

  this.renderResidents();
  this.renderStats();
  this.populateRoomDropdownForEdit();
  this.form.reset();
} catch (error: any) {
  alert(error.message);
}
    });
  }

  private handleDelete(): void {
    this.tableBody.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

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
  private handleEdit(): void {
  this.tableBody.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains("editBtn")) {
      const id = target.getAttribute("data-id");
      if (!id) return;

      const resident = this.service.getResidents.find(
        (r) => r.id === id
      );

      if (!resident) return;

      // Fill form fields
      (document.getElementById("name") as HTMLInputElement).value =
        resident.name;

      (document.getElementById("age") as HTMLInputElement).value =
        resident.age.toString();

      (document.getElementById("phone") as HTMLInputElement).value =
        resident.phone;

      (document.getElementById("checkInDate") as HTMLInputElement).value =
        resident.checkInDate;

      // IMPORTANT: Repopulate dropdown including current room
      this.populateRoomDropdownForEdit(resident.roomNumber);

      this.editResidentId = id;
    }
  });
}
}
