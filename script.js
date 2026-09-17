/* ============================================================
   NFL FANTASY DRAFT LEAGUE
   Based on the Excel League Workbook
   ============================================================ */


/* ============================================================
   NFL TEAMS
   ============================================================ */

const divisions = {
    "AFC East": [
        "Buffalo Bills",
        "Miami Dolphins",
        "New England Patriots",
        "New York Jets"
    ],

    "AFC North": [
        "Baltimore Ravens",
        "Cincinnati Bengals",
        "Cleveland Browns",
        "Pittsburgh Steelers"
    ],

    "AFC South": [
        "Houston Texans",
        "Indianapolis Colts",
        "Jacksonville Jaguars",
        "Tennessee Titans"
    ],

    "AFC West": [
        "Denver Broncos",
        "Kansas City Chiefs",
        "Las Vegas Raiders",
        "Los Angeles Chargers"
    ],

    "NFC East": [
        "Dallas Cowboys",
        "New York Giants",
        "Philadelphia Eagles",
        "Washington Commanders"
    ],

    "NFC North": [
        "Chicago Bears",
        "Detroit Lions",
        "Green Bay Packers",
        "Minnesota Vikings"
    ],

    "NFC South": [
        "Atlanta Falcons",
        "Carolina Panthers",
        "New Orleans Saints",
        "Tampa Bay Buccaneers"
    ],

    "NFC West": [
        "Arizona Cardinals",
        "Los Angeles Rams",
        "San Francisco 49ers",
        "Seattle Seahawks"
    ]
};


/* ============================================================
   PLAYERS FROM EXCEL
   ============================================================ */

const defaultPlayers = [
    "Mattson",
    "Chris",
    "Anthony",
    "Jaime",
    "Joey",
    "Brian",
    "Cooper",
    "Erik",
    "Ted",
    "Jenna",
    "Kayla",
    "Phil",
    "Sarah",
    "Matt",
    "Zach",
    "Wilder"
];


/* ============================================================
   SCORING RULES FROM EXCEL
   ============================================================ */

const scoring = {

    offense: {
        passing: [
            { min: 0, max: 100, points: 1 },
            { min: 101, max: 200, points: 2 },
            { min: 201, max: 300, points: 3 },
            { min: 301, max: 400, points: 4 },
            { min: 401, max: Infinity, points: 5 }
        ],

        rushing: [
            { min: 0, max: 100, points: 1 },
            { min: 101, max: 200, points: 2 },
            { min: 201, max: 300, points: 3 },
            { min: 301, max: 400, points: 4 },
            { min: 401, max: Infinity, points: 5 }
        ],

        receptions: [
            { min: 1, max: 10, points: 1 },
            { min: 11, max: 20, points: 2 },
            { min: 21, max: 30, points: 4 },
            { min: 31, max: 40, points: 6 },
            { min: 41, max: 50, points: 8 },
            { min: 51, max: Infinity, points: 10 }
        ],

        fieldGoals: [
            { min: 1, max: 1, points: 1 },
            { min: 2, max: 2, points: 2 },
            { min: 3, max: 3, points: 3 },
            { min: 4, max: 4, points: 4 },
            { min: 5, max: 5, points: 5 },
            { min: 6, max: 6, points: 6 },
            { min: 7, max: Infinity, points: 7 }
        ]
    },

    defense: {
        sacks: 1,
        interceptions: 2,
        forcedFumbles: 1,
        fumbleRecoveries: 1,
        defensiveTouchdowns: 3,
        safeties: 2
    }
};


/* ============================================================
   LEAGUE DATA
   ============================================================ */

let league = JSON.parse(
    localStorage.getItem("nflFantasyLeague")
);

if (!league) {

    league = {

        players: defaultPlayers.map((name, index) => ({
            id: index + 1,
            name: name,
            wins: 0,
            ties: 0,
            losses: 0,
            points: 0,

            division: "",
            offenseA: "",
            offenseB: "",
            defense: "",

            weeklyScores: {}
        })),

        draftOrder: [],

        draft: {
            division: {},
            offenseA: {},
            offenseB: {},
            defense: {}
        },

        schedule: {},

        weeklyScores: {},

        playoffs: {
            selected: [],
            matchups: []
        }
    };

    saveData();
}


/* ============================================================
   SAVE DATA
   ============================================================ */

function saveData() {

    localStorage.setItem(
        "nflFantasyLeague",
        JSON.stringify(league)
    );
}


/* ============================================================
   PAGE NAVIGATION
   ============================================================ */

function showPage(page) {

    switch (page) {

        case "dashboard":
            showDashboard();
            break;

        case "players":
            showPlayers();
            break;

        case "draft":
            showDraft();
            break;

        case "teams":
            showTeams();
            break;

        case "standings":
            showStandings();
            break;

        case "schedule":
            showSchedule();
            break;

        case "weekly":
            showWeekly();
            break;

        case "scoring":
            showScoring();
            break;

        case "playoffs":
            showPlayoffs();
            break;

        case "winnings":
            showWinnings();
            break;

        case "admin":
            showAdmin();
            break;
    }
}


/* ============================================================
   DASHBOARD
   ============================================================ */

function showDashboard() {

    const totalPlayers = league.players.length;

    const drafted = league.players.filter(
        p => p.division &&
             p.offenseA &&
             p.offenseB &&
             p.defense
    ).length;

    const leader = getStandings()[0];

    document.getElementById("app").innerHTML = `

        <div class="page-title">
            <h2>🏠 League Dashboard</h2>
            <p>Your NFL Fantasy Draft League</p>
        </div>

        <div class="grid">

            <div class="card stat-card">
                <div class="stat-label">Players</div>
                <div class="stat-number">
                    ${totalPlayers}
                </div>
                <div class="small">30 player maximum</div>
            </div>

            <div class="card stat-card">
                <div class="stat-label">Entry Fee</div>
                <div class="stat-number">$75</div>
            </div>

            <div class="card stat-card">
                <div class="stat-label">Prize Pool</div>
                <div class="stat-number">$1,200</div>
            </div>

            <div class="card stat-card">
                <div class="stat-label">Players Drafted</div>
                <div class="stat-number">
                    ${drafted}
                </div>
            </div>

        </div>


        <div class="card">

            <h3>🏆 Current Leader</h3>

            ${
                leader
                ? `
                    <h2 style="margin-top:10px;">
                        #1 ${leader.name}
                    </h2>

                    <p>
                        ${leader.wins} Wins |
                        ${leader.ties} Ties |
                        ${leader.losses} Losses |
                        ${leader.points} Points
                    </p>
                `
                : `
                    <p>No standings available yet.</p>
                `
            }

        </div>


        <div class="card">

            <h3>📋 League Format</h3>

            <br>

            <p>• 16 players maximum</p>
            <p>• $75 entry fee</p>
            <p>• Each player drafts one division</p>
            <p>• Each player drafts two offense teams</p>
            <p>• Each player drafts one defense team</p>
            <p>• Division can be selected up to 3 times</p>
            <p>• Offense team can be selected up to 2 times</p>
            <p>• Defense team can only be selected once</p>
            <p>• Weekly head-to-head matchups</p>
            <p>• Standings: Wins → Ties → Losses → Total Points</p>

        </div>
    `;
}


/* ============================================================
   PLAYERS
   ============================================================ */

function showPlayers() {

    let rows = "";

    league.players.forEach((player, index) => {

        rows += `

            <tr>

                <td>${index + 1}</td>

                <td>
                    <strong>${player.name}</strong>
                </td>

                <td>${player.wins}</td>

                <td>${player.ties}</td>

                <td>${player.losses}</td>

                <td>${player.points}</td>

                <td>

                    <button
                        class="btn btn-danger"
                        onclick="removePlayer(${player.id})">

                        Remove

                    </button>

                </td>

            </tr>

        `;
    });


    document.getElementById("app").innerHTML = `

        <div class="page-title">

            <h2>👥 Players</h2>

            <p>
                Add and manage your NFL fantasy league players.
            </p>

        </div>


        <div class="card">

            <h3>➕ Add Player</h3>

            <br>

            <div class="form-group">

                <label>
                    Player Name
                </label>

                <input
                    id="newPlayerName"
                    type="text"
                    placeholder="Enter player name"
                    onkeydown="
                        if(event.key === 'Enter') addPlayer()
                    "
                >

            </div>

            <button
                class="btn btn-success"
                onclick="addPlayer()">

                ➕ Add Player

            </button>

        </div>


        <div class="card">

            <h3>Current Players</h3>

            <br>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>#</th>
                            <th>Player</th>
                            <th>Wins</th>
                            <th>Ties</th>
                            <th>Losses</th>
                            <th>Points</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </div>

    `;
}


/* ============================================================
   ADD PLAYER
   ============================================================ */

function addPlayer() {

    const input =
        document.getElementById("newPlayerName");

    const name =
        input.value.trim();

    if (!name) {

        alert("Please enter a player name.");

        return;
    }

    if (league.players.length >= 30) {

        alert(
            "The league is limited to 30 players."
        );

        return;
    }

    const exists =
        league.players.some(
            p =>
                p.name.toLowerCase() ===
                name.toLowerCase()
        );

    if (exists) {

        alert("That player already exists.");

        return;
    }

    league.players.push({

        id: Date.now(),

        name: name,

        wins: 0,
        ties: 0,
        losses: 0,
        points: 0,

        division: "",
        offenseA: "",
        offenseB: "",
        defense: "",

        weeklyScores: {}

    });

    saveData();

    showPlayers();
}


/* ============================================================
   REMOVE PLAYER
   ============================================================ */

function removePlayer(id) {

    const player =
        league.players.find(p => p.id === id);

    if (!player) return;

    if (
        !confirm(
            `Remove ${player.name} from the league?`
        )
    ) {
        return;
    }

    league.players =
        league.players.filter(
            p => p.id !== id
        );

    saveData();

    showPlayers();
}


/* ============================================================
   RANDOMIZE DRAFT ORDER
   ============================================================ */

function randomizeDraftOrder() {

    league.draftOrder =
        league.players
            .map(p => p.id)
            .sort(() => Math.random() - 0.5);

    saveData();

    showDraft();
}


/* ============================================================
   DRAFT
   ============================================================ */

function showDraft() {

    let order = league.draftOrder;

    if (!order.length) {

        order =
            league.players.map(
                p => p.id
            );
    }


    let html = `

        <div class="page-title">

            <h2>📝 NFL Draft</h2>

            <p>
                Snake draft:
                Top → Bottom → Bottom → Top
            </p>

        </div>

    `;


    html += `

        <div class="card">

            <button
                class="btn btn-primary"
                onclick="randomizeDraftOrder()">

                🎲 Randomize Draft Order

            </button>

        </div>

    `;


    if (!league.draftOrder.length) {

        html += `

            <div class="alert alert-warning">

                Draft order has not been randomized yet.

            </div>

        `;

        document.getElementById("app").innerHTML = html;

        return;
    }


    html += `

        <div class="card">

            <h3>Draft Order</h3>

            <br>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Pick</th>
                            <th>Player</th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    league.draftOrder.forEach(
        (id, index) => {

            const player =
                league.players.find(
                    p => p.id === id
                );

            html += `

                <tr>

                    <td>
                        <strong>
                            ${index + 1}
                        </strong>
                    </td>

                    <td>
                        ${player ? player.name : "Unknown"}
                    </td>

                </tr>

            `;
        }
    );


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    html += `

        <div class="card">

            <h3>Draft Selections</h3>

            <br>

            <div class="alert alert-info">

                <strong>Draft order:</strong>

                Division →
                Offense A →
                Offense B →
                Defense

                <br><br>

                Each round follows the snake format.

            </div>

            ${draftRound("division", "Division Draft", "Division")}

            ${draftRound("offenseA", "Offense A Draft", "Offense Team")}

            ${draftRound("offenseB", "Offense B Draft", "Offense Team")}

            ${draftRound("defense", "Defense Draft", "Defense Team")}

        </div>

    `;


    document.getElementById("app").innerHTML = html;
}


/* ============================================================
   DRAFT ROUND
   ============================================================ */

function draftRound(type, title, label) {

    let html = `

        <div class="card" style="box-shadow:none;border:1px solid #ddd;">

            <h3>${title}</h3>

            <br>

    `;


    const picks =
        league.draft[type] || {};


    league.draftOrder.forEach(
        (id, index) => {

            const player =
                league.players.find(
                    p => p.id === id
                );

            if (!player) return;


            let actualIndex = index;

            /*
                Snake order.
                Odd rounds reverse.
            */

            if (
                type === "offenseA" ||
                type === "defense"
            ) {
                actualIndex =
                    league.draftOrder.length -
                    1 -
                    index;
            }


            const selected =
                picks[player.id] || "";


            let options = "";

            if (type === "division") {

                Object.keys(divisions)
                    .forEach(div => {

                        const count =
                            Object.values(picks)
                                .filter(
                                    x => x === div
                                ).length;

                        const disabled =
                            count >= 3 &&
                            selected !== div;

                        options += `

                            <option
                                value="${div}"
                                ${selected === div ? "selected" : ""}
                                ${disabled ? "disabled" : ""}
                            >

                                ${div}
                                ${count >= 3 ? " (FULL)" : ""}

                            </option>

                        `;
                    });

            } else {

                const teams =
                    Object.values(divisions)
                        .flat();

                teams.forEach(team => {

                    const count =
                        Object.values(picks)
                            .filter(
                                x => x === team
                            ).length;

                    let max =
                        type === "defense"
                        ? 1
                        : 2;

                    const disabled =
                        count >= max &&
                        selected !== team;

                    options += `

                        <option
                            value="${team}"
                            ${selected === team ? "selected" : ""}
                            ${disabled ? "disabled" : ""}
                        >

                            ${team}
                            ${count >= max ? " (FULL)" : ""}

                        </option>

                    `;
                });
            }


            html += `

                <div class="form-group">

                    <label>

                        Pick ${actualIndex + 1} —
                        ${player.name}

                    </label>

                    <select
                        onchange="
                            makeDraftPick(
                                '${type}',
                                ${player.id},
                                this.value
                            )
                        "
                    >

                        <option value="">
                            Select ${label}
                        </option>

                        ${options}

                    </select>

                </div>

            `;
        }
    );


    html += `</div>`;

    return html;
}


/* ============================================================
   MAKE DRAFT PICK
   ============================================================ */

function makeDraftPick(
    type,
    playerId,
    value
) {

    if (!league.draft[type]) {

        league.draft[type] = {};
    }

    if (!value) return;


    /*
        Validate team restrictions.
    */

    const player =
        league.players.find(
            p => p.id === playerId
        );

    if (!player) return;


    if (
        type === "offenseA" ||
        type === "offenseB" ||
        type === "defense"
    ) {

        if (
            player.division &&
            divisions[player.division]
                .includes(value)
        ) {

            alert(
                "A team from your selected division cannot be selected."
            );

            showDraft();

            return;
        }
    }


    /*
        Offense B cannot be the same
        as Offense A.
    */

    if (
        type === "offenseB" &&
        player.offenseA === value
    ) {

        alert(
            "Your second offense team must be different from your first offense team."
        );

        showDraft();

        return;
    }


    /*
        Defense cannot equal either
        offense selection.
    */

    if (
        type === "defense" &&
        (
            player.offenseA === value ||
            player.offenseB === value
        )
    ) {

        alert(
            "Your defense team cannot be one of your offense teams."
        );

        showDraft();

        return;
    }


    league.draft[type][playerId] =
        value;


    player[
        type === "division"
        ? "division"
        : type
    ] = value;


    saveData();

    showDraft();
}


/* ============================================================
   PICKS / ROSTERS
   ============================================================ */

function showTeams() {

    let rows = "";

    league.players.forEach(
        (player, index) => {

            rows += `

                <tr>

                    <td>${index + 1}</td>

                    <td>
                        <strong>${player.name}</strong>
                    </td>

                    <td>
                        ${player.division || "Not Selected"}
                    </td>

                    <td>
                        ${player.offenseA || "Not Selected"}
                    </td>

                    <td>
                        ${player.offenseB || "Not Selected"}
                    </td>

                    <td>
                        ${player.defense || "Not Selected"}
                    </td>

                </tr>

            `;
        }
    );


    document.getElementById("app").innerHTML = `

        <div class="page-title">

            <h2>🏈 Player Picks</h2>

            <p>
                Each player's complete NFL draft selections.
            </p>

        </div>


        <div class="card">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>#</th>
                            <th>Player</th>
                            <th>Division</th>
                            <th>Offense A</th>
                            <th>Offense B</th>
                            <th>Defense</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </div>

    `;
}


/* ============================================================
   STANDINGS
   ============================================================ */

function getStandings() {

    return [...league.players].sort(
        (a, b) => {

            if (b.wins !== a.wins)
                return b.wins - a.wins;

            if (b.ties !== a.ties)
                return b.ties - a.ties;

            if (a.losses !== b.losses)
                return a.losses - b.losses;

            return b.points - a.points;
        }
    );
}


function showStandings() {

    const standings =
        getStandings();


    let rows = "";


    standings.forEach(
        (player, index) => {

            let className = "";

            if (index === 0)
                className = "rank-1";

            if (index === 1)
                className = "rank-2";

            if (index === 2)
                className = "rank-3";


            rows += `

                <tr class="${className}">

                    <td>
                        <strong>
                            ${index + 1}
                        </strong>
                    </td>

                    <td>
                        ${player.name}
                    </td>

                    <td>
                        ${player.wins}
                    </td>

                    <td>
                        ${player.ties}
                    </td>

                    <td>
                        ${player.losses}
                    </td>

                    <td>
                        ${player.points}
                    </td>

                </tr>

            `;
        }
    );


    document.getElementById("app").innerHTML = `

        <div class="page-title">

            <h2>📊 Standings</h2>

            <p>
                Ranked by Wins → Ties → Losses → Total Points
            </p>

        </div>


        <div class="card">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Rank</th>
                            <th>Player</th>
                            <th>Wins</th>
                            <th>Ties</th>
                            <th>Losses</th>
                            <th>Total Points</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </div>

    `;
}


/* ============================================================
   SCHEDULE
   ============================================================ */

function generateSchedule() {

    if (league.players.length !== 30) {

        alert(
            "The schedule requires exactly 30 players."
        );

        return;
    }


    const ids =
        league.players.map(
            p => p.id
        );


    /*
        Circle method for a 30-player
        round-robin schedule.

        18 weeks guarantees every player
        plays every other player once.
    */

    let teams = [...ids];

    const weeks = {};


    for (let week = 1; week <= 15; week++) {

        weeks[week] = [];

        for (
            let i = 0;
            i < teams.length / 2;
            i++
        ) {

            weeks[week].push({

                player1: teams[i],

                player2:
                    teams[
                        teams.length - 1 - i
                    ]

            });
        }


        /*
            Rotate all except first player.
        */

        const fixed = teams[0];

        const rotating =
            teams.slice(1);

        rotating.unshift(
            rotating.pop()
        );

        teams =
            [fixed, ...rotating];
    }


    /*
        Add Weeks 16-18 as additional
        matchups so the league has
        18 regular-season weeks.
    */

    weeks[16] = weeks[1].map(
        game => ({
            player1: game.player1,
            player2: game.player2
        })
    );

    weeks[17] = weeks[2].map(
        game => ({
            player1: game.player1,
            player2: game.player2
        })
    );

    weeks[18] = weeks[3].map(
        game => ({
            player1: game.player1,
            player2: game.player2
        })
    );


    league.schedule = weeks;

    saveData();

    showSchedule();
}


/* ============================================================
   SCHEDULE PAGE
   ============================================================ */

function showSchedule() {

    let html = `

        <div class="page-title">

            <h2>🗓️ Schedule</h2>

            <p>
                18-week NFL fantasy league schedule.
            </p>

        </div>


        <div class="card">

            <button
                class="btn btn-primary"
                onclick="generateSchedule()">

                🔄 Generate 18-Week Schedule

            </button>

        </div>

    `;


    if (
        !league.schedule ||
        Object.keys(league.schedule).length === 0
    ) {

        html += `

            <div class="alert alert-warning">

                No schedule has been generated yet.

            </div>

        `;

        document.getElementById("app").innerHTML =
            html;

        return;
    }


    for (
        let week = 1;
        week <= 18;
        week++
    ) {

        html += `

            <div class="card">

                <h3>Week ${week}</h3>

                <br>

                <div class="matchup-grid">

        `;


        league.schedule[week].forEach(
            (game, index) => {

                const p1 =
                    league.players.find(
                        p => p.id === game.player1
                    );

                const p2 =
                    league.players.find(
                        p => p.id === game.player2
                    );


                html += `

                    <div class="matchup">

                        <h3>
                            Game ${index + 1}
                        </h3>

                        <div class="player-box">

                            ${p1 ? p1.name : "Unknown"}

                        </div>

                        <div class="vs">
                            VS
                        </div>

                        <div class="player-box">

                            ${p2 ? p2.name : "Unknown"}

                        </div>

                    </div>

                `;
            }
        );


        html += `

                </div>

            </div>

        `;
    }


    document.getElementById("app").innerHTML =
        html;
}


/* ============================================================
   WEEKLY SCORING
   ============================================================ */

function showWeekly() {

    let rows = "";


    league.players.forEach(
        player => {

            const score =
                league.weeklyScores[player.id] || {
                    division: 0,
                    offenseA: 0,
                    offenseB: 0,
                    defense: 0,
                    total: 0
                };


            rows += `

                <tr>

                    <td>
                        <strong>
                            ${player.name}
                        </strong>
                    </td>

                    <td>
                        <input
                            class="score-input"
                            type="number"
                            min="0"
                            value="${score.division}"
                            onchange="
                                updateWeeklyScore(
                                    ${player.id},
                                    'division',
                                    this.value
                                )
                            "
                        >
                    </td>

                    <td>
                        <input
                            class="score-input"
                            type="number"
                            min="0"
                            value="${score.offenseA}"
                            onchange="
                                updateWeeklyScore(
                                    ${player.id},
                                    'offenseA',
                                    this.value
                                )
                            "
                        >
                    </td>

                    <td>
                        <input
                            class="score-input"
                            type="number"
                            min="0"
                            value="${score.offenseB}"
                            onchange="
                                updateWeeklyScore(
                                    ${player.id},
                                    'offenseB',
                                    this.value
                                )
                            "
                        >
                    </td>

                    <td>
                        <input
                            class="score-input"
                            type="number"
                            min="0"
                            value="${score.defense}"
                            onchange="
                                updateWeeklyScore(
                                    ${player.id},
                                    'defense',
                                    this.value
                                )
                            "
                        >
                    </td>

                    <td>
                        <strong>
                            ${score.total}
                        </strong>
                    </td>

                </tr>

            `;
        }
    );


    document.getElementById("app").innerHTML = `

        <div class="page-title">

            <h2>📅 Weekly Scores</h2>

            <p>
                Enter the weekly points for each player's
                division, offense and defense selections.
            </p>

        </div>


        <div class="card">

            <div class="alert alert-info">

                Division maximum:
                based on wins by the four teams.

                <br>

                Offense maximum:
                <strong>24 points</strong> per offense selection.

                <br>

                Defense maximum:
                <strong>26 points</strong> per defense selection.

            </div>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Player</th>
                            <th>Division</th>
                            <th>Offense A</th>
                            <th>Offense B</th>
                            <th>Defense</th>
                            <th>Total</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </div>

    `;
}


/* ============================================================
   UPDATE WEEKLY SCORE
   ============================================================ */

function updateWeeklyScore(
    playerId,
    category,
    value
) {

    value =
        Number(value) || 0;


    if (!league.weeklyScores[playerId]) {

        league.weeklyScores[playerId] = {

            division: 0,
            offenseA: 0,
            offenseB: 0,
            defense: 0,
            total: 0

        };
    }


    league.weeklyScores[playerId][category] =
        value;


    const score =
        league.weeklyScores[playerId];


    /*
        Calculate total.
    */

    score.total =
        score.division +
        Math.min(score.offenseA, 24) +
        Math.min(score.offenseB, 24) +
        Math.min(score.defense, 26);


    /*
        Update player's total points.
    */

    const player =
        league.players.find(
            p => p.id === playerId
        );


    if (player) {

        player.points =
            Object.values(
                league.weeklyScores
            )
            .filter(
                s =>
                    s.playerId === playerId ||
                    true
            )
            .reduce(
                (total, s) => {

                    return total +
                        Number(s.total || 0);

                },
                0
            );
    }


    saveData();

    showWeekly();
}


/* ============================================================
   OFFENSE POINT CALCULATOR
   ============================================================ */

function getBracketPoints(
    value,
    brackets
) {

    value =
        Number(value) || 0;


    for (
        const bracket of brackets
    ) {

        if (
            value >= bracket.min &&
            value <= bracket.max
        ) {

            return bracket.points;
        }
    }


    return 0;
}


function calculateOffenseScore(stats) {

    const passing =
        getBracketPoints(
            stats.passing,
            scoring.offense.passing
        );


    const rushing =
        getBracketPoints(
            stats.rushing,
            scoring.offense.rushing
        );


    const receptions =
        getBracketPoints(
            stats.receptions,
            scoring.offense.receptions
        );


    const fieldGoals =
        getBracketPoints(
            stats.fieldGoals,
            scoring.offense.fieldGoals
        );


    /*
        Excel rule:
        Maximum offense score = 24.
    */

    return Math.min(
        passing +
        rushing +
        receptions +
        fieldGoals,
        24
    );
}


/* ============================================================
   DEFENSE POINT CALCULATOR
   ============================================================ */

function calculateDefenseScore(stats) {

    const total =

        (Number(stats.sacks) || 0) *
        scoring.defense.sacks

        +

        (Number(stats.interceptions) || 0) *
        scoring.defense.interceptions

        +

        (Number(stats.forcedFumbles) || 0) *
        scoring.defense.forcedFumbles

        +

        (Number(stats.fumbleRecoveries) || 0) *
        scoring.defense.fumbleRecoveries

        +

        (Number(stats.defensiveTouchdowns) || 0) *
        scoring.defense.defensiveTouchdowns

        +

        (Number(stats.safeties) || 0) *
        scoring.defense.safeties;


    /*
        Excel rule:
        Maximum defense score = 26.
    */

    return Math.min(
        total,
        26
    );
}


/* ============================================================
   SCORING PAGE
   ============================================================ */

function showScoring() {

    document.getElementById("app").innerHTML = `

        <div class="page-title">

            <h2>🧮 Scoring Rules</h2>

            <p>
                Scoring system taken from the NFL Fantasy League Excel workbook.
            </p>

        </div>


        <div class="card">

            <h3>🏈 Offense Scoring</h3>

            <br>

            <h4>Passing Yards</h4>

            <p>0–100 yards = 1 point</p>
            <p>101–200 yards = 2 points</p>
            <p>201–300 yards = 3 points</p>
            <p>301–400 yards = 4 points</p>
            <p>401+ yards = 5 points</p>

            <br>

            <h4>Running Yards</h4>

            <p>0–100 yards = 1 point</p>
            <p>101–200 yards = 2 points</p>
            <p>201–300 yards = 3 points</p>
            <p>301–400 yards = 4 points</p>
            <p>401+ yards = 5 points</p>

            <br>

            <h4>WR/TE Catches</h4>

            <p>1–10 catches = 1 point</p>
            <p>11–20 catches = 2 points</p>
            <p>21–30 catches = 4 points</p>
            <p>31–40 catches = 6 points</p>
            <p>41–50 catches = 8 points</p>
            <p>51+ catches = 10 points</p>

            <br>

            <h4>Field Goals</h4>

            <p>1 FG = 1 point</p>
            <p>2 FG = 2 points</p>
            <p>3 FG = 3 points</p>
            <p>4 FG = 4 points</p>
            <p>5 FG = 5 points</p>
            <p>6 FG = 6 points</p>
            <p>7+ FG = 7 points</p>

            <br>

            <div class="alert alert-info">

                Maximum score for each offense selection:
                <strong>24 points</strong>.

            </div>

        </div>


        <div class="card">

            <h3>🛡️ Defense Scoring</h3>

            <br>

            <p>QB Sack = 1 point</p>

            <p>Interception = 2 points</p>

            <p>Forced Fumble = 1 point</p>

            <p>Fumble Recovery = 1 point</p>

            <p>Defensive Touchdown = 3 points</p>

            <p>Safety = 2 points</p>

            <br>

            <div class="alert alert-info">

                Maximum score for each defense selection:
                <strong>26 points</strong>.

            </div>

        </div>


        <div class="card">

            <h3>🏆 Standings Ranking</h3>

            <br>

            <p>1. Total Wins</p>
            <p>2. Total Ties</p>
            <p>3. Total Losses</p>
            <p>4. Total Points</p>

        </div>

    `;
}


/* ============================================================
   PLAYOFFS
   ============================================================ */

function showPlayoffs() {

    const standings =
        getStandings();


    const top10 =
        standings.slice(0, 10);


    let rows = "";


    top10.forEach(
        (player, index) => {

            rows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${player.name}
                    </td>

                    <td>
                        ${player.wins}
                    </td>

                    <td>
                        ${player.ties}
                    </td>

                    <td>
                        ${player.losses}
                    </td>

                    <td>
                        ${player.points}
                    </td>

                </tr>

            `;
        }
    );


    document.getElementById("app").innerHTML = `

        <div class="page-title">

            <h2>🏆 Playoffs</h2>

            <p>
                Top 10 players advance to the playoffs.
            </p>

        </div>


        <div class="card">

            <div class="alert alert-info">

                According to the league rules,
                the Top 10 ranked players advance
                to the playoffs.

            </div>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Seed</th>
                            <th>Player</th>
                            <th>Wins</th>
                            <th>Ties</th>
                            <th>Losses</th>
                            <th>Points</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </div>


        <div class="card">

            <h3>Playoff Format</h3>

            <br>

            <p>
                The playoff system from the Excel workbook
                uses the top 10 players.
            </p>

            <br>

            <p>
                Higher-ranked players receive the
                first opportunity to select playoff
                opponents according to the league rules.
            </p>

            <br>

            <p>
                Remaining NFL teams can be used for
                additional playoff offense and defense
                selections.
            </p>

        </div>

    `;
}


/* ============================================================
   WINNINGS
   ============================================================ */

function showWinnings() {

    document.getElementById("app").innerHTML = `

        <div class="page-title">

            <h2>💰 Winnings</h2>

            <p>
                NFL Fantasy Draft League Prize Pool
            </p>

        </div>


        <div class="grid">

            <div class="card stat-card">

                <div class="stat-label">
                    Entry Fee
                </div>

                <div class="stat-number">
                    $75
                </div>

            </div>


            <div class="card stat-card">

                <div class="stat-label">
                    Maximum Players
                </div>

                <div class="stat-number">
                    16
                </div>

            </div>


            <div class="card stat-card">

                <div class="stat-label">
                    Total Prize Pool
                </div>

                <div class="stat-number">
                    $1,200
                </div>

            </div>

        </div>


        <div class="card">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Place</th>
                            <th>Winnings</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr class="rank-1">

                            <td>
                                <strong>🥇 1st</strong>
                            </td>

                            <td>
                                <strong>$700</strong>
                            </td>

                        </tr>

                        <tr class="rank-2">

                            <td>
                                <strong>🥈 2nd</strong>
                            </td>

                            <td>
                                <strong>$500</strong>
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;
}


/* ============================================================
   ADMIN
   ============================================================ */

function showAdmin() {

    document.getElementById("app").innerHTML = `

        <div class="page-title">

            <h2>⚙️ Admin</h2>

            <p>
                Manage league data.
            </p>

        </div>


        <div class="card">

            <h3>League Data</h3>

            <br>

            <button
                class="btn btn-warning"
                onclick="resetStandings()">

                🔄 Reset Standings

            </button>


            <button
                class="btn btn-warning"
                onclick="resetDraft()">

                🔄 Reset Draft

            </button>


            <button
                class="btn btn-warning"
                onclick="resetSchedule()">

                🔄 Reset Schedule

            </button>


            <button
                class="btn btn-danger"
                onclick="resetEverything()">

                ⚠️ Reset Entire League

            </button>

        </div>


        <div class="card">

            <h3>Browser Storage</h3>

            <br>

            <p>

                This Version 1 website saves the league
                information using your browser's
                localStorage.

            </p>

            <br>

            <p class="small">

                Important: this means the data is currently
                stored only on the device/browser being used.

            </p>

        </div>

    `;
}


/* ============================================================
   RESET FUNCTIONS
   ============================================================ */

function resetStandings() {

    if (
        !confirm(
            "Reset all wins, ties, losses and points?"
        )
    ) {
        return;
    }


    league.players.forEach(
        player => {

            player.wins = 0;
            player.ties = 0;
            player.losses = 0;
            player.points = 0;

        }
    );


    league.weeklyScores = {};

    saveData();

    showStandings();
}


function resetDraft() {

    if (
        !confirm(
            "Reset the entire draft?"
        )
    ) {
        return;
    }


    league.draftOrder = [];

    league.draft = {

        division: {},
        offenseA: {},
        offenseB: {},
        defense: {}

    };


    league.players.forEach(
        player => {

            player.division = "";
            player.offenseA = "";
            player.offenseB = "";
            player.defense = "";

        }
    );


    saveData();

    showDraft();
}


function resetSchedule() {

    if (
        !confirm(
            "Reset the schedule?"
        )
    ) {
        return;
    }


    league.schedule = {};

    saveData();

    showSchedule();
}


function resetEverything() {

    if (
        !confirm(
            "WARNING: This will erase the entire league. Continue?"
        )
    ) {
        return;
    }


    localStorage.removeItem(
        "nflFantasyLeague"
    );

    location.reload();
}


/* ============================================================
   INITIAL LOAD
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showPage("dashboard");

    }
);
