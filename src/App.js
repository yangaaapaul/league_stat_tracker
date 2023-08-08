import React, { useState} from 'react';
import axios from 'axios';
import './App.css';
//npm start
function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [rankData, setRank] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [matchDetails, setMatchDetails] = useState([]);
  const API_KEY = "RGAPI-1cba4dce-4111-4056-bf38-4ef2a7d2b8cc"


  async function searchForPlayer(event){
    try{
      const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${searchText}?api_key=${API_KEY}`);
      setPlayerData(response.data);
      const puuid = response.data.puuid;
      const id = response.data.id;
      console.log(puuid)
      fetchMatchHistory(puuid);
      rank(id);
    }
    catch(error){
      console.log(error);
    }
  }
  async function rank(id){
    try{
      const response = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}/?api_key=${API_KEY}`)
      const soloDuoEntry = response.data.find((entry) => entry.queueType === 'RANKED_SOLO_5x5');
      setRank(soloDuoEntry);
    }
    catch(error){
      console.log(error)
    }
  }
  async function fetchMatchHistory(puuid){
    try{
      const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${API_KEY}`);
      setMatchHistory(response.data);
    }
    catch(error){
      console.log(error);
    }
  }
  async function fetchMatchDetails(matchId){
    try{
      const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}/?api_key=${API_KEY}`);
      const participants = response.data.info.participants;
      const playerStats = participants.map((participant) => {
        return {
          summonerName: participant.summonerName,
          kills: participant.kills,
          deaths: participant.deaths,
          assists: participant.assists,
        };
      });
      setMatchDetails(playerStats)
      console.log(playerStats);
      console.log(participants);
    }
    catch(error){
      console.log(error);
    }
  }
  return (
    <div className="App">
      <div className = "container">
        <h5> League of Legends Stat Tracker </h5> 
        <input type = "text" onChange = {e => setSearchText(e.target.value)}></input>
        <button onClick = {e => searchForPlayer(e)}> Search for Players </button>
      </div>
      {JSON.stringify(playerData) !== '{}' ? 
        <>
          <div className = "summoner-info">
            <div className = "summoner-image">
              <img 
                width = "100" 
                height ="100" 
                src = {"http://ddragon.leagueoflegends.com/cdn/13.14.1/img/profileicon/" + playerData.profileIconId+".png"} 
                alt = "pfp" >
              </img>
            </div>
            <div className = "summoner-details">
              <p>{playerData.name}</p>
              
              <p>Level {playerData.summonerLevel}</p>
              <p>{rankData.tier} {rankData.rank}</p>
              <p>{rankData.leaguePoints} LP</p>
              <p>{rankData.wins}W {rankData.losses}L ({Math.round(100*rankData.wins/(rankData.wins +rankData.losses))}%)</p>
          </div>
          </div>
          
          
          {matchHistory.length > 0 ? (
            <div className = "match-container">
              <ul className = "match-history">
                <p>Match History:</p>
                <ul>
                  {matchHistory.map((matchId,index) => (
                    <li key = {index}>{matchId}{' '}
                    <button onClick = {()=>fetchMatchDetails(matchId)}>Get Details</button>
                    
                    </li>
                  ))}
                </ul>
              </ul>
              {matchDetails.length > 0 && (
                <div className = "match-details">
                  <p>Match Details:</p>
                  <ul>
                    {matchDetails.map((playerStat, index) => (
                      <li key={index}>
                        {playerStat.summonerName}: {playerStat.kills}/{playerStat.deaths}/{playerStat.assists}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p> No match history available </p>
          )
          }
        </> 
        :
        <><p>No player data</p></>}
    </div>
  );
}

export default App;
