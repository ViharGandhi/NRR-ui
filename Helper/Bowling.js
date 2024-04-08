const PointsTableMap = new Map([
    [
      "Chennai Super Kings",
      {
        position: 1,
        matches: 7,
        won: 5,
        lost: 2,
        nrr: 0.771,
        forRuns: 1130,
        forOvers: 133.1,
        againstRuns: 1071,
        againstOvers: 138.5,
        points: 10,
      },
    ],
    [
      "Royal Challengers Bangalore",
      {
        position: 2,
        matches: 7,
        won: 4,
        lost: 3,
        nrr: 0.597,
        forRuns: 1217,
        forOvers: 140,
        againstRuns: 1066,
        againstOvers: 131.4,
        points: 8,
      },
    ],
    [
      "Delhi Capitals",
      {
        position: 3,
        matches: 7,
        won: 4,
        lost: 3,
        nrr: 0.319,
        forRuns: 1085,
        forOvers: 126,
        againstRuns: 1136,
        againstOvers: 137,
        points: 8,
      },
    ],
    [
      "Rajasthan Royals",
      {
        position: 4,
        matches: 7,
        won: 3,
        lost: 4,
        nrr: 0.331,
        forRuns: 1066,
        forOvers: 128.2,
        againstRuns: 1094,
        againstOvers: 137.1,
        points: 6,
      },
    ],
    [
      "Mumbai Indians",
      {
        position: 5,
        matches: 8,
        won: 2,
        lost: 6,
        nrr: -1.75,
        forRuns: 1003,
        forOvers: 155.2,
        againstRuns: 1134,
        againstOvers: 138.1,
        points: 4,
      },
    ],
]);

function RestrictIn(YourTeam,OpponentTeam,RunsToChase,Overs,DesiredPostion)
{
    const teaminfo1 = PointsTableMap.get(YourTeam);
    let teaminfo2 = PointsTableMap.get(OpponentTeam)
    let teaminfo3;
    if(YourTeam===OpponentTeam)
  {
    return ["Invalid","Input"]
  }
    if( DesiredPostion > teaminfo1.position)
    {
      return ["You are already"," above the desired postion"]
    }
    let team;
    let reqnrr;
    if(DesiredPostion -1 > 0)
    {
        for(const[key,value] of PointsTableMap)
        {
            if(value.position===DesiredPostion-1)
            {
                reqnrr = value.nrr;
                team = key;
            }
        }
        if(teaminfo2.position!==DesiredPostion)
        {
            for(const [key,value] of PointsTableMap)
            {
                if(value.position===DesiredPostion)
                {
                    teaminfo2  = PointsTableMap.get(key);
                }
            }
            let lowerlimit;
            let upperlimit;
            if(OpponentTeam===team)
            {
               teaminfo3 = PointsTableMap.get(team);
                lowerlimit = CalculateOver5(teaminfo1,teaminfo3,RunsToChase,Overs);
            }else{
              if(isNaN(reqnrr))
              {
                lowerlimit = CalculateOver4(teaminfo1,RunsToChase,Overs,0.1);
              }else{
                lowerlimit= CalculateOver2(teaminfo1,RunsToChase,Overs,reqnrr)
              }
                
            }
            upperlimit = CalculateOver(teaminfo1,RunsToChase,Overs,teaminfo2.nrr)
           // let upperlimitnrr = CalaculateNrrOver2(teaminfo1,RunsToChase,Overs,upperlimit)
            let ans1 = ` ${YourTeam} need to chase ${RunsToChase} between ${lowerlimit[0]} and ${upperlimit[0]} Overs.`
            let ans2 = `Revised NRR for ${YourTeam} will be between ${upperlimit[1].toFixed(3)} to ${lowerlimit[1].toFixed(3)}.`
            return [ans1,ans2]
        }
        else{
          
          let lowerlimit= CalculateOver2(teaminfo1,RunsToChase,Overs,reqnrr)
           let upperlimit = CalculateOver3(teaminfo1,teaminfo2,RunsToChase,Overs);
           let upperlimitnrr = CalaculateNrrOver2(teaminfo1,RunsToChase,Overs,upperlimit)
           let ans1 = ` ${YourTeam} need to chase ${RunsToChase} between ${lowerlimit[0]} and ${upperlimit} Overs.`
           let ans2 = `Revised NRR for ${YourTeam} will be between ${lowerlimit[1].toFixed(3)} to ${upperlimitnrr.toFixed(3)}.`
           return [ans1,ans2]
        }
        
    }
    
}
function CalculateOver5(teaminfo1,teaminfo2,RunToChase,Overs)
{
  let team1forruns = teaminfo1.forRuns+RunToChase
  let getdecimal =  ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers))*10)/6
  let team1forovers = Math.floor(teaminfo1.forOvers)+getdecimal;
  let team1againstruns = teaminfo1.againstRuns+RunToChase-1;
  getdecimal =  ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers))*10)/6;
  let team1againstovers = Math.floor(teaminfo1.againstOvers)+getdecimal + Overs;
  
  let team2forruns = teaminfo2.forRuns+RunToChase-1
   getdecimal =  ((teaminfo2.forOvers - Math.floor(teaminfo2.forOvers))*10)/6
  let team2forovers = Math.floor(teaminfo2.forOvers)+getdecimal+Overs;
  let team2againstruns = teaminfo2.againstRuns+RunToChase;
  getdecimal =  ((teaminfo2.againstOvers - Math.floor(teaminfo2.againstOvers))*10)/6;
  let team2againstovers = Math.floor(teaminfo2.againstOvers)+getdecimal;

  let s = 0;
  let e = Overs;
  let ans;
  while(s<=e)
  {
     let mid = Math.floor((s+e)/2);
     if(CalaculateNrrOver1(mid,team1forruns,team1forovers,team1againstruns,team1againstovers,team2forruns,team2forovers,team2againstruns,team2againstovers) < 0)
     {
        ans = mid;
        e = mid-1;
     }else{
      s = mid+1;
     }
  }
  let tmp = ans;
  let tmp2 = ans-1;
  let cnt  = 1;
  while(cnt<=6)
  {
    tmp = tmp2 + (cnt/6);
    if(CalaculateNrrOver1(tmp,team1forruns,team1forovers,team1againstruns,team1againstovers,team2forruns,team2forovers,team2againstruns,team2againstovers) > 0)
    {
      ans = tmp2+(cnt/10);
    }
    cnt++;
  }
  let nrr  = calculatenewnrr(ans,team1forruns,team1forovers,team1againstruns,team1againstovers);
  return [ans,nrr];
}
function calculatenewnrr(ans,team1forruns,team1forovers,team1againstruns,team1againstovers)
{
  team1forovers+=ans;
  let nrr1 = (team1forruns/team1forovers)-(team1againstruns/team1againstovers);
  return nrr1;
}
function CalculateOver4(teaminfo1,RunToChase,Overs,ans){
  let team1forruns = teaminfo1.forRuns+RunToChase
  let getdecimal =  ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers))*10)/6
  let team1forovers = Math.floor(teaminfo1.forOvers)+getdecimal;
  let team1againstruns = teaminfo1.againstRuns+RunToChase-1;
  getdecimal =  ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers))*10)/6;
  let team1againstovers = Math.floor(teaminfo1.againstOvers)+getdecimal + Overs;
  let nrr = (team1forruns/team1forovers)-(team1againstruns/team1againstovers);
  return [ans,nrr];
}
function CalaculateNrrOver2(teaminfo1, RunToChase,Overs,lowerlimit)
{
  let team1forruns = teaminfo1.forRuns+RunToChase
  let getdecimal =  ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers))*10)/6
  let team1forovers = Math.floor(teaminfo1.forOvers)+getdecimal;
  let team1againstruns = teaminfo1.againstRuns+RunToChase-1;
  getdecimal =  ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers))*10)/6;
  let team1againstovers = Math.floor(teaminfo1.againstOvers)+getdecimal + Overs;
  team1forovers+=lowerlimit;
  return ((team1forruns/team1forovers)-(team1againstruns/team1againstovers))
}
function CalculateOver3(teaminfo1,teaminfo2,RunToChase,Overs)
{
  let team1forruns = teaminfo1.forRuns+RunToChase
  let getdecimal =  ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers))*10)/6
  let team1forovers = Math.floor(teaminfo1.forOvers)+getdecimal;
  let team1againstruns = teaminfo1.againstRuns+RunToChase-1;
  getdecimal =  ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers))*10)/6;
  let team1againstovers = Math.floor(teaminfo1.againstOvers)+getdecimal + Overs;
  
  let team2forruns = teaminfo2.forRuns+RunToChase-1
   getdecimal =  ((teaminfo2.forOvers - Math.floor(teaminfo2.forOvers))*10)/6
  let team2forovers = Math.floor(teaminfo2.forOvers)+getdecimal+Overs;
  let team2againstruns = teaminfo2.againstRuns+RunToChase;
  getdecimal =  ((teaminfo2.againstOvers - Math.floor(teaminfo2.againstOvers))*10)/6;
  let team2againstovers = Math.floor(teaminfo2.againstOvers)+getdecimal;

  let s = 0;
  let e = Overs;
  let ans;
  while(s<=e)
  {
     let mid = Math.floor((s+e)/2);
     if(CalaculateNrrOver1(mid,team1forruns,team1forovers,team1againstruns,team1againstovers,team2forruns,team2forovers,team2againstruns,team2againstovers) > 0)
     {
        ans = mid;
        s = mid+1;
     }else{
      e = mid-1;
     }
  }
  if(ans===Overs)
  {
    return ans;
  }
  let tmp = ans;
  let tmp2 = ans;
  let cnt  = 1;
  while(cnt<=6)
  {
    tmp = tmp2 + (cnt/6);
    if(CalaculateNrrOver1(tmp,team1forruns,team1forovers,team1againstruns,team1againstovers,team2forruns,team2forovers,team2againstruns,team2againstovers) > 0)
    {
      ans = tmp2+(cnt/10);
    }
    cnt++;
  }
  return ans;

}
function CalaculateNrrOver1(mid,team1forruns,team1forovers,team1againstruns,team1againstovers,team2forrun,team2forovers,team2againstrun,team2againstover)
{
  team1forovers+=mid;
  team2againstover+=mid;
  let nrr1 = (team1forruns/team1forovers)-(team1againstruns/team1againstovers);
  let nrr2 = (team2forrun/team2forovers)-(team2againstrun/team2againstover);
  return nrr1-nrr2;
}
function CalculateOver2(teaminfo1,RunToChase,Overs,reqnrr)
{
    let team1forruns = teaminfo1.forRuns+RunToChase
    let getdecimal =  ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers))*10)/6
    let team1forovers = Math.floor(teaminfo1.forOvers)+getdecimal;
    let team1againstruns = teaminfo1.againstRuns+RunToChase-1;
    getdecimal =  ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers))*10)/6;
    let team1againstovers = Math.floor(teaminfo1.againstOvers)+getdecimal + Overs;
    let againstratio = (team1againstruns/team1againstovers)+reqnrr;
    let ans  = Math.floor(((team1forruns/againstratio)-team1forovers))
    let ans2 =  (team1forruns/(team1forovers+ans))-(team1againstruns/team1againstovers);
    let tmp = ans;
    let cnt = 1;
    let tmp2 = ans
    while(cnt <=6)
    {
        tmp = tmp2+(cnt/6);
        let ansnrr = (team1forruns/(team1forovers+tmp))-(team1againstruns/team1againstovers);
        if(ansnrr  < reqnrr)
        {
            ans = ans + (cnt/10);
           
            return [ans,ansnrr];
        }
        cnt++;
    }
    return [ans,ans2];
}
function CalculateOver(teaminfo1,RunToChase,Overs,nrr)
{

  let s = 0;
  let e = Overs;
  let ans;
  let ansnrr;
  while(s<=e)
  {
    let mid = Math.floor((s+e)/2);
    let val = Calculatenrr(mid,teaminfo1,RunToChase,Overs);
    
    if(val > nrr)
    {
      ansnrr = val;
      ans = mid;
      s = mid+1;

    }else{
      e = mid-1;
    }
  }
    if(ans===Overs)
    {
      return[ans,ansnrr]
    }
    let cnt  = 1;
    let tmp = ans;
    let tmp2 = ans;
    while(cnt<=6)
    {
        tmp = tmp2+(cnt/6);
        let val = Calculatenrr(tmp,teaminfo1,RunToChase,Overs);
        if(val > nrr)
        {
            ansnrr = val
            ans = tmp2+(cnt/10); 
        }
        cnt++;
    }
    return [ans,ansnrr]
    
}

function Calculatenrr(mid,teaminfo1,RunToChase,Overs)
{
  
  let team1forruns = teaminfo1.forRuns+RunToChase
  let getdecimal =  ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers))*10)/6
  let team1forovers = Math.floor(teaminfo1.forOvers)+getdecimal;
  let team1againstruns = teaminfo1.againstRuns+RunToChase-1;
  getdecimal =  ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers))*10)/6;
  let team1againstovers = Math.floor(teaminfo1.againstOvers)+getdecimal + Overs;
  team1forovers+=mid;
  return ((team1forruns/team1forovers)-(team1againstruns/team1againstovers))
}
module.exports = RestrictIn;
