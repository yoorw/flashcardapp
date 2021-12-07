import {useContext} from 'react';
import {Header} from 'semantic-ui-react';
import { StatsContext } from '../../../../services/StatsContext';


export const TrueStats = () => {
  // this is the entire stats context
  const allStatsState = useContext(StatsContext);

  let total: number = 0;
  let totalRight: number = 0;
  let totalWrong: number = 0;
  let totalSkip: number = 0;

  for(const statsState in allStatsState) {
    if(statsState !== 'dispatch') {
      total++;
      const stats = allStatsState[statsState];
      totalRight += stats.right;
      totalWrong += stats.wrong;
      totalSkip += stats.skip;
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
