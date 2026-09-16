function showLeague(league) {

    const content =
        document.getElementById("content");


    if (league === "home") {

        content.innerHTML = `

            <div class="card">

                <h2>🏆 Fantasy Sports Hub</h2>

                <p>
                    Select a league above
                    to view the league dashboard.
                </p>

            </div>

        `;

    }


    if (league === "nfl") {

        content.innerHTML = `

            <div class="card">

                <h2>🏈 NFL Fantasy League</h2>

                <p>16 Players</p>

                <button onclick="showNFLStandings()">
                    Standings
                </button>

                <button>
                    Draft
                </button>

                <button>
                    Schedule
                </button>

                <button>
                    Scoring
                </button>

            </div>

        `;

    }


    if (league === "college") {

        content.innerHTML = `

            <div class="card">

                <h2>🏈 College Football League</h2>

                <p>18 Players</p>

                <button>
                    Standings
                </button>

                <button>
                    Draft
                </button>

                <button>
                    Teams
                </button>

                <button>
                    Scoring
                </button>

            </div>

        `;

    }


    if (league === "nba") {

        content.innerHTML = `

            <div class="card">

                <h2>🏀 NBA Fantasy League</h2>

                <p>12 Players</p>

                <button>
                    Standings
                </button>

                <button>
                    Draft
                </button>

                <button>
                    Schedule
                </button>

                <button>
                    Scoring
                </button>

            </div>

        `;

    }

}


function showNFLStandings() {

    const content =
        document.getElementById("content");


    content.innerHTML = `

        <div class="card">

            <h2>🏈 NFL Standings</h2>

            <table>

                <tr>

                    <th>Rank</th>
                    <th>Player</th>
                    <th>Wins</th>
                    <th>Ties</th>
                    <th>Losses</th>
                    <th>Points</th>

                </tr>

                <tr>

                    <td>1</td>
                    <td>Matt</td>
                    <td>5</td>
                    <td>0</td>
                    <td>1</td>
                    <td>47</td>

                </tr>

                <tr>

                    <td>2</td>
                    <td>John</td>
                    <td>4</td>
                    <td>1</td>
                    <td>1</td>
                    <td>43</td>

                </tr>

                <tr>

                    <td>3</td>
                    <td>Sarah</td>
                    <td>4</td>
                    <td>0</td>
                    <td>2</td>
                    <td>39</td>

                </tr>

            </table>

        </div>

    `;

}
