import React, { FC } from 'react'
import style from './style.module.sass'

export interface BattleTeams {
  homeTeamName: string,
  homeTeamLogo: string,
  homeTeamScore?: number,
  guestTeamName: string,
  guestTeamLogo: string,
  guestTeamScore?: number,
  isNBA?: boolean,
}

const BattleTeams: FC<BattleTeams> = (props: BattleTeams) => {
  const {
    homeTeamName,
    homeTeamLogo,
    guestTeamName,
    guestTeamLogo,
    homeTeamScore,
    guestTeamScore,
    isNBA
  } = props

  // 主队
  const homeTeam = (
    <div className={style.battleBox} title={homeTeamName}>
      <span>
        [主]
        <img className={style.logo} src={homeTeamLogo} alt="" />
        <span className={style.teamName}>{homeTeamName || '--'}</span>
      </span>
      <span>
        {homeTeamScore || '0'}
      </span>
    </div>
  )

  // 客队
  const guestTeam = (
    <div className={style.battleBox} title={homeTeamName}>
      <span>
        [客]
        <img className={style.logo} src={guestTeamLogo} alt="" />
        <span className={style.teamName}>{guestTeamName || '--'}</span>
      </span>
      <span>
        {guestTeamScore || '0'}
      </span>
    </div>
  )

  // NBA比赛主客队位置对调
  return (
    <div className={style.container}>
      {isNBA ? guestTeam : homeTeam}
      {isNBA ? homeTeam : guestTeam}
    </div>
  )
}

export default BattleTeams
