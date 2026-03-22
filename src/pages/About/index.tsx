import React from "react";
import { NavBar, Button } from "antd-mobile";
import { useObserver } from "mobx-react";
import useStore from "./useStore";
import { useEffectOnce } from "react-use";
import { AboutConst } from "./constant";
import { navigateBack } from "./handle";
import style from "./index.module.scss";

const About: React.FC = () => {
  const store = useStore();

  useEffectOnce(() => {
    console.log("About 页面初始化");
  });

  return useObserver(() => (
    <div className={style.container}>
      <NavBar
        left={<Button onClick={navigateBack}>返回</Button>}
      >
        {store.pageTitle}
      </NavBar>

      <div className={style.content}>
        <div className={style.card}>
          <h1>H5 前端脚手架</h1>
          <p className={style.version}>
            版本: {store.versionInfo.version}
          </p>

          <div className={style.infoSection}>
            <h2>📦 依赖库</h2>
            <div className={style.libraries}>
              <div className={style.library}>
                <div className={style.name}>React</div>
                <div className={style.version}>
                  {store.versionInfo.react}
                </div>
              </div>
              <div className={style.library}>
                <div className={style.name}>TypeScript</div>
                <div className={style.version}>
                  {store.versionInfo.typescript}
                </div>
              </div>
              <div className={style.library}>
                <div className={style.name}>Vite</div>
                <div className={style.version}>
                  {store.versionInfo.vite}
                </div>
              </div>
              <div className={style.library}>
                <div className={style.name}>Ant Design Mobile</div>
                <div className={style.version}>
                  {store.versionInfo.antd}
                </div>
              </div>
              <div className={style.library}>
                <div className={style.name}>MobX</div>
                <div className={style.version}>
                  {store.versionInfo.mobx}
                </div>
              </div>
            </div>
          </div>

          <div className={style.infoSection}>
            <h2>🚀 功能特性</h2>
            <ul className={style.features}>
              {AboutConst.FEATURES.map((feature, index) => (
                <li key={index}>
                  <span className={style.featureIcon}>
                    {feature.icon}
                  </span>
                  <span className={style.featureText}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={style.infoSection}>
            <h2>🤝 开发团队</h2>
            <p className={style.team}>{AboutConst.TEAM_INFO}</p>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default About;
