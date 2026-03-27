import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 四个主页直接导入，预先加载（不使用懒加载，提升切换体验）
import DiscoverHome from '@/pages/Discover/routes/home';
import Explore from '@/pages/Discover/routes/explore';
import Saved from '@/pages/Discover/routes/saved';
import Profile from '@/pages/Discover/routes/profile';
import Search from '@/pages/Discover/routes/search';

const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Product = lazy(() => import('@/pages/Product'));
const Discover = lazy(() => import('@/pages/Discover'));
const About = lazy(() => import('@/pages/About'));
const Help = lazy(() => import('@/pages/Help'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));
const Notifications = lazy(() => import('@/pages/Notifications'));

// 路由配置
const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/product',
    element: <Product />,
  },
  {
    path: '/article/:id',
    element: <ArticleDetail />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  { path: '/help', element: <Help /> },
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
