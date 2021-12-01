import Reaact, {useContext} from 'react';
import {Header} from 'semantic-ui-react';
import { CardContext } from "../../../../services/CardContext";
import { StatsContext } from '../../../../services/StatsContext';
import { StatsActionType, StatsType } from "../../../../types";

const blankTrueStats = {
  right: 0,
  skip: 0,
  wrong: 0
};

export const TrueStats = () => {
  // get cards and current index from CardContext
  const {cards, current} = useContext(CardContext);

  // this is the entire stats context
  const allStatsState = useContext(StatsContext);

  console.log(
    '\n !!!>>  TrueStats allStats -  \n', allStatsState,
    '\n !!!>>  TrueStats allStats 1 -  \n', allStatsState[0],
    '\n !!!>>  TrueStats allStats Length -  \n', Object.keys(allStatsState).length,
    '\n !!!>>  TrueStats allStats mapped -  \n', Object.keys(allStatsState).map((stat) => stat),
  )

  let total: number = 0;
  let totalRight: number = 0;
  let totalWrong: number = 0;
  let totalSkip: number = 0;

  for(const statsState in allStatsState) {
    console.log('\n\n THIS IS statsState - \n', statsState)
    if(statsState !== 'dispatch') {
      total++;
      const stats = allStatsState[statsState];
      console.log('\n\n THIS IS stats - \n', stats)
      totalRight += stats.right;
      totalWrong += stats.wrong;
      totalSkip += stats.skip;
      console.log(
        '\n\n THIS IS totalRight - \n', totalRight,
        '\n\n THIS IS type of totalRight  - \n', typeof totalRight,
        '\n\n THIS IS type of stats.right  - \n', typeof stats.right,
        '\n\n THIS IS type of totalRight Added  - \n', totalRight + stats.right,
        '\n\n THIS IS totalWrong - \n', totalWrong,
        '\n\n THIS IS totalWrong - \n', totalWrong,
        '\n\n THIS IS totalSkip - \n', totalSkip,

      )
    }
  };

  return <Header data-testid='truestats' as='h3'
    content={
      <div>
        <div> Total Questions: {total}</div>
        <div> Questions Right: {totalRight}</div>
        <div> Questions Wrong: {totalWrong}</div>
        <div> Questions Skipped: {totalSkip}</div>
      </div>
    }
    />
}

export default TrueStats;
