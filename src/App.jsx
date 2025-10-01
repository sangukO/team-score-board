import React, { useState, useEffect } from "react";
import { ClipboardClock, RotateCcw } from "lucide-react";

function App() {
  const [teams, setTeams] = useState(
    () => JSON.parse(localStorage.getItem("teams")) || []
  );
  const [score, setScore] = useState(
    () => JSON.parse(localStorage.getItem("scores")) || []
  );
  const [lastScoreTeam, setLastScoreTeam] = useState(
    () => JSON.parse(localStorage.getItem("lastScoreTeam")) || null
  );
  const [scoreHistory, setScoreHistory] = useState(
    () => JSON.parse(localStorage.getItem("scoreHistory")) || []
  );
  const [actionLog, setActionLog] = useState(
    () => JSON.parse(localStorage.getItem("actionLog")) || []
  );

  // 모달 표시 여부
  const [isLogVisible, setIsLogVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);

  // 게임 결과 데이터 저장
  const [gameResult, setGameResult] = useState([]);

  const [tempTeams, setTempTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [scoreIndex, setScoreIndex] = useState(
    () => parseInt(localStorage.getItem("scoreIndex")) || 0
  );
  const [lastScore, setLastScore] = useState(
    () => parseInt(localStorage.getItem("lastScore")) || 0
  );

  // 데이터 영속성
  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);
  useEffect(() => {
    localStorage.setItem("scores", JSON.stringify(score));
  }, [score]);
  useEffect(() => {
    localStorage.setItem("lastScoreTeam", JSON.stringify(lastScoreTeam));
  }, [lastScoreTeam]);
  useEffect(() => {
    localStorage.setItem("scoreIndex", scoreIndex);
  }, [scoreIndex]);
  useEffect(() => {
    localStorage.setItem("lastScore", lastScore);
  }, [lastScore]);
  useEffect(() => {
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));
  }, [scoreHistory]);
  useEffect(() => {
    localStorage.setItem("actionLog", JSON.stringify(actionLog));
  }, [actionLog]);

  // 게임 시작
  const startGame = () => {
    if (tempTeams.length < 2) {
      alert("최소 2개 이상의 팀을 추가해야 게임을 시작할 수 있습니다.");
      return;
    }
    setTeams(tempTeams);
    setScore(new Array(tempTeams.length).fill(0));
    setTempTeams([]);
    setScoreHistory([]);
    setActionLog([]);
  };

  // 점수 부여
  const handleAddScore = (points) => {
    if (currentTeamIndex === -1) {
      alert("점수를 부여할 팀을 먼저 선택하세요!");
      return;
    }
    setScoreHistory([
      ...scoreHistory,
      { scores: score, scoreIndex, lastScoreTeam, lastScore },
    ]);
    const newLogEntry = {
      teamName: teams[currentTeamIndex],
      points,
      timestamp: new Date().toLocaleTimeString("ko-KR"),
    };
    setActionLog([newLogEntry, ...actionLog]);
    const newScore = [...score];
    newScore[currentTeamIndex] = (newScore[currentTeamIndex] || 0) + points;
    setScore(newScore);
    setScoreIndex(scoreIndex + 1);
    setLastScoreTeam(teams[currentTeamIndex]);
    setLastScore(points);

    // 점수 부여 후 팀 선택 초기화
    setCurrentTeamIndex(-1);
  };

  // 마지막 점수 되돌리기
  const handleUndo = () => {
    if (scoreHistory.length === 0) {
      alert("되돌릴 기록이 없습니다.");
      return;
    }
    const previousState = scoreHistory[scoreHistory.length - 1];
    setScore(previousState.scores);
    setScoreIndex(previousState.scoreIndex);
    setLastScoreTeam(previousState.lastScoreTeam);
    setLastScore(previousState.lastScore);
    setScoreHistory(scoreHistory.slice(0, -1));
    setActionLog(actionLog.slice(1));
  };

  // 점수만 초기화
  const handleResetScores = () => {
    if (window.confirm(`모든 팀의 점수를 0으로 초기화하시겠습니까?`)) {
      setScore(new Array(teams.length).fill(0));
      setCurrentTeamIndex(-1);
      setLastScoreTeam(null);
      setLastScore(0);
      setScoreIndex(0);
      setScoreHistory([]);
      setActionLog([]);
    }
  };

  // 게임 초기화
  const handleResetGame = () => {
    if (
      window.confirm("게임을 초기화하시겠습니까? 메인 화면으로 돌아갑니다.")
    ) {
      setTeams([]);
      setScore([]);
      setCurrentTeamIndex(-1);
      setTempTeams([]);
      setInputValue("");
      setScoreIndex(0);
      setLastScoreTeam(null);
      setLastScore(0);
      setScoreHistory([]);
      setActionLog([]);
    }
  };

  // 게임 종료 및 결과 표시
  const finishGame = () => {
    const teamsWithScores = teams.map((team, index) => ({
      name: team,
      score: score[index] || 0,
    }));
    teamsWithScores.sort((a, b) => b.score - a.score);

    setGameResult(teamsWithScores);
    setIsResultVisible(true);
  };

  // 렌더링
  // 팀이 없으면 팀 추가 화면 표시
  if (teams.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            🏆 팀 스코어보드 🏆
          </h1>
          <div className="mb-6 text-sm text-gray-600">
            <span className="font-semibold">추가된 팀:</span>{" "}
            {tempTeams.length > 0 ? tempTeams.join(", ") : " 없음"}
          </div>
          <div className="flex gap-2 mb-6">
            <input
              className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              type="text"
              placeholder="팀 이름을 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim() !== "") {
                  setTempTeams([...tempTeams, inputValue.trim()]);
                  setInputValue("");
                }
              }}
            />
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 font-semibold transition whitespace-nowrap disabled:bg-gray-300"
              onClick={() => {
                if (inputValue.trim() === "") return;
                setTempTeams([...tempTeams, inputValue.trim()]);
                setInputValue("");
              }}
              disabled={inputValue.trim() === ""}
            >
              팀 추가
            </button>
          </div>
          <button
            className="w-full bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 font-bold text-lg transition disabled:bg-gray-300"
            onClick={startGame}
            disabled={tempTeams.length < 2}
          >
            게임 시작
          </button>
        </div>
      </div>
    );
  }

  // 팀이 있으면 메인 게임 화면 표시
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
        <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-xl space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            🏆 스코어보드 🏆
          </h1>

          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border-2 border-pink-200"
                >
                  <span className="font-semibold text-gray-700">{team}</span>
                  <span className="font-bold text-lg text-pink-600">
                    {score[index] || 0}점
                  </span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="text-center relative">
            <ClipboardClock
              className={`absolute left-0 top-0 transition-colors ${
                scoreHistory.length > 0
                  ? "text-gray-500 hover:text-gray-700 cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              onClick={() => scoreHistory.length > 0 && setIsLogVisible(true)}
            />
            <p className="text-lg font-semibold text-gray-800 mb-3">
              {currentTeamIndex !== -1 ? (
                <>
                  <span className="text-pink-600 font-bold">
                    {teams[currentTeamIndex]}
                  </span>
                  에게 점수 부여
                </>
              ) : (
                "점수를 부여할 팀을 선택하세요"
              )}
            </p>
            <RotateCcw
              className={`absolute right-0 top-0 transition-colors ${
                scoreHistory.length > 0
                  ? "text-gray-500 hover:text-gray-700 cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              onClick={() => scoreHistory.length > 0 && handleUndo()}
            />

            {/* 팀 및 점수 버튼 */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {teams.map((team, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTeamIndex(index)}
                  className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ${
                    currentTeamIndex === index
                      ? "bg-pink-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-2">
              {[10, 20, 30, 50].map((points) => (
                <button
                  key={points}
                  onClick={() => handleAddScore(points)}
                  disabled={currentTeamIndex === -1}
                  className="px-4 py-2 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  +{points}점
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 하단 버튼 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={handleResetScores}
              className="w-full bg-pink-300 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-400 transition-colors"
            >
              점수 초기화
            </button>
            <button
              onClick={handleResetGame}
              className="w-full bg-pink-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-500 transition-colors"
            >
              게임 초기화
            </button>
            <button
              onClick={finishGame}
              className="col-span-2 sm:col-auto w-full bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              게임 끝내기
            </button>
          </div>

          {/* 마지막 득점 및 횟수 표시 */}
          <div className="text-center text-sm text-gray-500 space-y-1 pt-4 border-t border-gray-200 mt-6">
            <div>
              <span className="font-semibold">마지막 득점:</span>
              {lastScoreTeam ? ` ${lastScoreTeam}에게 ${lastScore}점` : " 없음"}
            </div>
            <div>
              <span className="font-semibold">총 득점 횟수:</span> {scoreIndex}
              회
            </div>
          </div>
        </div>
      </div>

      {/* 기록 보기 모달 */}
      {isLogVisible && (
        <div className="fixed inset-0 bg-gray-50/90 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b flex justify-start items-center">
              <h2 className="text-xl font-bold">점수 기록</h2>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {actionLog.length > 0 ? (
                <ul className="space-y-3">
                  {actionLog.map((log, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-50"
                    >
                      <div>
                        <span className="font-bold text-pink-600">
                          {log.teamName}
                        </span>
                        <span className="text-gray-700">에게 </span>
                        <span className="font-semibold text-pink-600">
                          +{log.points}점
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {log.timestamp}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">기록이 없습니다.</p>
              )}
            </div>
            <div className="w-full p-4 border-t text-right">
              <button
                onClick={() => setIsLogVisible(false)}
                className="bg-gray-200 text-gray-800 w-full px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 게임 결과 모달 */}
      {isResultVisible && (
        <div className="fixed inset-0 bg-gray-50/90 bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-5 border-b text-center bg-gray-50 rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-800">
                🎉 게임 결과 🎉
              </h2>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <ul className="space-y-3">
                {gameResult.map((result, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg text-lg ${
                      index === 0
                        ? "bg-yellow-100 border-2 border-yellow-300"
                        : index === 1
                        ? "bg-gray-100"
                        : index === 2
                        ? "bg-orange-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold w-8 text-center">
                        {index === 0
                          ? "🏆"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `${index + 1}.`}
                      </span>
                      <span
                        className={`font-semibold ${
                          index === 0 ? "text-yellow-700" : "text-gray-800"
                        }`}
                      >
                        {result.name}
                      </span>
                    </div>
                    <span
                      className={`font-bold ${
                        index === 0 ? "text-yellow-700" : "text-gray-800"
                      }`}
                    >
                      {result.score}점
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-50 border-t grid grid-cols-2 gap-3 rounded-b-lg">
              <button
                onClick={() => setIsResultVisible(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setIsResultVisible(false);
                  handleResetGame();
                }}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                새 게임 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
