import React, { FC, useState, useEffect, } from 'react'

import BraftEditor from 'braft-editor'
import style from './style.module.sass'

const CallerDemo: FC = () => {
  const [teams, setTeams] = useState([{ name: '湖人队' }, { name: '火箭队' }])
  const [showTeam, setShowTeam] = useState(false)
  const [content, setContent] = useState<string>('')
  useEffect((): void => {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 37) {
        console.log('禁止向左的方向键!')
        e.preventDefault()
      }
      // 屏蔽向上的方向键
      if (e.keyCode === 38) {
        console.log('禁止向上的方向键!')
        e.preventDefault()
      }
      // 屏蔽向右的方向键
      if (e.keyCode === 39) {
        console.log('禁止向右的方向键!')
        e.preventDefault()
      }
      // 屏蔽向下的方向键
      if (e.keyCode === 40) {
        console.log('禁止向下的方向键!')
        e.preventDefault()
      }
    })
  }, [])
  return (
    <div style={{ border: '1px solid black' }}>
      <BraftEditor
        // controls={[]}
        onChange={(e): void => {
          const text = e.toText()
          console.log(e.getSelection())
          console.log(e.toRAW(true))
          console.log(e.toJS())
          setContent(text)
          // if (text !== content) { setContent(text) }
          const canShowTeam = text.slice(text.length - 1, text.length) === '@'
          if (canShowTeam) {
            console.log(content)
            console.log(setShowTeam)
            console.log(setTeams)
            console.log(canShowTeam)
          }
        }}
      />
      {
        showTeam && (
          <div className={style.teamWrap}>
            {
              teams.map((item) => <p key={item.name}>{item.name}</p>)
            }
          </div>
        )
      }
    </div>
  )
}

export default CallerDemo
