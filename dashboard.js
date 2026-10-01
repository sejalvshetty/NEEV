// API

const API_URL =
    "https://sai9.tech/api/public/impact-stats";


//global data

let dashboardData = null;


// helper functions



function formatNumber(value) {

    return Number(value || 0).toLocaleString("en-IN");

}


function clampPercentage(value) {

    return Math.min(
        Math.max(Number(value) || 0, 0),
        100
    );

}


// loading state

function showLoadingState() {

    document.querySelectorAll(".stat-content h3")
        .forEach(element => {
            element.textContent = "…";
        });

}


// error state

function showErrorState(error) {

    console.error(
        "NEEV Dashboard API Error:",
        error
    );


    const headerStatus =
        document.querySelector(".header-status");


    if (headerStatus) {

        headerStatus.innerHTML = `
            <span
                class="status-dot"
                style="background:#fca5a5;">
            </span>

            <span>
                Unable to load live data
            </span>
        `;

    }

}


// FETCH LIVE DATA
async function fetchDashboardData() {

    try {

        showLoadingState();


        const response =
            await fetch(API_URL, {

                method: "GET",

                headers: {
                    "Accept": "application/json"
                }

            });


  

        if (!response.ok) {

            throw new Error(
                `API request failed: ${response.status}`
            );

        }


       
        const result =
            await response.json();


      

        if (!result.success) {

            throw new Error(
                result.message ||
                "API returned an unsuccessful response."
            );

        }


        dashboardData =
            result.data;



        initializeDashboard();



        updateLiveStatus();


    }

    catch (error) {

        showErrorState(error);

    }

}


//live status

function updateLiveStatus() {

    const headerStatus =
        document.querySelector(
            ".header-status"
        );


    if (!headerStatus) {
        return;
    }


    headerStatus.innerHTML = `

        <span
            class="status-dot">
        </span>

        <span>
            Live Statistics
        </span>

    `;

}


// overview

function renderOverview() {

    const overview =
        dashboardData.overview;


    document.getElementById(
        "totalSevaHours"
    ).textContent =
        formatNumber(
            overview.total_seva_hours_logged
        );


    document.getElementById(
        "registeredVolunteers"
    ).textContent =
        formatNumber(
            overview.total_registered_volunteers
        );


    document.getElementById(
        "activeVolunteers"
    ).textContent =
        formatNumber(
            overview.active_volunteers_count
        );


    document.getElementById(
        "engagementRate"
    ).textContent =
        `${overview.volunteer_engagement_rate_percent}% engagement`;


    document.getElementById(
        "activitiesCompleted"
    ).textContent =
        formatNumber(
            overview.total_activities_completed
        );

}


/* =====================================================
   EVENTS
===================================================== */

function renderEvents() {

    const events =
        dashboardData.events;


    const conducted =
        Number(
            events.total_events_conducted
        ) || 0;


    const scheduled =
        Number(
            events.total_events_scheduled
        ) || 0;


    const completionPercentage =
        scheduled > 0
            ? (conducted / scheduled) * 100
            : 0;


    document.getElementById(
        "eventsConducted"
    ).textContent =
        `${conducted} / ${scheduled}`;


    document.getElementById(
        "eventProgress"
    ).style.width =
        `${clampPercentage(
            completionPercentage
        )}%`;


    document.getElementById(
        "eventsScheduled"
    ).textContent =
        formatNumber(
            events.total_events_scheduled
        );


    document.getElementById(
        "publishedEvents"
    ).textContent =
        formatNumber(
            events.active_published_events
        );


    document.getElementById(
        "totalRegistrations"
    ).textContent =
        formatNumber(
            events.total_event_registrations
        );


    document.getElementById(
        "totalAttendance"
    ).textContent =
        formatNumber(
            events.total_volunteer_attendances
        );

}


// tasks

function renderTasks() {

    const tasks =
        dashboardData.tasks;


    const completion =
        Number(
            tasks.task_completion_rate_percent
        ) || 0;


    document.getElementById(
        "taskCompletionRate"
    ).textContent =
        `${completion}%`;


    document.getElementById(
        "taskProgress"
    ).style.width =
        `${clampPercentage(
            completion
        )}%`;


    document.getElementById(
        "assignedTasks"
    ).textContent =
        formatNumber(
            tasks.total_tasks_assigned
        );


    document.getElementById(
        "completedTasks"
    ).textContent =
        formatNumber(
            tasks.total_tasks_completed
        );

}


// categories

function renderCategories() {

    const container =
        document.getElementById(
            "categoryCards"
        );


    container.innerHTML = "";


    dashboardData.impact_by_category
        .forEach(category => {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "category-card";


            card.innerHTML = `

                <h3>
                    ${category.category}
                </h3>

                <div class="category-main">

                    ${formatNumber(
                        category.hours_logged
                    )}

                    <span
                        style="font-size:14px;">
                        hrs
                    </span>

                </div>


                <div class="category-details">

                    <div class="category-detail">

                        <span>
                            Events
                        </span>

                        <strong>
                            ${formatNumber(
                                category.events_count
                            )}
                        </strong>

                    </div>


                    <div class="category-detail">

                        <span>
                            Participants
                        </span>

                        <strong>
                            ${formatNumber(
                                category.volunteer_participations
                            )}
                        </strong>

                    </div>

                </div>

            `;


            container.appendChild(card);

        });

}


// certificates & recognition

function renderRecognition() {

    const recognition =
        dashboardData
            .certificates_and_recognition;


    document.getElementById(
        "totalCertificates"
    ).textContent =
        formatNumber(
            recognition.total_certificates_awarded
        );


    document.getElementById(
        "eventCertificates"
    ).textContent =
        formatNumber(
            recognition.event_certificates
        );


    document.getElementById(
        "taskCertificates"
    ).textContent =
        formatNumber(
            recognition.task_certificates
        );


    document.getElementById(
        "totalBadges"
    ).textContent =
        formatNumber(
            recognition
                .total_badges_earned_by_volunteers
        );

}


// volunteer ranks

function renderRanks() {

    const container =
        document.getElementById(
            "rankCards"
        );


    container.innerHTML = "";


    dashboardData
        .volunteer_rank_distribution
        .forEach(rank => {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "rank-card";


            card.style.setProperty(
                "--rank-color",
                rank.color_hex
            );


            card.innerHTML = `

                <p class="panel-label">
                    MINIMUM HOURS
                </p>


                <h3>
                    ${rank.rank_name}
                </h3>


                <div class="rank-count">

                    ${formatNumber(
                        rank.volunteer_count
                    )}

                </div>


                <div class="rank-requirement">

                    ${formatNumber(
                        rank.min_hours
                    )}
                    seva hours required

                </div>

            `;


            container.appendChild(card);

        });

}


/* =====================================================
   CATEGORY CHART
===================================================== */

function createCategoryChart() {

    const categories =
        dashboardData
            .impact_by_category;


    const labels =
        categories.map(
            item => item.category
        );


    const hours =
        categories.map(
            item => item.hours_logged
        );


    const canvas =
        document.getElementById(
            "categoryChart"
        );


    new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels: labels,

                datasets: [

                    {

                        data: hours,

                        backgroundColor: [

                            "#4F46E5",
                            "#8B5CF6",
                            "#EC4899",
                            "#06B6D4",
                            "#10B981",
                            "#F59E0B"

                        ],

                        borderWidth: 0

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "68%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            padding: 18,

                            usePointStyle: true,

                            font: {
                                size: 12
                            }

                        }

                    }

                }

            }

        }

    );

}


// participation chart

function createParticipationChart() {

    const categories =
        dashboardData
            .impact_by_category;


    const labels =
        categories.map(
            item => item.category
        );


    const participation =
        categories.map(
            item =>
                item.volunteer_participations
        );


    const canvas =
        document.getElementById(
            "participationChart"
        );


    new Chart(
        canvas,
        {

            type: "bar",

            data: {

                labels: labels,

                datasets: [

                    {

                        label:
                            "Volunteer Participation",

                        data:
                            participation,

                        backgroundColor:
                            "#6C63A8",

                        borderRadius: 7,

                        borderSkipped: false

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            precision: 0
                        }

                    },

                    x: {

                        grid: {
                            display: false
                        }

                    }

                }

            }

        }

    );

}


// initialize the dashboard

function initializeDashboard() {

    renderOverview();

    renderEvents();

    renderTasks();

    renderCategories();

    renderRecognition();

    renderRanks();

    createCategoryChart();

    createParticipationChart();

}


document.addEventListener(
    "DOMContentLoaded",
    fetchDashboardData
);