import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 懒加载页面组件
const PCLogin = lazy(() => import('@/pages/PCLogin'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Product = lazy(() => import('@/pages/Product'));
const Discover = lazy(() => import('@/pages/Discover'));
const DiscoverHome = lazy(() => import('@/pages/Discover/routes/home'));
const Explore = lazy(() => import('@/pages/Discover/routes/explore'));
const Saved = lazy(() => import('@/pages/Discover/routes/saved'));
const Profile = lazy(() => import('@/pages/Discover/routes/profile'));
const About = lazy(() => import('@/pages/About'));

// 路由配置
const routes = [
  // {
  //   path: '/',
  //   element: <Navigate to="/login" replace />,
  // },
  {
    path: '/pc-login',
    element: <PCLogin />,
  },
  {
    path: '/product',
    element: <Product />,
  },
  {
    path: '/',
    element: <Discover />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <DiscoverHome /> },
      { path: 'explore', element: <Explore /> },
      { path: 'saved', element: <Saved /> },
      { path: 'profile', element: <Profile /> },
      { path: 'about', element: <About /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
