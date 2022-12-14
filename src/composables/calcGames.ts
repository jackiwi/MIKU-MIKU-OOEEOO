import { ref } from "vue";

const rankupVals = { 'c_val': 200, 'b_val': 240, 'a_val': 280, 's_val': 320 };
const charVals = { 'c_val': 600, 'b_val': 720, 'a_val': 840, 's_val': 960 };

const calcGames = (goal, boostValue, mode) => {
  var vals = rankupVals;
  switch(mode.toLowerCase()){
    case 'rankup':
      vals = rankupVals;
      break;
    case 'char':
      vals = charVals;
      break;
  }
  const c_games = ref({
    games: Math.ceil(goal / (boostValue * vals.c_val)),
    exp: (Math.ceil(goal / (boostValue * vals.c_val))) * (boostValue * vals.c_val)
  });
  const b_games = ref({
    games: Math.ceil(goal / (boostValue * vals.b_val)),
    exp: (Math.ceil(goal / (boostValue * vals.b_val))) * (boostValue * vals.b_val)
  });
  const a_games = ref({
    games: Math.ceil(goal / (boostValue * vals.a_val)),
    exp: (Math.ceil(goal / (boostValue * vals.a_val))) * (boostValue * vals.a_val)
  });
  const s_games = ref({
    games: Math.ceil(goal / (boostValue * vals.s_val)),
    exp: (Math.ceil(goal / (boostValue * vals.s_val))) * (boostValue * vals.s_val)
  });

  return { c_games, b_games, a_games, s_games };
}

export default calcGames;