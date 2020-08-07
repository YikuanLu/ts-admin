import React, { Suspense } from 'react'
// import { RouteItem } from '@/types'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { Spin } from 'antd'
import { MenuItem } from '@/global'

import ErrorBoundary from '@/components/errorBoundary'

// import routes from '@/router/routes'
import menus from '@/config/menus'

import Login from '@/pages/login'
import BasicLayout from '@/layouts/BasicLayout'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRouter = (data: MenuItem[]): any => data.map((item: MenuItem) => {
  if (item.routes !== undefined) {
    return createRouter(item.routes)
  }
  if (item.component !== undefined) {
    return (
      <Route
        key={item.key}
        exact={item.exact !== undefined ? item.exact : true}
        path={item.path}
        component={item.component}
      />
    )
  }
  return null
})

const RouterView: React.FC = () => (
  <Router>
    {/* 主路由 */}
    <Switch>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/">
        <BasicLayout>
          <Switch>
            <Suspense fallback={<Spin className="global-spin" />}>
              <ErrorBoundary>
                {
                  createRouter(menus)
                }
              </ErrorBoundary>
            </Suspense>
          </Switch>
        </BasicLayout>
      </Route>
    </Switch>
  </Router>
)

export default RouterView
