let url = "http://localhost:3001/jobs";

var modal = document.querySelector("#myModal"); // Container för popup

// Funktion för att hämta data från API
async function getData() {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    iterateData(data);
}

getData();

// Funktion för att skriva ut data till DOM
async function iterateData(data) {
    const joblistContainer = document.querySelector(".joblist");

    data.forEach((job) => {
        // Kontrollera om startdate är mer än 10 tecknen
        const shortenedStartdate =
            job.startdate.length > 10
                ? job.startdate.substring(0, 10)
                : job.startdate;
        // Kontrollera att enddate är av typen string och innehåller mer än 10 tecknen
        const shortenedEnddate =
            typeof job.enddate === "string" && job.enddate.length > 10
                ? job.enddate.substring(0, 10)
                : job.enddate;

        if (job.enddate != null) {
            joblistContainer.innerHTML += `<div class="job"><div><h3>${job.jobtitle} @ </h3>
        <h3>${job.company}</h3>
        <h4>${shortenedStartdate} - ${shortenedEnddate}</h4>
        <p>${job.description}</p>
        <button class="deleteBtn" data-id="${job._id}">Radera</button>
        </div></div>
        `;
        } else {
            joblistContainer.innerHTML += `<div class="job"><div><h3>${job.jobtitle} @ </h3>
            <h3>${job.company}</h3>
            <h4>${shortenedStartdate} - Pågående</h4>
            <p>${job.description}</p>
            <button class="deleteBtn" data-id="${job._id}">Radera</button></div></div>`;
        }
    });

    // Lägg till händelselyssnare för raderaknappar
    const deleteBtns = document.querySelectorAll(".deleteBtn");
    deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", async (e) => {
            const jobId = e.target.getAttribute("data-id");
            const jobElement = e.target.closest(".job");
            deleteJob(jobId, jobElement);
        });
    });
}

// Hämta formulärfältens element
const form = document.querySelector(".form");
const companyNameInput = document.querySelector("#company");
const jobtitleInput = document.querySelector("#jobtitle");
const locationInput = document.querySelector("#location");
const startdateInput = document.querySelector("#startdate");
const enddateInput = document.querySelector("#enddate");
const descriptionInput = document.querySelector("#description");
const ongoingCheckbox = document.querySelector("#ongoing");

// Eventlyssnare vid submit av formulär som skapar objekt och skickar till API
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Hämta värdena från formulärfälten
    const companyName = companyNameInput.value;
    const jobtitle = jobtitleInput.value;
    const location = locationInput.value;
    const startdate = startdateInput.value;
    const enddate = enddateInput.value;
    const description = descriptionInput.value;

    // Skapa en payload baserat på formulärvärdena
    const workExperience = {
        company: companyName,
        jobtitle: jobtitle,
        location: location,
        startdate: startdate,
        enddate: enddate,
        description: description,
    };

    console.log(workExperience);

    // Om "Pågående" är markerad, sätt enddate till null
    if (ongoingCheckbox.checked) {
        workExperience.enddate = null;
        ongoingCheckbox.checked = false;
    }

    try {
        // Skicka POST-förfrågan till API:et med den skapade payloaden
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(workExperience),
        });

        const data = await response.json();
        console.log(data);

        iterateData([data]);
    } catch (error) {
        console.error("Error:", error);
    }

    companyNameInput.value = "";
    jobtitleInput.value = "";
    locationInput.value = "";
    startdateInput.value = "";
    enddateInput.value = "";
    descriptionInput.value = "";

    modal.style.display = "none";
});

// Funktion för att radera jobb från API
async function deleteJob(id, jobElement) {
    // Skicka DELETE-förfrågan till API:et med objektets id
    const response = await fetch(url + "/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error("Unable to delete job");
        return;
    }

    // Ta bort det aktuella jobberfarenhetsobjektet från DOM
    jobElement.parentNode.removeChild(jobElement);
}

// Ladda in DOM innan JS körs
document.addEventListener("DOMContentLoaded", function () {
    let btn = document.querySelector("#myBtn"); // Knapp för att öppna popup
    let closeBtn = document.querySelector(".close"); // Kryss för att stänga popup
    
    // Hämta formulärfältens felmeddelande-element
    const companyError = document.querySelector("#companyError");
    const jobtitleError = document.querySelector("#jobtitleError");
    const locationError = document.querySelector("#locationError");
    const startdateError = document.querySelector("#startdateError");
    const submitBtn = document.querySelector(".button");

    // Kontrollera att modal, btn och span har validerats innan de används
    if (modal && btn && closeBtn) {
        // WÖppna popup när användare trycker på knappen för "lägg till jobb"
        btn.onclick = function () {
            modal.style.display = "block";
        };
        // Stäng popup när användaren trycker på kryss
        closeBtn.onclick = function () {
            modal.style.display = "none";
        };
        // Stäng popup när användaren trycker utanför popupfönstret
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }
});
