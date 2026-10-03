/* =========================================================
   STUDENTHUB - STUDENT MANAGEMENT SYSTEM
   ========================================================= */


/* ================= DEFAULT DATA ================= */

const defaultStudents = [
    {
        name: "Rahul Sharma",
        studentId: "STU001",
        course: "BCA",
        email: "rahul.sharma@example.com",
        status: "Active"
    },

    {
        name: "Priya Reddy",
        studentId: "STU002",
        course: "B.Tech",
        email: "priya.reddy@example.com",
        status: "Active"
    },

    {
        name: "Arjun Kumar",
        studentId: "STU003",
        course: "MCA",
        email: "arjun.kumar@example.com",
        status: "Inactive"
    },

    {
        name: "Sneha Rao",
        studentId: "STU004",
        course: "MBA",
        email: "sneha.rao@example.com",
        status: "Active"
    },

    {
        name: "Vikram Singh",
        studentId: "STU005",
        course: "BCA",
        email: "vikram.singh@example.com",
        status: "Active"
    },

    {
        name: "Ananya Patel",
        studentId: "STU006",
        course: "B.Tech",
        email: "ananya.patel@example.com",
        status: "Active"
    }
];


/* ================= LOCAL STORAGE ================= */

const STORAGE_KEY = "studentHubData";

let students = [];

const storedData = localStorage.getItem(STORAGE_KEY);

if (storedData) {

    try {

        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
            students = parsedData;
        } else {
            students = [...defaultStudents];
        }

    } catch (error) {

        students = [...defaultStudents];

    }

} else {

    students = [...defaultStudents];

}


/* ================= DOM ELEMENTS ================= */

const studentModal =
    document.getElementById("studentModal");

const studentForm =
    document.getElementById("studentForm");

const editIndex =
    document.getElementById("editIndex");

const modalTitle =
    document.getElementById("modalTitle");

const saveButtonText =
    document.getElementById("saveButtonText");

const studentTableBody =
    document.getElementById("studentTableBody");

const emptyState =
    document.getElementById("emptyState");

const globalSearch =
    document.getElementById("globalSearch");

const studentSearch =
    document.getElementById("studentSearch");

const courseFilter =
    document.getElementById("courseFilter");

const statusFilter =
    document.getElementById("statusFilter");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const toastTitle =
    document.getElementById("toastTitle");


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
    );

}


/* ================= GET INITIALS ================= */

function getInitials(name) {

    if (!name) {
        return "ST";
    }

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


/* ================= SHOW TOAST ================= */

let toastTimer;

function showToast(
    message,
    title = "Success"
) {

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}


/* ================= CLOSE TOAST ================= */

document
    .getElementById("closeToast")
    .addEventListener("click", () => {

        toast.classList.remove("show");

    });


/* ================= DISPLAY STUDENTS ================= */

function displayStudents() {

    const searchValue =
        studentSearch.value
            .trim()
            .toLowerCase();

    const courseValue =
        courseFilter.value;

    const statusValue =
        statusFilter.value;


    const filteredStudents =
        students.filter((student) => {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(searchValue) ||

                student.studentId
                    .toLowerCase()
                    .includes(searchValue) ||

                student.email
                    .toLowerCase()
                    .includes(searchValue);


            const matchesCourse =
                courseValue === "all" ||
                student.course === courseValue;


            const matchesStatus =
                statusValue === "all" ||
                student.status === statusValue;


            return (
                matchesSearch &&
                matchesCourse &&
                matchesStatus
            );

        });


    studentTableBody.innerHTML = "";


    if (filteredStudents.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";


        filteredStudents.forEach((student) => {

            const realIndex =
                students.indexOf(student);


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="student-cell">

                        <div class="student-avatar">
                            ${getInitials(student.name)}
                        </div>

                        <div>
                            <div class="student-name">
                                ${escapeHTML(student.name)}
                            </div>

                            <div class="student-email">
                                ${escapeHTML(student.email)}
                            </div>
                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHTML(student.studentId)}
                </td>


                <td>
                    ${escapeHTML(student.course)}
                </td>


                <td>
                    ${escapeHTML(student.email)}
                </td>


                <td>

                    <span
                        class="status-badge ${
                            student.status === "Active"
                                ? "active"
                                : "inactive"
                        }"
                    >
                        ${escapeHTML(student.status)}
                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="action-button"
                            title="Edit"
                            onclick="editStudent(${realIndex})"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>


                        <button
                            type="button"
                            class="action-button delete"
                            title="Delete"
                            onclick="deleteStudent(${realIndex})"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            `;


            studentTableBody.appendChild(row);

        });

    }


    document.getElementById("tableCount").textContent =
        `Showing ${filteredStudents.length} of ${students.length} students`;

}


/* ================= HTML ESCAPE ================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ================= UPDATE DASHBOARD ================= */

function updateDashboard() {

    const total =
        students.length;


    const active =
        students.filter(
            student => student.status === "Active"
        ).length;


    const inactive =
        students.filter(
            student => student.status === "Inactive"
        ).length;


    const courses =
        [...new Set(
            students.map(student => student.course)
        )];


    document.getElementById("totalStudents")
        .textContent = total;


    document.getElementById("activeStudents")
        .textContent = active;


    document.getElementById("inactiveStudents")
        .textContent = inactive;


    document.getElementById("totalCourses")
        .textContent = courses.length;


    document.getElementById("chartTotal")
        .textContent = total;


    document.getElementById("chartActive")
        .textContent = active;


    document.getElementById("chartInactive")
        .textContent = inactive;


    document.getElementById("chartCourses")
        .textContent = courses.length;


    document.getElementById("studentGrowth")
        .textContent =
        `${active} active student${active === 1 ? "" : "s"}`;


    updateDonut(active, inactive);

}


/* ================= DONUT ================= */

function updateDonut(active, inactive) {

    const donut =
        document.querySelector(".donut-chart");


    const total =
        active + inactive;


    if (total === 0) {

        donut.style.background =
            "#e9eaf0";

        return;

    }


    const activeDegree =
        (active / total) * 360;


    donut.style.background =
        `conic-gradient(
            var(--primary) 0deg,
            var(--primary) ${activeDegree}deg,
            #e9eaf0 ${activeDegree}deg,
            #e9eaf0 360deg
        )`;

}


/* ================= COURSE STATS ================= */

function updateCourseStats() {

    const courseList =
        document.getElementById("courseList");


    courseList.innerHTML = "";


    const courseCounts = {};


    students.forEach((student) => {

        if (!courseCounts[student.course]) {
            courseCounts[student.course] = 0;
        }

        courseCounts[student.course]++;

    });


    const sortedCourses =
        Object.entries(courseCounts)
            .sort((a, b) => b[1] - a[1]);


    const total =
        students.length;


    if (sortedCourses.length === 0) {

        courseList.innerHTML = `
            <div style="
                padding:25px;
                text-align:center;
                color:#999;
                font-size:10px;
            ">
                No course data available
            </div>
        `;

        return;

    }


    sortedCourses.forEach(
        ([course, count]) => {

            const percentage =
                total === 0
                    ? 0
                    : (count / total) * 100;


            const row =
                document.createElement("div");

            row.className =
                "course-row";


            row.innerHTML = `

                <div class="course-code">
                    ${escapeHTML(course)}
                </div>


                <div>

                    <div class="course-name">
                        ${escapeHTML(course)}
                    </div>

                    <div class="course-bar">

                        <div
                            class="course-bar-fill"
                            style="width:${percentage}%"
                        ></div>

                    </div>

                </div>


                <div class="course-count">
                    ${count}
                </div>

            `;


            courseList.appendChild(row);

        }
    );

}


/* ================= OPEN MODAL ================= */

function openModal(index = null) {

    studentForm.reset();

    editIndex.value = "";


    if (index === null) {

        modalTitle.textContent =
            "Add New Student";

        saveButtonText.textContent =
            "Save Student";

        document.getElementById("status").value =
            "Active";

    } else {

        const student =
            students[index];


        if (!student) {
            return;
        }


        modalTitle.textContent =
            "Edit Student";

        saveButtonText.textContent =
            "Update Student";


        document.getElementById("name").value =
            student.name;

        document.getElementById("studentId").value =
            student.studentId;

        document.getElementById("course").value =
            student.course;

        document.getElementById("email").value =
            student.email;

        document.getElementById("status").value =
            student.status;


        editIndex.value =
            index;

    }


    studentModal.classList.add("show");


    setTimeout(() => {

        document.getElementById("name").focus();

    }, 100);

}


/* ================= CLOSE MODAL ================= */

function closeModal() {

    studentModal.classList.remove("show");

    studentForm.reset();

    editIndex.value = "";

}


/* ================= ADD STUDENT BUTTON ================= */

document
    .getElementById("addStudentBtn")
    .addEventListener(
        "click",
        () => openModal()
    );


document
    .getElementById("quickAddBtn")
    .addEventListener(
        "click",
        () => openModal()
    );


/* ================= CLOSE BUTTONS ================= */

document
    .getElementById("closeModalBtn")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelBtn")
    .addEventListener(
        "click",
        closeModal
    );


/* ================= CLICK OUTSIDE MODAL ================= */

studentModal.addEventListener(
    "click",
    function (event) {

        if (event.target === studentModal) {
            closeModal();
        }

    }
);


/* ================= ESCAPE KEY ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            studentModal.classList.contains("show")
        ) {
            closeModal();
        }

    }
);


/* =========================================================
   SAVE STUDENT
   THIS IS THE IMPORTANT PART
   ========================================================= */

studentForm.addEventListener(
    "submit",
    function (event) {

        /*
         * Stop browser from refreshing the page.
         */
        event.preventDefault();


        /* Get values */

        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const studentId =
            document
                .getElementById("studentId")
                .value
                .trim();


        const course =
            document
                .getElementById("course")
                .value;


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const status =
            document
                .getElementById("status")
                .value;


        /* Validation */

        if (
            name === "" ||
            studentId === "" ||
            course === "" ||
            email === ""
        ) {

            showToast(
                "Please fill all the fields.",
                "Missing Information"
            );

            return;

        }


        /* Email validation */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            showToast(
                "Please enter a valid email address.",
                "Invalid Email"
            );

            return;

        }


        /* Student data */

        const studentData = {

            name: name,

            studentId: studentId,

            course: course,

            email: email,

            status: status

        };


        /* Check edit or add */

        if (editIndex.value !== "") {

            const index =
                Number(editIndex.value);


            students[index] =
                studentData;


            saveData();


            displayStudents();

            updateDashboard();

            updateCourseStats();


            closeModal();


            showToast(
                "Student updated successfully!"
            );


        } else {

            /* Add new student */

            students.push(studentData);


            /* Save to localStorage */

            saveData();


            /* Update UI */

            displayStudents();

            updateDashboard();

            updateCourseStats();


            /* Close modal */

            closeModal();


            /* Success message */

            showToast(
                "Student saved successfully!"
            );

        }

    }
);


/* ================= EDIT STUDENT ================= */

function editStudent(index) {

    openModal(index);

}


/* ================= DELETE STUDENT ================= */

function deleteStudent(index) {

    const student =
        students[index];


    if (!student) {
        return;
    }


    const confirmed =
        confirm(
            `Delete ${student.name} from the student records?`
        );


    if (!confirmed) {
        return;
    }


    students.splice(index, 1);


    saveData();


    displayStudents();

    updateDashboard();

    updateCourseStats();


    showToast(
        "Student deleted successfully!"
    );

}


/* ================= SEARCH ================= */

studentSearch.addEventListener(
    "input",
    displayStudents
);


courseFilter.addEventListener(
    "change",
    displayStudents
);


statusFilter.addEventListener(
    "change",
    displayStudents
);


/* ================= GLOBAL SEARCH ================= */

globalSearch.addEventListener(
    "input",
    function () {

        studentSearch.value =
            globalSearch.value;

        displayStudents();

        document
            .getElementById("students")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* ================= SEARCH BUTTON ================= */

document
    .getElementById("quickSearchBtn")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("students")
                .scrollIntoView({
                    behavior: "smooth"
                });


            setTimeout(() => {

                studentSearch.focus();

            }, 500);

        }
    );


/* ================= VIEW ALL ================= */

document
    .getElementById("viewAllBtn")
    .addEventListener(
        "click",
        function () {

            studentSearch.value = "";
            globalSearch.value = "";
            courseFilter.value = "all";
            statusFilter.value = "all";

            displayStudents();

        }
    );


/* ================= REFRESH COURSE ================= */

document
    .getElementById("refreshCourses")
    .addEventListener(
        "click",
        function () {

            updateCourseStats();

            showToast(
                "Course statistics refreshed."
            );

        }
    );


/* ================= CSV REPORT ================= */

function generateReport() {

    if (students.length === 0) {

        showToast(
            "There are no students to export.",
            "No Data"
        );

        return;

    }


    const headers = [
        "Name",
        "Student ID",
        "Course",
        "Email",
        "Status"
    ];


    const rows =
        students.map(student => [

            student.name,

            student.studentId,

            student.course,

            student.email,

            student.status

        ]);


    const csvContent = [

        headers,

        ...rows

    ]
        .map(row =>
            row
                .map(value =>
                    `"${String(value).replaceAll('"', '""')}"`
                )
                .join(",")
        )
        .join("\n");


    const blob =
        new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "studenthub-report.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);


    showToast(
        "Student report downloaded."
    );

}


/* ================= REPORT BUTTONS ================= */

document
    .getElementById("quickReportBtn")
    .addEventListener(
        "click",
        generateReport
    );


document
    .getElementById("reportsNav")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            generateReport();

        }
    );


/* ================= INITIAL LOAD ================= */

displayStudents();

updateDashboard();

updateCourseStats();


/* ================= PREVENT OLD AUTOFILL ================= */

document
    .getElementById("name")
    .setAttribute(
        "autocomplete",
        "new-password"
    );


document
    .getElementById("email")
    .setAttribute(
        "autocomplete",
        "new-password"
    );


/* ================= CONSOLE CHECK ================= */

console.log(
    "StudentHub loaded successfully."
);

console.log(
    "Students:",
    students
);