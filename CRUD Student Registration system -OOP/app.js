class Student {
    constructor(firstName, lastName, roll, studentClass, mobileNo, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.roll = roll;
        this.studentClass = studentClass;
        this.mobileNo = mobileNo;
        this.email = email;
    }

    toJSON() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            roll: this.roll,
            studentClass: this.studentClass,
            mobileNo: this.mobileNo,
            email: this.email
        };
    }
}

// Register a new student
document.getElementById('studentForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const roll = document.getElementById('roll').value;
    const studentClass = document.getElementById('class').value;
    const mobileNo = document.getElementById('mobileNo').value;
    const email = document.getElementById('email').value;

    const student = new Student(firstName, lastName, roll, studentClass, mobileNo, email);

    // Save to localStorage
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(student.toJSON());
    localStorage.setItem('students', JSON.stringify(students));

    // Clear the form
    document.getElementById('studentForm').reset();
});

// Fetch data from localStorage and display in the table
function fetchStudents() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentTableBody = document.getElementById('studentTableBody');
    studentTableBody.innerHTML = ''; // Clear table before re-rendering

    students.forEach((studentData, index) => {
        const student = new Student(studentData.firstName, studentData.lastName, studentData.roll, studentData.studentClass, studentData.mobileNo, studentData.email);
        const row = `
    <tr>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.roll}</td>
        <td>${student.studentClass}</td>
        <td>${student.mobileNo}</td>
        <td>${student.email}</td>
        <td>
            <button class="btn btn-danger" onclick="deleteStudent(${index})">
                <i class="fas fa-trash"></i> Delete
            </button>
            <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateStudentModal" onclick="openUpdateModal(${index})">
                <i class="fas fa-edit"></i> Update
            </button>
        </td>
    </tr>
`;

        studentTableBody.innerHTML += row;
    });
}

// Delete a student by index
function deleteStudent(index) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    fetchStudents(); // Refresh table
}

// Open update modal
function openUpdateModal(index) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Fill the modal form with student data
    document.getElementById('updateIndex').value = index;
    document.getElementById('updateFirstName').value = student.firstName;
    document.getElementById('updateLastName').value = student.lastName;
    document.getElementById('updateRoll').value = student.roll;
    document.getElementById('updateClass').value = student.studentClass;
    document.getElementById('updateMobileNo').value = student.mobileNo;
    document.getElementById('updateEmail').value = student.email;

    // Handle the update form submission
    document.getElementById('updateForm').onsubmit = function (e) {
        e.preventDefault();
        updateStudent(index);
    };
}

// Update a student's details
function updateStudent(index) {
    let students = JSON.parse(localStorage.getItem('students')) || [];

    const firstName = document.getElementById('updateFirstName').value;
    const lastName = document.getElementById('updateLastName').value;
    const roll = document.getElementById('updateRoll').value;
    const studentClass = document.getElementById('updateClass').value;
    const mobileNo = document.getElementById('updateMobileNo').value;
    const email = document.getElementById('updateEmail').value;

    const student = new Student(firstName, lastName, roll, studentClass, mobileNo, email);
    students[index] = student.toJSON(); // Update the student at the specified index
    localStorage.setItem('students', JSON.stringify(students));
    fetchStudents(); // Refresh table

    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('updateStudentModal'));
    modal.hide();
}

// On page load, fetch students
window.onload = function () {
    fetchStudents();
};
