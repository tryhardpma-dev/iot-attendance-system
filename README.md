# IoT Student Attendance System 🎓📡

An automated, end-to-end IoT solution designed to streamline student attendance tracking using RFID technology, a Raspberry Pi Pico edge device, and a modern web stack.

## 🌟 Overview
This project bridges the gap between physical hardware and cloud-based data management. It replaces manual attendance marking with a seamless "tap-and-go" system, ensuring data integrity and real-time reporting for educational institutions.

## 🚀 Key Features
- **RFID Authentication:** Instant student identification via RC522 RFID reader.
- **Edge Computing:** Hardware logic handled by Raspberry Pi Pico for low-latency data capture.
- **Real-time Dashboard:** A responsive React interface for administrators to monitor attendance live.
- **Relational Data Integrity:** Robust PostgreSQL schema to manage complex relationships between students, classes, and logs.
- **Secure API:** Express.js backend managing data flow and hardware-to-server communication.

## 🛠 Tech Stack
- **Hardware:** Raspberry Pi Pico (MicroPython/C++), RC522 RFID Module.
- **Frontend:** React.js, CSS3 (Responsive Design).
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL.
- **Communication:** HTTP REST API (planned migration to MQTT for industrial scalability).

## 🏗 System Architecture
1. **Edge Level:** Raspberry Pi Pico reads the RFID UID from the student card.
2. **Transport Level:** The hardware sends a POST request with the UID to the Express.js server.
3. **Server Level:** The API validates the student in the PostgreSQL database and logs the timestamp.


## 🔧 Installation & Setup

### Hardware Setup
1. Connect the RC522 to the Raspberry Pi Pico via SPI pins.
2. Flash the firmware located in the `/firmware` directory.

