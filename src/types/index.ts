import { FC } from 'react'

export interface RouteItem {
  path: string;
  name: string;
  key: string;
  exact?: boolean;
  component?: FC;
  routes?: Array<RouteItem>;
}
