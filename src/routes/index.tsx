import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 懒加载页面组件
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Login = lazy(() => import('@/pages/Login'));
const PCLogin = lazy(() => import('@/pages/PCLogin'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Product = lazy(() => import('@/pages/Product'));
const Discover = lazy(() => import('@/pages/Discover'));
const DiscoverHome = lazy(() => import('@/pages/Discover/routes/home'));
const Explore = lazy(() => import('@/pages/Discover/routes/explore'));
const Saved = lazy(() => import('@/pages/Discover/routes/saved'));
const Profile = lazy(() => import('@/pages/Discover/routes/profile'));

// 路由配置
const routes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/pc-login',
    element: <PCLogin />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/product',
    element: <Product />,
  },
  {
    path: '/discover',
    element: <Discover />,
    children: [
      { index: true, element: <Navigate to="/discover/home" replace /> },
      { path: 'home', element: <DiscoverHome /> },
      { path: 'explore', element: <Explore /> },
      { path: 'saved', element: <Saved /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
