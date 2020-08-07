import React from 'react'
import RouterView from '@/router'
import errorImg from '@/assets/img/errorImg.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function eventListen(e: any): void {
  if (e.target) {
    if (e.target.tagName?.toLowerCase() === 'img') {
      e.target.src = errorImg
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function eventLoading(e: any): void {
//   if (e.target) {
//     e.target = '加载中'
//   }
// }

window.addEventListener('error', eventListen, true)

// window.addEventListener('load', eventLoading, true)

const App: React.FC = () => (
  <div className="App">
    <RouterView />
  </div>
)

export default App
