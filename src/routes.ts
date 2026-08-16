import { createElement } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import RootLayout from './RootLayout'
import Home from './pages/Home'
import Candidates from './pages/Candidates'
import Companies from './pages/Companies'
import Recruiters from './pages/Recruiters'
import Blog from './pages/Blog'
import Roles from './pages/Roles'
import RoleDetailPage from './pages/RoleDetail'
import BlogPost from './pages/BlogPost'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/candidates',
        Component: Candidates,
      },
      {
        path: '/companies',
        Component: Companies,
      },
      {
        path: '/recruiters',
        Component: Recruiters,
      },
      {
        path: '/blog',
        Component: Blog,
      },
      {
        path: '/blog/:slug',
        Component: BlogPost,
      },
      {
        path: '/roles',
        Component: Roles,
      },
      {
        path: '/roles/:roleId',
        Component: RoleDetailPage,
      },
      {
        path: '/.figma/make/kit.html',
        Component: Home,
      },
      {
        path: '*',
        element: createElement(Navigate, { to: '/', replace: true }),
      },
    ],
  },
])
