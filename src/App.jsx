import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // useState의 Lazy Initializer 사용
  const [teams, setTeams] = useState(() => {
    try {
      const storedTeams = localStorage.getItem("teams");
      return storedTeams ? JSON.parse(storedTeams) : [];
    } catch (error) {
      console.error("Failed to parse teams from localStorage", error);
      return [];
    }
  });

  const [score, setScore] = useState(() => {
    try {
      const storedScores = localStorage.getItem("scores");
      return storedScores ? JSON.parse(storedScores) : [];
    } catch (error) {
      console.error("Failed to parse scores from localStorage", error);
      return [];
    }
  });
  const [scoreIndex, setScoreIndex] = useState(() => {
    try {
      const storedScoreIndex = localStorage.getItem("scoreIndex");
      return storedScoreIndex ? JSON.parse(storedScoreIndex) : 0;
    } catch (error) {
      console.error("Failed to parse scoreIndex from localStorage", error);
      return 0;
    }
  });

  const [lastScoreTeam, setLastScoreTeam] = useState(() => {
    try {
      const storedLastScoreTeam = localStorage.getItem("lastScoreTeam");
      return storedLastScoreTeam ? JSON.parse(storedLastScoreTeam) : null;
    } catch (error) {
      console.error("Failed to parse lastScoreTeam from localStorage", error);
      return null;
    }
  });
  const [lastScore, setLastScore] = useState(() => {
    try {
      const storedLastScore = localStorage.getItem("lastScore");
      return storedLastScore ? JSON.parse(storedLastScore) : 0;
    } catch (error) {
      console.error("Failed to parse lastScore from localStorage", error);
      return 0;
    }
  });

  const [tempTeams, setTempTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("scores", JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem("scoreIndex", JSON.stringify(scoreIndex));
  }, [scoreIndex]);

  useEffect(() => {
    localStorage.setItem("lastScore", JSON.stringify(lastScore));
  }, [lastScore]);

  useEffect(() => {
    localStorage.setItem("lastScoreTeam", JSON.stringify(lastScoreTeam));
  }, [lastScoreTeam]);

  function finishGame() {
    const teamsWithScores = teams.map((team, index) => ({
      name: team,
      score: score[index] || 0,
    }));

    teamsWithScores.sort((a, b) => b.score - a.score);

    const resultString = teamsWithScores
      .map(
        (teamInfo, index) =>
          `${index + 1}등: ${teamInfo.name} (${teamInfo.score}점)`
      )
      .join("\n");

    alert(resultString);
  }

  return (
    <>
      {teams.length === 0 ? (
        <div>
          <h1 className="no-teams">팀을 추가하세요</h1>
          <div>
            현재 팀: {tempTeams.length > 0 ? tempTeams.join(", ") : "없음"}
          </div>
          <div>
            <input
              type="text"
              placeholder="팀 이름"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              onClick={() => {
                setTempTeams([...tempTeams, inputValue]);
                setInputValue("");
              }}
            >
              팀 추가
            </button>
            <button
              onClick={() => {
                setTeams(tempTeams);
                setTempTeams([]);
              }}
            >
              게임 시작
            </button>
          </div>
        </div>
      ) : (
        <div className="teams-list">
          {teams.map((team, index) => (
            <div
              key={index}
              className="team-item"
              onClick={() => setCurrentTeamIndex(index)}
            >
              <button>{team}</button> : {score[index] || 0}점
            </div>
          ))}
          <div>
            {currentTeamIndex !== -1 ? teams[currentTeamIndex] + "에게" : ""}{" "}
            점수 부여
          </div>
          <button
            onClick={() => {
              const newScore = [...score];
              newScore[currentTeamIndex] =
                (newScore[currentTeamIndex] || 0) + 10;
              setScore(newScore);
              setScoreIndex(scoreIndex + 1);
              setLastScoreTeam(teams[currentTeamIndex]);
              setLastScore(10);
            }}
          >
            10점
          </button>
          <button
            onClick={() => {
              const newScore = [...score];
              newScore[currentTeamIndex] =
                (newScore[currentTeamIndex] || 0) + 20;
              setScore(newScore);
              setScoreIndex(scoreIndex + 1);
              setLastScoreTeam(teams[currentTeamIndex]);
              setLastScore(20);
            }}
          >
            20점
          </button>
          <button
            onClick={() => {
              const newScore = [...score];
              newScore[currentTeamIndex] =
                (newScore[currentTeamIndex] || 0) + 30;
              setScore(newScore);
              setScoreIndex(scoreIndex + 1);
              setLastScoreTeam(teams[currentTeamIndex]);
              setLastScore(30);
            }}
          >
            30점
          </button>
          <button
            onClick={() => {
              const newScore = [...score];
              newScore[currentTeamIndex] =
                (newScore[currentTeamIndex] || 0) + 50;
              setScore(newScore);
              setScoreIndex(scoreIndex + 1);
              setLastScoreTeam(teams[currentTeamIndex]);
              setLastScore(50);
            }}
          >
            50점
          </button>
          <button
            onClick={() => {
              const resetScores = teams.map(() => 0);
              setScore(resetScores);
              setCurrentTeamIndex(-1);
              setLastScoreTeam(null);
              setLastScore(0);
              setScoreIndex(0);
            }}
          >
            점수 초기화
          </button>
          <button
            onClick={() => {
              setTeams([]);
              setScore([]);
              setCurrentTeamIndex(-1);
              setTempTeams([]);
              setInputValue("");
              setScoreIndex(0);
              setLastScoreTeam(null);
              setLastScore(0);
            }}
          >
            게임 초기화
          </button>
          <button onClick={finishGame}>게임 끝내기</button>
          <div>
            마지막 점수 부여:
            {lastScoreTeam !== null
              ? ` ${lastScoreTeam}에게 ${lastScore}점`
              : " 없음"}
          </div>
          <div>총 점수 부여 횟수: {scoreIndex}회</div>
        </div>
      )}
    </>
  );
}

export default App;
