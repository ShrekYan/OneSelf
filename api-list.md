### 交易支付 (27 个接口)
| POST | `/v1/bank/queryTaxSignAddress` | 查询银行养老账户开户签约链接接口
| POST | `/v1/funds/batchBuyOrder` | 下单+支付（二合一，分批买入专用）
| POST | `/v1/funds/check/payment/result` | 轮询支付结果
| POST | `/v1/user/getFaceConfig` | 获取面容识别授权信息
| POST | `/v1/user/getMiniFaceConfig` | 获取面容识别小程序授权信息
| POST | `/v1/funds/payinfo` | 交易支付路由
| POST | `/v1/funds/checkProductBookLimit` | 产品帐校验接口
| POST | `/v1/funds/queryDefaultAmtList` | 充值买入收银台预填金额
| POST | `/v1/sign/taxTransferSign` | 养老资金缴存签约
| POST | `/v1/transcore/queryIsFirstBuyTaxProduct` | 是否首次购买或定投税延产品
| POST | `/v1/user/queryFaceVerify` | 查询用户是否需要人脸核验
| POST | `/v1/funds/query/assembleResult` | 查询组合投结果
| POST | `/v1/aip/order/list` | 查询计划的定投扣款记录列表
| POST | `/v1/funds/preCheckForBatchBuy` | 下单前校验接口（分批买入专用）
| POST | `/v1/sign/router` | 绑卡路由
| POST | `/v1/sign/sms` | 签约-发送短信
| POST | `/v1/fof/estimatedPersonalPensionPlanMock` | 生成养老金输入页和养老目标制定页数据Mock
| POST | `/v1/sign/taxChangeCardSms` | 税延变更资金账号-发送短信
| POST | `/v1/sign/taxSignUpdate` | 税延变更资金账号-换卡
| POST | `/v1/sign/taxOpenAccountPreCheck` | 税延开户预校验
| POST | `/v1/sign/sign` | 签约
| POST | `/v1/funds/primeLongProfitOrder` | 长盈下单支付(尊享长盈,二合一专用)
| POST | `/v1/funds/topUpShow` | 滚钱宝收银台显示综合接口
| POST | `/v1/funds/order` | 交易下单
| POST | `/v1/funds/finishPay` | 交易支付
| POST | `/v1/funds/purchase` | 交易下单支付
| POST | `/v1/funds/topup` | 滚钱宝充值

### 银行卡 (18 个接口)
| POST | `/v1/bank/mybanks` | 查询用户银行卡列表
| POST | `/v1/bank/queryTaxCardNo` | 一键查询帐户行资金账号
| POST | `/v1/bank/taxTransfer` | 养老资金缴存
| POST | `/v1/bank/queryTaxTransferRecordList` | 养老资金缴存记录与缴存明细
| POST | `/v1/bank/applyUpdate` | 更换银行卡提交申请
| POST | `/v1/bank/queryTaxTransferBankInfos` | 查询养老资金缴存付款账户列表
| POST | `/v1/bank/queryHisUpdRecords` | 查询历史换卡申请记录接口
| POST | `/v1/bank/allBanks` | 查询可签约银行卡列表
| POST | `/v1/bank/getTheSameBanks` | 查询用户与当前银行卡同银行的其他银行卡列表
| POST | `/v1/sms/taxSms` | 养老帐户行发送短信验证码
| POST | `/v1/bank/queryTaxBankBalance` | 查询税延银行卡余额
| POST | `/v1/account/transferActInfo` | 汇款账户查询
| POST | `/v1/bank/verifyForTaxBalance` | 税延余额查询鉴权接口
| POST | `/v1/sign/netPreSign` | 获取网银签约跳转信息
| POST | `/v1/sign/querySignResult` | 获取网银签约跳转签约结果查询
| POST | `/v1/bank/submitApply` | 证明材料提交审核
| POST | `/v1/user/ocrBankCard` | 银行卡orc识别
| POST | `/v1/bank/uploadProveFile` | 银行卡换卡证明材料上传接口

### 基金产品查询 (60 个接口)
| POST | `/v1/caribbean/queryFundAssetAllQuarterlyReportDate` | 查询产品资产分布的所有季报日期
| POST | `/v1/caribbean/queryTransAipIndexValuationAndInvestment` | 产品市场估值查询
| POST | `/v2/fof/detail` | 产品详情查询--组合
| POST | `/v2/product/queryProductFundFile` | 产品资料信息查询
| POST | `/v1/product/saveReservationInfo` | 保存用户订阅信息
| POST | `/v1/product/recommendBondPrds` | 债市风向标-实时行情榜推荐产品
| POST | `/v1/product/queryFuzzyAllProduct` | 关键字模糊查询
| POST | `/v2/product/queryFuzzyAllProduct` | 关键字模糊查询(新版)
| POST | `/v1/product/nav/page` | 分页查询净值列表
| POST | `/org/v1/product/listNav` | 分页查询净值列表_copy
| POST | `/v1/product/qryHisRate` | 历史业绩查询接口
| POST | `/v2/product/queryProductList` | 基金业绩排行及定投排行查询接口
| POST | `/v1/product/queryProductFundFile` | 基金产品资料概要查询
| POST | `/v1/product/queryIndustryHoldingRatios` | 基金全股票持仓/债券持仓数据-持仓占比
| POST | `/v1/product/queryFuzzyFunds` | 基金模糊搜索
| POST | `/v1/product/queryUserBooks` | 批量查询产品订阅状态
| POST | `/v2/product/batchQueryProductFundFiles` | 批量查询产品资料信息
| POST | `/v2/product/queryAssetRecommendList` | 持仓洞察-大类配置-增配XXX资产
| POST | `/v1/product/queryAssetRecommendList` | 持仓洞察-大类配置-相关产品-根据资产大类和用户风险等级推荐产品
| POST | `/v1/product/querySecRefPcsList` | 持仓洞察-持股穿透-查询重仓关联基金列表
| POST | `/v1/product/queryIndexAchievement` | 持仓洞察-行业穿透-行业板块-业绩走势和中证全指对比
| POST | `/v1/product/queryIndexInfoAnalysis` | 持仓洞察-行业穿透-行业板块-查询行业解析
| POST | `/v1/product/queryIndustryRecommendList` | 持仓洞察-行业穿透-行业板块-相关基金
| POST | `/v1/product/queryGuideSearchWord` | 搜索引导文案
| POST | `/v1/gimli/listStrictSelectReason` | 查询严选理由
| POST | `/v1/product/queryProductList` | 查询产品列表
| POST | `/v1/product/querybondAdopByProduct` | 查询产品抱蛋信息
| POST | `/v1/product/queryProductRankTags` | 查询产品排行标签
| POST | `/v1/product/queryProductStatus` | 查询产品状态
| POST | `/v1/product/queryAchievement` | 查询产品的业绩走势和指数比较信息
| POST | `/v2/product/detail` | 产品详情查询--普通基金+投顾
| POST | `/v1/product/queryBondRankList` | 查询人气抱蛋基列表
| POST | `/v1/product/queryElderlyProducts` | 查询养老产品接口
| POST | `/v1/product/nav/list` | 查询净值列表
| POST | `/v1/product/queryValuation` | 查询单只基金估值信息
| POST | `/v1/product/queryFundFile` | 查询基金公告接口
| POST | `/v1/product/queryNavByFundCodeAndDate` | 查询基金净值信息（蚂蚁净值播报使用）
| POST | `/v1/caribbean/fundSecInfo` | 查询基金对应的十大重仓股票/债券
| POST | `/v1/product/fundRanking` | 查询基金打分排行榜（滚滚研究院）
| POST | `/v1/product/investment` | 查询投资组合  【资产/行业分布 里面的行业分布】
| POST | `/v1/compare/queryProductInvestments` | 查询投资组合 资产/行业分布 里面的资产分布
| POST | `/v1/product/productVisibleForUser` | 查询是否可以查看1V1定制高端产品
| POST | `/v1/merchant/queryUserHoldProduct` | 查询用户产品持仓（单产品）
| POST | `/v1/product/queryTaxProducts` | 查询税延产品列表
| POST | `/v1/product/queryExcellentFund` | 查询近三年优秀基金
| POST | `/v1/product/queryProductIndicators` | 查询风险指标信息
| POST | `/v1/product/queryReportInfo` | 根据产品ID查询产品的季报列表
| POST | `/v1/product/queryProductReportDate` | 根据产品ID查询产品的季报日期
| POST | `/v1/product/queryTextInfo` | 根据产品ID查询产品的文本信息
| POST | `/v1/product/queryListByIndexOrTrack` | 根据产品编号查询对应指数或赛道的产品列表
| POST | `/v1/product/checkReservation` | 检查用户是否可设置订阅提醒
| POST | `/v1/product/listCurrentSceneRecommend` | 活期-买产品-机会tab产品查询
| POST | `/v1/caribbean/qryIndexRateByIndexCode` | 海外行情接口
| POST | `/v1/product/queryHotSearchFunds` | 热搜基金
| POST | `/v1/caribbean/queryHotHeavyWeightStocks` | 热门重仓股
| POST | `/v1/product/refHotProducts` | 相关热门推荐接口
| POST | `/v1/product/queryCompressAchievement` | 简易版查询折线图信息接口
| POST | `/v1/product/queryDetailByIds` | 通过产品IDs查询对应的产品列表信息
| POST | `/v1/performance/randomLabelRanking` | 首页业绩排行组件单条接口
| POST | `/v1/index/toolIntegration` | 首页组件聚合接口

### 组合 (50 个接口)
| POST | `/v1/fof/updateSuggestRebalance` | 一键跟调
| POST | `/v1/fof/queryCostPerformanceOfAssets` | 资产性价比
| POST | `/v1/fof/saveUserKycResult` | 保存用户KYC评测结果（问卷式）
| POST | `/v1/aslan/saveUserProtocolInfo` | 保存用户产品协议信息
| POST | `/v1/enjoy/adjustmentSchemeDetail` | 调整方案明细
| POST | `/v1/enjoy/modifyTargetProfitRate` | 修改尊享计划目标收益率
| POST | `/v1/enjoy/stopPrimePlan` | 终止尊享计划接口（作废）
| POST | `/v1/fof/queryFofAdviseMapping` | 组合转投顾匹配投顾列表
| POST | `/v1/tianTianFundApplet/subscribeTtPrime` | 天天尊享订阅接口
| POST | `/v1/enjoy/warehouseBuildingReport` | 尊享建仓报告信息接口
| POST | `/v1/enjoy/queryEarningsReport` | 尊享收益报告信息查询
| POST | `/v1/enjoy/planCompletionReport` | 尊享计划完成报告查询
| POST | `/v1/enjoy/operatePrimePlan` | 尊享计划操作接口（创建/追加/终止/解冻）
| POST | `/v1/enjoy/adjustmentSchemeRecord` | 尊享调整方案记录
| POST | `/v1/enjoy/companionList` | 尊享陪伴列表
| POST | `/v1/enjoy/calculatEstimatedTime` | 尊享预创建接口
| POST | `/v1/guide/queryIndustryParam` | 带你投配置参数接口
| POST | `/v1/fof/splitCheck` | 组合拆单信息核对
| POST | `/v1/fof/BasePensionOption` | 测评页面为用户填充测评条件
| POST | `/v1/fof/queryConfirmationDate` | 查询组合转投顾预计转入确认时间
| POST | `/v1/enjoy/isOpenPrimePlan` | 是否已开启尊享计划
| POST | `/v1/fof/queryKycQuestion` | 查询KYC问卷问题
| POST | `/v1/enjoy/myPlanStatus` | 查询尊享-我的计划（发车页label展示）
| POST | `/v1/enjoy/queryPrimDepart` | 查询尊享发车信息
| POST | `/v1/fof/queryKycSubjectList` | 查询所有配置的KYC专题卡片列表
| POST | `/v1/fof/saveUserAckKycResult` | 保存用户KYC结果（确认式弹框）
| POST | `/v1/fof/queryUserKycResult` | 查询用户的KYC结果
| POST | `/v1/product/queryFofTransferInfo` | 查询用户对应的调仓信息
| POST | `/v1/fof/listDailyRiseAndFall` | 查询投顾日涨跌幅
| POST | `/v1/transcore/querySmallYellowStrip` | 查询滚钱宝详情页冻结小黄条列表
| POST | `/v1/enjoy/queryUserPrimeAsset` | 查询某个尊享计划对应的各期资产数据（持仓列表二级）
| POST | `/v1/enjoy/queryPrimePlanDetails` | 查询最新尊享投顾计划详情
| POST | `/v1/fof/queryStrategyList2` | 查询策略列表
| POST | `/v1/fof/split` | 组合拆单
| POST | `/v1/fof/queryTotalFeeAmt` | 查询累计投顾费
| POST | `/v1/fof/queryAdFeeList` | 分页查询每日投顾费明细
| POST | `/v1/fof/queryAdAmtList` | 分页查询累计收取金额
| POST | `/v1/fof/queryFofAssetStripe` | 查询组合暂停小黄条
| POST | `/v1/merchant/queryUserProductProfitList` | 用户产品收益列表查询
| POST | `/v1/merchant/queryUserProductHoldInfo` | 用户产品持仓信息
| POST | `/v1/fof/queryFofUpDesc` | 投顾升级文案描述查询
| POST | `/v1/product/queryAdFofHoldingInfo` | 查询投顾组合持仓信息（策略配比，持仓明细等）
| POST | `/v1/fof/queryAdPageStrategyInfo` | 查询投顾频道页信息
| POST | `/v1/fof/queryHisOperateFof` | 根据母策略code查询对应的子策略明细
| POST | `/v1/product/saveUserRebalance` | 保存用户调仓信息
| POST | `/v1/fof/queryAdAcctReportList` | 查询投顾报告列表
| POST | `/v1/fof/queryAdReportList` | 查询投顾报告列表-交行模式
| POST | `/v1/fof/queryReportBalance` | 投顾渠道季报详情-天天模式
| POST | `/v1/fof/queryAdReportDetail` | 投顾渠道季报详情-交行模式
| POST | `/v1/fof/queryAcctReportDetail` | 查询投顾指定期的报告详情

### basic查询操作 (17 个接口)
| POST | `/v1/basic/queryCurWorkDate` | 日期相关查询接口
| POST | `/v1/basic/simulateConfig/queryList` | APP/H5配置查询
| POST | `/v1/basic/acquirePublicKey` | 公钥配置获取接口
| POST | `/v1/basic/isTaxTradeTime` | 判断是否在中登交易时间
| POST | `/v1/weChat/authorize` | 微信网页授权
| POST | `/v1/user/queryServiceBoxList` | 我的页面查询服务窗提醒列表
| POST | `/v1/basic/queryNextWorkdays` | 批量查询工作日
| POST | `/v1/basic/resource/queryVideoInformation` | 新增视频信息查询接口
| POST | `/v1/basic/querybossvs` | app升级信息查询
| POST | `/v1/user/reverseServiceBox` | 服务窗反转（包括红点）
| POST | `/v1/basic/resource/queryIconInfo` | 查询单个图标详情接口
| POST | `/v1/basic/queryMpSupportTrade` | 查询小程序是否支持交易开户和用户是否是白名单成员
| POST | `/v1/basic/queryWorkDate` | 查询是否为工作日
| POST | `/v1/basic/queryCustomizationList` | 查询用户定制服务列表
| POST | `/v1/basic/queryAreaInfo` | 根据用户身份证查询区域省市县
| POST | `/v1/basic/operCustomization` | 用户点击订阅/取消订阅
| POST | `/v1/weChat/queryMiniQrCode` | 获取小程序二维码

### 赎回相关 (8 个接口)
| POST | `/v1/funds/redeem` | 基金赎回
| POST | `/v1/funds/checkRedeemQuty` | 基金赎回相关份额信息check
| POST | `/v1/funds/queryAdvanceInfo` | 提现/赎回前，查询垫资信息
| POST | `/v1/funds/predictDate` | 查询相关时间信息：当前系统时间,工作日,预计到账日期
| POST | `/v1/redeem/redeemInfo` | 查询赎回信息
| POST | `/v1/funds/redeemFofSingle` | 组合成分单基金全赎
| POST | `/v1/product/listRedeemIntervention` | 赎回运营干预
| POST | `/v1/funds/estimateRedeemFee` | 预估赎回费

### test (2 个接口)
| POST | `/test` | test
| POST | `/test_1773395580189` | test_copy

### 营销卡券相关 (37 个接口)
| POST | `/v2/user/queryExMoneyDetail` | 查询使用中的体验金详情(活动维度)
| POST | `/v1/marketing/queryRandomQuestionAndAnswer` | 随机知识问答
| POST | `/v1/marketing/updateCardPwdState` | 用户卡密状态更新
| POST | `/v2/marketing/queryCashCouponDetail` | 查询福利金详情（新）
| POST | `/v1/bonus/filterBonusList` | 优惠劵筛选并排序
| POST | `/v1/user/queryExMoneyDetail` | 查询使用中的体验金详情
| POST | `/v1/marketing/cardPwdWithdraw` | 影音卡券充值提现
| POST | `/v2/user/queryExMoneyAvailProductInfo` | 批量查询体验金可用产品列表
| POST | `/v1/bonus/filterBonusListForBatch` | 批量查询福利金
| POST | `/v1/bonus/queryNewBonusDetail` | 查询优惠券适用产品列表
| POST | `/v1/marketing/virtualBonusWithdraw` | 用户虚拟红包提现
| POST | `/v1/marketing/queryBroadcastPage` | 查询奖励播报信息
| POST | `/v1/marketing/queryMyHelpPrize` | 查询助力奖品
| POST | `/v1/marketing/queryAppletPageConfig` | 查询小程序页面配置
| POST | `/v1/marketing/preProductPrize` | 查询详情页分享信息
| POST | `/v1/marketing/transSuccAdShowAndQueryNovice` | 查询交易成功页广告位信息
| POST | `/v1/marketing/generateInviteLink` | 生成邀请好友链接
| POST | `/transSuccWechatShare` | 交易成功页获取分享信息
| POST | `/v1/basic/longLinkToShort` | 长链换短链
| POST | `/v1/marketing/queryPage` | 通过页面Id查询对应的页面配置
| POST | `/v2/bonus/queryBonusPrize` | 查询产品关联的卡券信息
| POST | `/v1/bonus/receiveBonusPrize` | 基金详情页领取卡券
| POST | `/v1/bonus/queryMkmTaskList` | 查询福利任务列表
| POST | `/v1/user/queryExMoneyUseInfo` | 查询用户使用中的体验金
| POST | `/v1/user/queryExMoneyUsedDetail` | 分页查询体验产品使用明细
| POST | `/v1/user/queryMarketingInfo` | 查询用户相关营销信息
| POST | `/v1/bonus/queryBonusListPage` | 单一Bonus类型多页查询Bonus(红包、优惠劵、微信红包、预约码、打折卡等)
| POST | `/v1/user/queryDiscountCardInfo` | 查询用户打折卡信息
| POST | `/v1/user/queryDiscountCardAchieveRecord` | 查询用户单类打折卡的获取明细记录
| POST | `/v1/user/myServicebox` | 用户服务框信息处理接口
| POST | `/v1/marketing/joinShareDzCardActivity` | 参与打折卡分享活动接口
| POST | `/v1/marketing/queryNewInviteRecordList` | 查询用户邀请活动奖励明细接口
| POST | `/v1/user/expiryServiceBox` | 服务框状态翻转接口
| POST | `/v1/user/queryUnCustomizedServiceBox` | 用户非定制服务框信息处理接口（用于处理小红点展示消除）
| POST | `/v1/marketing/queryCashCouponDetail` | 用户福利金详情查询接口
| POST | `/v1/marketing/exchangePrize` | 奖品兑换
| POST | `/v2/bonus/filterBonusList` | 新版优惠劵筛选并排序

### 板块相关 (9 个接口)
| POST | `/v1/plate/queryIconwall` | 全部图标接口
| POST | `/v1/plate/qryBossConfiguration` | 大屏广告、小黄条、成功页广告、浮标BOSS配置统一查询接口
| POST | `/v1/plate/queryBossProductAccompany` | 查询boss陪伴位信息
| POST | `/v1/plate/qryProductRelatePartners` | 查询多页面关联在某个组合上所有正在生效，或者失效的的陪伴。
| POST | `/v1/product/queryCombinationPlateRelate` | 查询板块合并后的数据信息
| POST | `/v1/product/queryCombinationPlateRelate` | 聚合板块接口
| POST | `/v1/plate/queryPlateList` | 获取板块信息
| POST | `/v2/plate/queryPlateList` | 获取板块信息v2
| POST | `/v1/data/dataSelectionFundFootprint` | 足迹模块热门榜单查询接口

### 基金转换 (10 个接口)
| POST | `/v1/convert/operation` | 基金转换
| POST | `/v1/convert/batchOperation` | 批量转换下单
| POST | `/v1/convert/rate` | 查询一个产品到另外一个产品的转换费率信息
| POST | `/v1/convert/avail/quty` | 查询源产品到目标产品的可转换份额
| POST | `/v1/convert/queryConvertType` | 查询转换模式接口
| POST | `/v2/product/convert/list` | 获取可转换的目标基金列表
| POST | `/v1/product/convert/simpleList` | 获取可转换的目标基金列表简易接口
| POST | `/v1/convert/theSameCompany` | 转入产品选择- 同一公司下产品
| POST | `/v1/convert/asset` | 转入产品选择-持仓
| POST | `/v1/convert/attention` | 转入产品选择-自选

### 交易记录 (17 个接口)
| POST | `/v1/trade/dispassionOrderMsg` | 查询冷静期回访小黄条
| POST | `/v1/trade/cancel` | 交易撤单
| POST | `/v1/trade/detail` | 交易记录详情查询
| POST | `/v1/trade/dispassionOrderSubmit` | 冷静期结束-回访确认
| POST | `/v1/trade/list/deal` | 处理过的交易列表
| POST | `/v1/trade/queryUnpaidTrade` | 待支付列表查询
| POST | `/v1/convert/batchOperationCancel` | 批量转换交易撤单接口
| POST | `/v1/trade/queryBatchCoverTranPlanDetail` | 查询交易计划明细详情
| POST | `/v1/trade/list` | 交易记录查询
| POST | `/v1/trade/queryFrozenTpaList` | 查询冻结的目标盈子策略列表
| POST | `/v1/trade/queryInTransitTrade` | 查询在途交易
| POST | `/v1/trade/queryInTransitCount` | 查询在途交易数量
| POST | `/v1/trade/queryBatchCoverInTransitTranPlanList` | 查询在途交易计划列表
| POST | `/v1/trade/queryAdJustSingleInfo` | 查询用户单个指定的调仓信息
| POST | `/v1/trade/queryAdJustInfo` | 查询用户调仓信息
| POST | `/v1/trade/queryToPurPlanList` | 查询预约认购转申购场景任务列表
| POST | `/v1/trade/queryTpaPlanList` | 目标盈投顾任务信息列表查询

### 金币中心相关 (6 个接口)
| POST | `/v1/marketing/issueMkmTask` | 下发任务
| POST | `/v1/marketing/receiveMkmTaskReward` | 任务领奖
| POST | `/v1/crius/queryGoods` | 查询积分商品信息
| POST | `/v1/marketing/queryMkmUserTaskList` | 查询金币中心任务列表
| POST | `/v1/crius/queryTrades` | 积分商品兑换历史记录查询
| POST | `/v1/crius/queryOpenProcessTasks` | 首页查询开户进度条

### 用户信息 (53 个接口)
| POST | `/v1/user/queryUserExtInfo` | 查询用户扩展信息
| POST | `/v1/user/appLogout` | app退出登录
| POST | `/v1/user/saveTempCustomerInfo` | 保存临时保存的实名信息-小程序合投认证
| POST | `/v1/user/saveTpaContinueInvestWill` | 保存用户续投意愿
| POST | `/v1/attention/valuationVarianceFunds` | 关注中估值异动（2%）或优秀卓越产品列表
| POST | `/v1/user/otherMaterials` | 其他材料上传
| POST | `/v1/eventcenter/syncPositionRelatedIndex` | 同步持仓相关指数接口
| POST | `/v1/user/stuRegister` | 学生用户注册（带学生证上传入口）
| POST | `/v1/user/uploadCertInfo` | 完善客户资料-身份证详细地址
| POST | `/v1/user/miniLogin` | 小程序登录
| POST | `/v1/user/autoGetPhone` | 快捷注册获取手机号
| POST | `/v1/user/batchSummaryOperating` | 批量更新用户产品概要阅读状态
| POST | `/v1/eventcenter/updateRemindExpiredTime` | 批量订阅通知任务的更新过期时间，直接更新过期时间为当前时间
| POST | `/v1/eventcenter/attentionIndexList` | 指数关注列表及提醒接口
| POST | `/v1/survey/submit` | 提交风评问卷
| POST | `/v1/eventcenter/attention4Index` | 新增关注指数接口
| POST | `/v1/user/summaryOperating` | 更新用户产品概要阅读状态
| POST | `/v1/user/queryTempCustomerInfo` | 查询临时保存的实名信息-小程序合投认证
| POST | `/v1/user/queryUserTaxResidentDetails` | 查询居民税收身份详情  （我的资料、风测页面）
| POST | `/v1/user/checkModifyMobileBehavior` | 查询检查用户修改手机号行为
| POST | `/v1/aslan/queryUserAgeRange` | 查询渠道客户年龄区间
| POST | `/v1/eventcenter/queryIndexAttentionInfos` | 查询用户关注指数列表接口
| POST | `/v1/eventcenter/userAttentionProIdList` | 查询用户关注的产品编号列表
| POST | `/v1/merchant/queryAdPrdPerformance` | 查询用户单个投顾 产品持仓业绩表现
| POST | `/v1/attention/newAttentionList` | 查询用户基金关注列表
| POST | `/v1/user/queryWaitConfirmTpaPlanList` | 查询用户待确认续投的目标盈任务列表
| POST | `/v1/user/ocrIdPhoto` | ocr身份证识别
| POST | `/v1/user/hasSubscribed` | 查询用户是否已订阅接口
| POST | `/v1/sign/taxExtensionSignStatus` | 查询用户税延卡签约状态
| POST | `/v1/ingress/queryEconSum` | 查询用户节省费用
| POST | `/v1/user/queryCustomizeDetail` | 查询用户订阅明细信息接口
| POST | `/v1/merchant/queryUserBillInfo` | 查询用户账单信息
| POST | `/v1/eventcenter/queryProdAssetTagGroupProductIdListBySort` | 查询组内基金排序接口
| POST | `/v1/eventcenter/queryAssetClasschangeList` | 查询资产分类变更列表接口，接口不分页
| POST | `/v1/user/qryAccStatus` | 检查用户是否能销户
| POST | `/v1/product/checkRiskMatch` | 检查用户风险等级是否匹配
| POST | `/v1/code/code2.htm` | 生成验证码(转base64)
| POST | `/v1/user/register` | 用户注册
| POST | `/v1/user/login` | 用户登录
| POST | `/v1/user/xeSdkLogin` | 用户登录-小鹅通登录态
| POST | `/v1/user/signUsTax` | 用户签署非美协议
| POST | `/v1/user/addSubFile` | 用户订阅单个文件接口
| POST | `/v1/basic/location` | 用户详情页面填写常量
| POST | `/v1/user/upgradeZoUser` | 直销升级-开通交易密码
| POST | `/v1/user/validateZoPassword` | 直销密码登录
| POST | `/v1/basic/queryToken` | 苔也获取token
| POST | `/v1/basic/queryOpenId` | 获取openId授权
| POST | `/v1/user/getUserInfo` | 获取用户详细信息
| POST | `/v1/user/setFileSort` | 设置自定义金刚位接口
| POST | `/v1/user/closeAccount` | 销户
| POST | `/v1/user/faceOperating` | 面容操作（新增、修改、关闭）
| POST | `/v1/user/faceLogin` | 面容登录
| POST | `/v1/user/getUserType` | 验证码校验

### 预约赎回 (5 个接口)
| POST | `/v1/arp/checkResRedeem` | check是否能够创建预约赎回
| POST | `/v1/arp/qryArpNum` | 查询预约提现有效笔数、最近执行日及笔数
| POST | `/v1/arp/list` | 预约提现协议列表查询接口
| POST | `/v1/arp/operation` | 预约提现协议新增或修改接口
| POST | `/v1/arp/detail` | 预约提现协议详情查询接口

### 营销活动相关 (37 个接口)
| POST | `/v1/marketing/queryActivityJoin` | 查询新手注册奖励弹窗
| POST | `/v1/marketing/issueSharePrize` | 下发分享奖励
| POST | `/v1/user/finishTaskNotify` | 任务完成通知接口
| POST | `/v1/user/checkTaskStatus` | 任务状态检查接口
| POST | `/v1/marketing/joinInviteActivity` | 参加邀请好友活动
| POST | `/v1/marketing/queryInviteRanking` | 员工福利榜单排名
| POST | `/v1/marketing/isExistAipMk` | 定投创建成功活动
| POST | `/v1/marketing/signUpGrowthActivity` | 成长值提升活动报名
| POST | `/v2/marketing/queryUserGrowthUpgradeInfo` | 新查询成长值升级有礼活动信息
| POST | `/v1/marketing/queryLatestAdvertReportByAdvertType` | 查询marketing最新报告配置接口
| POST | `/v1/marketing/queryAdvertReportList` | 查询专题报告列表根据报告类型
| POST | `/v1/marketing/queryAdvertReportByAdvertId` | 查询专题报告根据专题ID
| POST | `/v1/marketing/queryAdvertById` | 查询专题页信息
| POST | `/v1/marketing/queryHelpShare` | 查询小程序分享信息
| POST | `/v1/marketingAdvert/queryAllNums` | 查询所有已发布周报期数 以及信息
| POST | `/v1/marketingAdvert/queryAdvertInfo` | 查询投顾周报
| POST | `/v1/marketing/queryWinPublicity` | 查询播报公示信息
| POST | `/v1/marketing/queryDiscountCardList` | 查询收银台打折卡
| POST | `/v1/marketing/queryAdvertReportCardInfoByType` | 专题页报告卡片详情查询
| POST | `/v1/marketing/queryActivityInfo` | 查询活动信息
| POST | `/v1/marketing/queryUserActivityPrizeInfo` | 查询活动奖品信息
| POST | `/v1/marketing/queryActivityRuleById` | 查询活动规则
| POST | `/v1/weChat/judgeIsSubscribe` | 查询活动订阅模板
| POST | `/v1/user/queryUserTaskList` | 查询用户任务列表
| POST | `/v1/marketing/queryUserVipLevelInfo` | 查询用户会员成长值信息
| POST | `/v1/marketing/queryUserGrowthUpgradeInfo` | 查询用户成长值阶梯奖励信息
| POST | `/v1/marketing/queryInviteActivity` | 查询邀请好友活动信息
| POST | `/v1/marketing/queryMyInvitePrizeInfo` | 查询邀请活动累计奖励信息
| POST | `/v1/marketing/apply` | 活动报名接口
| POST | `/v1/marketing/getActivityPrize` | 活动领奖接口
| POST | `/v1/user/generateUrlSchema` | 生成H5跳小程序urlSchema
| POST | `/v1/marketing/successShare` | 落地页分享成功
| POST | `/v1/marketing/prepareSharePrize` | 预计分享活动
| POST | `/v1/marketing/receiveActivityReward` | 领取活动阶梯奖励
| POST | `/v1/marketing/queryMkmActivity` | 转盘抽奖查询活动信息
| POST | `/v1/marketing/queryMyDrawPrizes` | 转盘抽奖类活动查询奖励信息
| POST | `/v1/marketing/drawMkmActivity` | 转盘抽奖

### 配置信息 (4 个接口)
| POST | `/v1/basic/queryAppConfig` | APP配置信息AppConfig
| POST | `/v1/basic/queryH5Config` | 查询h5配置信息
| POST | `/v1/basic/queryBizSwitchConfig` | 查询业务开关配置
| POST | `/v1/app/queryAppBizConfig` | 获取APPbiz配置

### 资产查询 (57 个接口)
| POST | `/v1/fof/listBatchConvertAsset` | 查询批量转换的可赎回基金列表
| POST | `/v1/asset/queryUserAsset` | 查询用户资产
| POST | `/v1/merchant/queryPredictProfitDate` | 基金收益日预估查询接口
| POST | `/v2/asset/hasSignUsTax` | 用户是否签署了非美
| POST | `/v1/merchant/queryTopUserHoldInfo` | 财富月报-top收益率持仓信息
| POST | `/v2/merchant/queryUserProfitSrcByProd` | 账户分析-区间收益构成--产品数据查询接口V2
| POST | `/v1/asset/queryAssetByAssetCategory` | 根据资产大类类型查询用户资产列表
| POST | `/v1/merchant/queryFofSubProdDailyProfit` | 查询组合成分基金日收益明细
| POST | `/v1/merchant/queryLiteAsset` | 查询简版资产
| POST | `/v1/merchant/querySubListOfFof` | 投顾成分基金列表收益详情查询
| POST | `/v1/asset/queryUserAssetOfHighEnd` | 查询用户高端资产详情
| POST | `/v1/asset/queryAssetSummary` | 查询用户资产分类汇总信息
| POST | `/v1/merchant/listPensionAsset` | 养老资产列表
| POST | `/v1/osdc/queryAssetProofType` | 查询用户拥有的全渠道资产类型
| POST | `/v1/merchant/queryTradeAcct` | 查询交易账号
| POST | `/v1/asset/queryOsdcSummaryAsset` | 查询其他渠道持有的中欧基金产品
| POST | `/v1/merchant/queryInvestmentRateList` | 查询用户投资收益率列表
| POST | `/v1/merchant/queryHistoryProfitList` | 查询用户历史收益列表
| POST | `/v1/merchant/queryOpenTaStatus` | 查询开户状态
| POST | `/v1/merchant/openTradeAcctForFund` | 单基开交易账号
| POST | `/v1/asset/querySmartAccompany` | 查询新资产页自动化陪伴信息
| POST | `/v1/asset/queryHasCurrencyAssets` | 查询是否有滚钱宝资产（已登录则返回资产详细信息）
| POST | `/v1/asset/querySpecifiedFundList` | 查询浮动费率产品中间页资产
| POST | `/v1/merchant/queryTaxDeferredAsset` | 税延资产查询接口
| POST | `/v1/merchant/queryTalentRanking` | 账号分析-理财达人榜TOP10
| POST | `/v1/merchant/queryChooseFunds` | 投资透视-查询用户选基表现
| POST | `/v2/asset/queryUserAsset` | 新的查询用户资产-组合
| POST | `/v1/merchant/queryTpaAssetList` | 根据目标盈母策略code查询子策略资产列表
| POST | `/v1/trade/queryDueTransList` | 定期已到期资产列表
| POST | `/v1/merchant/queryOpenAcctDate` | 查询开户日期
| POST | `/v1/merchant/queryMonthProfitByCate` | 财富月报-月度收益构成--品类
| POST | `/v1/merchant/queryMonthProfitByProd` | 财富月报-月度收益构成--单品
| POST | `/v1/merchant/queryMonthProfitTrend` | 财富月报-月度区间收益走势数据
| POST | `/v1/merchant/queryUserProfitList` | 账户分析-查询用户收益列表
| POST | `/v1/merchant/queryAssetPieChart` | 持仓洞察-大类配置-指定日期对应的用户大类资产和建议模型配置
| POST | `/v1/gimli/listHoldingIndustry` | 持仓洞察-行业穿透-查询行业分布列表
| POST | `/v1/gimli/listHeavyHolding` | 持仓洞察-持股穿透-查询重仓股票
| POST | `/v1/osdc/genAssetProofFile` | 生成资产证明文件及电子证明或者纸质证明申请
| POST | `/v1/asset/queryAssetIndex` | 资产首页展示
| POST | `/v1/compare/queryAchievements` | 业绩走势
| POST | `/v1/enjoy/queryAccountPerformance` | 尊享账户业绩
| POST | `/v1/enjoy/queryDynamicPullback` | 尊享动态回撤接口
| POST | `/v1/merchant/frozenList` | 查询冻结列表
| POST | `/v1/asset/currencyAssets` | 滚钱宝资产接口
| POST | `/v1/enjoy/queryProdMomentProfit` | 尊享根据日期和产品查询用户收益
| POST | `/v1/merchant/queryUserCateAsset_1646804860692_1646804905542` | 账户分析-指定日期对应的大类资产查询接口_copy_copy
| POST | `/v1/merchant/queryTalentHoldInfo` | 账号分析-理财达人榜持仓详情
| POST | `/v1/merchant/queryDrawdown` | 投资透视-查询用户回撤归因
| POST | `/v1/merchant/queryUserAssetSummary` | 账户分析-账户资产概览查询接口
| POST | `/v1/merchant/queryUserProfitSummary` | 账户分析-账户收益概览查询接口
| POST | `/v1/merchant/queryUserProfitTrend` | 账户分析-区间收益走势数据查询接口
| POST | `/v1/merchant/queryUserProfitSrcByProd` | 账户分析-区间收益构成--产品数据查询接口
| POST | `/v1/merchant/queryUserProfitSrcByCate` | 账户分析-区间收益构成--品类数据查询接口
| POST | `/v1/merchant/queryUserAcctHis` | 账户分析-区间资产历史查询接口
| POST | `/v1/merchant/queryUserCateAsset` | 账户分析-指定日期对应的大类资产查询接口
| POST | `/v2/merchant/queryAbleQutyDetail` | 查询用户某一产品可用份额明细-新
| POST | `/v1/merchant/setQutyRedMethod` | 设置份额明细对应的到期处理方式

### 大数据相关 (15 个接口)
| POST | `/v1/guide/thisWeekView` | 查询本周观点配置信息
| POST | `/v1/gimli/batchQueryTags` | 批量查询场景标签
| POST | `/v1/gimli/queryTransTagFreq` | 投资透视-用户交易标签
| POST | `/v1/gimli/queryIndexComponents` | 指数成分股列表查询接口，支持分页
| POST | `/v1/gimli/queryIndexCapitalFlow` | 查询主力资金流向
| POST | `/v1/gimli/queryProductTag` | 查询产品标签
| POST | `/v1/gimli/queryUserFirstTrade` | 查询客户首次交易行为
| POST | `/v1/gimli/queryTransAchievement` | 投资透视-查询用户交易时点
| POST | `/v1/gimli/queryUserProductTags` | 查询用户产品对应的标签信息
| POST | `/v1/gimli/queryUserBrowsingProduct` | 查询用户浏览产品
| POST | `/v1/gimli/hotSearch` | 热门搜索
| POST | `/v1/gimli/recommendProducts` | 猜你喜欢产品推荐
| POST | `/v1/gimli/browseProduct` | 用户浏览产品采集
| POST | `/v1/ad/submitAdForm` | 线索api转化-提交表单
| POST | `/v1/ad/viewAdPage` | 线索api转化-浏览页面

### 外部合作渠道 (2 个接口)
| POST | `/v1/external/queryUserAuthInfo` | 外部合作渠道用户信息查询
| POST | `/v1/external/authLogin` | 授权登录

### 定投交易 (16 个接口)
| POST | `/v1/aip/list` | 查询定投列表
| POST | `/v1/aip/next/withhold` | 下一扣款日计算
| POST | `/v1/aip/cancelBatchBuy` | 取消分批买入计划
| POST | `/v1/aip/cancelBatchBuy_1775035405795` | 取消分批买入计划_copy
| POST | `/v1/aip/operation` | 定投操作接口
| POST | `/v1/aip/detail` | 定投计划详情
| POST | `/v1/aip/queryIndexByNextWorkDate` | 查询下一工作日对应的扣款周期索引
| POST | `/v1/aip/qryAipList` | 查询单个定投计划
| POST | `/v1/aip/queryBatchBuyPlanList` | 分批买入计划列表
| POST | `/v1/aip/aipCount` | 查询是否有定投计划-返回定投条数
| POST | `/v1/aip/qryAipNum` | 查询有效定投笔数、最近扣款日及笔数
| POST | `/v1/aip/queryBatchBuyPlanDetail` | 查询某个分批买入计划详情
| POST | `/v1/marketing/checkAipMk` | 校验是否能参与定投活动-同时返回已持有的定投记录
| POST | `/v1/aip/queryMultipleAipList` | 根据活动id查询可参与的定投计划
| POST | `/v1/aip/aipSpecialCount` | 特殊定投计划数量及协议号
| POST | `/v1/aip/cancelPlpOrder` | 长盈计划预约撤销/冻结撤销

### 基金分红 (5 个接口)
| POST | `/v1/melon/modifyMelonType` | 修改分红方式
| POST | `/v1/melon/queryMelonType` | 查询分红方式
| POST | `/v2/melon/queryMelonType` | 查询分红方式V2
| POST | `/queryMelonType` | 查询分红方式（含有到期处理方式）
| POST | `/v1/melon/modifyDueProcMode` | 设置到期处理方式

### 水滴教育 (2 个接口)
| POST | `/v1/fof/submitEduFundEvaluation` | 测评页-方案提交
| POST | `/v1/fof/queryEduFundEvaluation` | 测评页-算法计算

### 基金经理 (3 个接口)
| POST | `/v1/product/successiveManagers` | 历任基金经理
| POST | `/v2/product/queryManager` | 基金经理详情
| POST | `/v1/product/queryManagerViewList` | 查询最近观点

### 基金分析 (2 个接口)
| POST | `/v1/product/queryAnalysisIndicators` | 基金分析指标
| POST | `/v1/compare/queryDetails` | 基金对比详情

### 指数 (32 个接口)
| POST | `/v1/osdc/queryFundRealTimeValuation` | 查询基金实时估值
| POST | `/v1/caribbean/queryMarketWeatherCalender` | 债市天气日历查询
| POST | `/v1/caribbean/queryAllIndexRealTimeInfo` | 实时刷新
| POST | `/v1/caribbean/queryChangeIndexList` | 异动指数列表
| POST | `/v1/caribbean/queryIndexRealTimeTrendBackInfos` | 当日行情回放
| POST | `/v1/caribbean/batchQueryBondIndexCurve` | 批量查询债券指数曲线
| POST | `/v1/caribbean/queryIndexClosingPriceInfo` | 指数业绩曲线接口
| POST | `/v1/caribbean/indexInterpretationLineChart` | 指数交易热度走势图接口
| POST | `/v1/caribbean/queryIndexHistoryMarket` | 指数历史行情
| POST | `/v1/osdc/queryCompressAchievementIndex` | 指数实时估值走势缩略图接口
| POST | `/v1/osdc/queryComposite4Any` | 指数实时涨跌幅查询
| POST | `/v1/gimli/queryIndexChangeTag` | 指数异动标签列表
| POST | `/v1/caribbean/queryIndexRankingList` | 指数排行列表查询接口
| POST | `/v1/caribbean/queryBondMarketCurve` | 查询债市历史行情曲线
| POST | `/v1/caribbean/queryMarketWeather` | 查询债市天气
| POST | `/v1/caribbean/queryMarketWeatherMatrix` | 查询债市天气矩阵
| POST | `/v1/caribbean/queryMarketIndexs` | 大盘指数列表-场景
| POST | `/v1/caribbean/queryIndexMarket` | 查询指数估值
| POST | `/v1/caribbean/listIndexValuationGroup` | 查询指数估值里面的分组
| POST | `/v1/caribbean/queryIndexRefFundInfoList` | 查询指数关联基金列表接口
| POST | `/v1/caribbean/qryIndexRate` | 查询指数收益率简单接口
| POST | `/v1/caribbean/queryIndexMarketRanking` | 查询指数行情排行
| POST | `/v2/caribbean/queryIndexMarketRanking` | 查询指数行情排行2
| POST | `/v1/caribbean/queryIndexDetail` | 查询指数详情接口
| POST | `/v1/caribbean/queryIndexTrend` | 查询指数详情接口-指数估值走势查询
| POST | `/v1/caribbean/showIndex` | 查询是否存在指数行情
| POST | `/v1/caribbean/qryIndexByTagCode` | 查询标签推荐指数接口
| POST | `/v1/gimli/queryIndexTagLatestRealTime` | 查询盘中实时播报接口
| POST | `/v1/index/queryHotIndex` | 热点指数接口（每日）
| POST | `/v1/caribbean/watchlistIndexTickerBar` | 自选页行情条列表接口
| POST | `/v1/caribbean/queryExistQuickTag` | 获取指数快捷标签列表
| POST | `/v1/caribbean/queryGoldPrize` | 金价信息查询

### 数据榜单 (6 个接口)
| POST | `/v1/product/qryHotRank` |  热门赛道榜单详情接口
| POST | `/v1/product/queryFundsRankingInfo` | 业绩排行页查询加仓榜、定投榜等榜单信息
| POST | `/v1/product/queryMatchRankingInfo` | 查询产品匹配的榜单信息接口
| POST | `/v1/product/queryRankingInfo` | 查询大家都在买/大家都在看等数据榜单
| POST | `/v1/product/checkMatchRanking` | 检查产品是否匹配当前榜单
| POST | `/v1/product/queryTrackRankRecommend` | 赛道榜单推荐接口

### 大事件 (3 个接口)
| POST | `/v1/eventcenter/queryRemindRecordList` | 大事提醒列表(/v1/transcore/queryRemindRecordList)
| POST | `/v1/eventcenter/queryRemindCodeList` | 查询提醒任务大类型
| POST | `/v1/transcore/queryRemindJumpLink` | 查询提醒跳转链接

### 智能提醒 (13 个接口)
| POST | `/v1/gimli/queryIndexChangeTagRemindList` | 查询指数异动提醒列表接口
| POST | `/v1/transcore/productRemind` | 产品智能提醒设置
| POST | `/v1/eventcenter/queryProductRemindTaskList` | 批量查询产品提醒任务接口（收拢带你投提醒任务）
| POST | `/v1/eventcenter/remindTaskOperation` | 智能提醒批量订阅
| POST | `/v1/eventcenter/queryRemindList` | 查询eventcenter订阅列表（订阅集合页面）
| POST | `/v1/eventcenter/queryProductRemindTask` | 查询产品的提醒任务
| POST | `/v1/transcore/productItemRemind` | 产品某一项的智能提醒设置
| POST | `/v1/gimli/queryIndexChangeTagDetailList` | 查询指数异动详情页-异动列表接口
| POST | `/v1/eventcenter/queryRemindTaskList` | 查询用户设置的提醒任务(产品列表)
| POST | `/v1/eventcenter/viewRemindStatus` | 查询订阅状态
| POST | `/v1/eventcenter/queryRemindTaskListForUser` | 用户订阅信息查询
| POST | `/v1/eventcenter/remindOperate` | 订阅操作  订阅或者取消订阅
| POST | `/v1/eventCenter/queryTrackRemindTaskList` | 赛道智能提醒

### fof机构相关 (22 个接口)
| POST | `/v1/orgFof/deleteOrgAccountInfo` | 机构开户-删除机构资料
| POST | `/v1/orgFof/changeSubDetail` | 修改机构户信息（邀请码）
| POST | `/v1/orgFof/queryProductOrgInfoList` | 查询产品户列表
| POST | `/v1/orgFof/saveOrgAccountInfo` | 机构开户-机构资料上传
| POST | `/v1/orgFof/queryOrgAccountInfo` | 机构开户-开户资料查询
| POST | `/v1/orgFof/create` | 机构开户-创建机构
| POST | `/v1/orgFof/saveManagerRoleInfo` | 机构开户-保存管理员信息
| POST | `/v1/orgFof/saveBeneficiaryInfo` | 机构开户-账户受益人信息录入
| POST | `/v1/orgFof/saveBankInfo` | 机构开户-保存银行账户信息
| POST | `/v1/orgFof/saveManagerInfo` | 机构开户-保存经办人信息
| POST | `/v1/orgFof/saveResidentTaxInfo` | 机构开户-保存机构居民涉税信息
| POST | `/v1/orgFof/saveInvestorInfo` | 机构开户-保存投管人信息
| POST | `/v1/orgFof/saveControllerInfo` | 机构开户-保存实控人信息
| POST | `/v1/orgFof/queryOrgInfo` | 机构信息查询
| POST | `/v1/orgFof/saveRiskTest` | 机构开户-保存风险测评信息
| POST | `/v1/orgFof/queryOrgEnumInfo` | 查询机构相关枚举
| POST | `/v1/orgFof/saveBaseInfo` | 机构开户-基本信息录入
| POST | `/v1/orgFof/submit` | 提交审核
| POST | `/v1/orgFof/queryExistBeneficiaryInfo` | 查询存在的受益人信息
| POST | `/v1/orgFof/queryExistManagerInfo` | 查询存在的经办人信息
| POST | `/v1/orgFof/queryExistInvestorInfo` | 查询存在的投管人信息
| POST | `/v1/orgFof/queryExistControllerInfo` | 查询存在的实控人信息

### 会员相关 (18 个接口)
| POST | `/v1/marketing/detailCard` | 查询卡密
| POST | `/v1/crius/listPrivilegeByBenefitType` |  查询尊享 [尊享产品]【养老专区】【商旅出行】权益列表接口
| POST | `/v1/marketing/giveLike` | 文章点赞和取消点赞
| POST | `/v1/member/exchange` | 权益兑换接口
| POST | `/v1/marketing/listMemberActivity` | 查询会员活动
| POST | `/v1/member/queryReceiveRecords` | 查询会员特权领取记录
| POST | `/v1/member/queryMemberConfigInfo` | 查询会员配置及用户成长值信息
| POST | `/v1/member/queryPrivilegeList` | 查询免费权益列表接口
| POST | `/v1/marketing/listRetirementActivity` | 查询养老活动
| POST | `/v1/member/queryDragonPassUrl` | 使用权益获取龙腾免登地址接口
| POST | `/v1/member/queryPrivilegePackage` | 查询权益包信息
| POST | `/v2/member/queryReceiveRecords` | 查询权益领取记录
| POST | `/v1/member/queryPrivilegeDetail` | 查询特权详情接口
| POST | `/v1/member/queryGrowthTasks` | 查询用户成长值任务列表信息
| POST | `/v1/member/queryGoodListByPrivilegeType` | 根据特权类型查询对应的商品列表
| POST | `/v1/member/queryLabelInfoListByTypes` | 根据特权类型（含权益包）查询标签列表
| POST | `/v1/member/FortuneColumn` | 黑金会员财富专栏-市场点评和深度研究报告列表
| POST | `/v1/member/FortuneColumn_1662464470740` | 黑金会员财富专栏-市场点评和深度研究报告列表_copy

### 账户助手 (3 个接口)
| POST | `/v1/osdc/queryReckonAv` | 查询基金实时估值
| POST | `/v1/transcore/queryAccountHelperList` | 查询账户助手列表接口
| POST | `/v1/transcore/operateAccountHelper` | 记录前端点击账户助手行为并进行操作

### 年度 (1 个接口)
| POST | `/v1/annual/selectAnnualAcct` | 年度账单

### 交易式定投 (7 个接口)
| POST | `/v1/transcore/queryTradeAipSchedule` | 交易式定投进度查询(陪伴)
| POST | `/v1/product/queryTransAipProductInfos` | 查询交易式定投产品池
| POST | `/v1/asset/queryUserAssetOfFund` | 查询单基金持仓详情(不包含高端和定期产品)
| POST | `/v1/merchant/queryVirCodeByOutCode` | 查询外部业务场景码接口
| POST | `/v1/attention/transAipAttentionList` | 查询用户交易式定投关注（持仓）产品列表
| POST | `/v1/asset/queryUserAssetOfFof` | 查询组合持仓详情
| POST | `/v1/merchant/taxCheck` | 税延购买check接口

### 在线客服入口 (12 个接口)
| POST | `/v1/fof/queryFinancialEntryConfig` | 查询是否需要展示理财师入口
| POST | `/v1/user/isAssignGroup` | 人组判断接口
| POST | `/v1/onlineService/shunt` | 在线客服接口
| POST | `/v1/financialPlanner/msgReminder` | 小红点查询接口
| POST | `/v1/product/listIMRiskWarningFileConfig` | 查询IM风险提示的文件配置列表
| POST | `/v1/ingress/isCusStf` | 查询是否管户
| POST | `/v1/gimli/isCusStf` | 判断是否是管户（后续废弃）
| POST | `/v1/service/financial` | 查询理财师跳转链接接口
| POST | `/v1/financial/queryInviteCodeInfo` | 查询理财师邀请码信息
| POST | `/v1/financial/queryBookingStatus` | 查询理财师预约状态
| POST | `/v1/financial/info` | 查询管户关联理财师信息
| POST | `/v1/financial/booking` | 预约理财师接口

### 定投卡卷 (7 个接口)
| POST | `/v1/bonus/queryAipCouponDetail` | 使用卡卷编号 查询定投卷详情
| POST | `/v1/bonus/queryAipBonusList` | 查询产品可用定投券列表（收银台使用）
| POST | `/v1/aip/queryValidBonusList` | 查询定投计划可用的定投福利金信息
| POST | `/v1/aip/specialList` | 查询当前卡卷可以新增定投协议的产品列表
| POST | `/v1/aip/queryCouponDetail` | 查询当前定投协议绑定的定投卷信息
| POST | `/v1/aip/filterAvailBonus` | 筛选计划可绑定的卡券信息
| POST | `/v1/aip/useAipCoupon` | 绑定定投协议

### 带你投 (20 个接口)
| POST | `/v1/guide/thisWeekView` | 本周观点接口
| POST | `/v1/guide/signalInterpretation` | 信号解读接口
| POST | `/v1/guide/historicalDeparture` | 历史发车接口
| POST | `/v1/tianTianFundApplet/getGuideInvestmentSubscribeStatus` | 天天带你投查询订阅状态
| POST | `/v1/tianTianFundApplet/subscribeOrUnsubscribeGuideInvestment` | 天天带你投订阅/取消订阅
| POST | `/v1/guide/guideInvestmentPlanList` | 带你投计划列表
| POST | `/v1/guide/commonQuestion` | 常见问题
| POST | `/v1/guide/revenueReport` | 收益报告接口
| POST | `/v1/guide/latestSignal` | 最新信号接口
| POST | `/v1/guide/worthInvesting` | 本周值得投接口
| POST | `/v1/guide/signalInterpretationLineChart` | 历史估值/交易热度分位数 折线图查询
| POST | `/v1/guide/querySecondTrackList` | 查询赛道列表接口
| POST | `/v1/guide/usersSubTrackList` | 用户订阅赛道列表接口
| POST | `/v1/guide/queryIndustrySimpleInfo` | 行业简单信息接口
| POST | `/v1/guide/trackLeaderboard` | 赛道带你投榜单接口
| POST | `/v1/guide/aggregatedTrackList` | 赛道带你投聚合赛道列表接口
| POST | `/v1/guide/queryTrackChance` | 赛道找机会接口
| POST | `/v1/guide/queryTrackChanceParam` | 赛道找机会配置接口
| POST | `/v1/guide/trackSearch` | 赛道搜索接口
| POST | `/v1/guide/companionList` | 陪伴列表（计划详情和持仓页）

### 稳健理财频道 (8 个接口)
| POST | `/v1/product/queryFixIncomeManager` | 基金-稳健理财  查询固收名将
| POST | `/v2/product/managerList` | 基金经理列表-新
| POST | `/v1/product/queryFinancialPreferredProductList` | 基金-稳健理财页面-获取安稳理财和稳中求进模块内容
| POST | `/v1/product/specialArea` | 严选(安稳理财/稳重求进)分类的二级页面 内容区
| POST | `/v1/product/specialAreaHigherProfit` | 严选(安稳理财/稳重求进)分类的二级页面 推荐区：收益高一点，最求更高收益
| POST | `/v2/product/queryRegularList` | 定期专题页
| POST | `/v1/product/queryRegularProfitPage` | 定期盈页面
| POST | `/v1/product/queryFinancialDetailList` | 品类分类产品排行页面

### 全明星智慧跟投 (4 个接口)
| POST | `/v1/allStar/historyDepart` | 历史发车接口
| POST | `/v1/allStar/departDetail` | 最新发车接口
| POST | `/v1/allStar/queryIndexValuationList` | 查询估值枚举
| POST | `/v1/allStar/companionList` | 系统陪伴列表（本周观点和收益报告）

### 基金风险等级变更弹窗提示 (2 个接口)
| POST | `/v1/eventcenter/queryRiskLevelChangeRemindPopup` | 基金风险等级变更-获取是否弹窗
| POST | `/v1/transcore/closeRiskLevelChangeRemindPopup` | 我知道了 --关闭弹窗提醒

### 幸福周周投 (8 个接口)
| POST | `/v1/weekly/ownerPrincipalAchievementCurve` | 主理人业绩曲线查询接口
| POST | `/v1/weekly/ownerPrincipalAchievement` | 主理人业绩查询接口
| POST | `/v1/weekly/queryBondSignalDetail` | 债市信号查询接口
| POST | `/v1/weekly/historyDepart` | 历史发车接口
| POST | `/v1/weekly/departDetail` | 发车详情接口
| POST | `/v1/aip/supplyBuyManual` | 手动补投
| POST | `/v1/aip/qryTradeAipSimpleDetail` | 查询简单定投列表
| POST | `/v1/weekly/fofDepartImitateSplit` | 用户发车买入卖出金额份额明细

### 资产诊断 (33 个接口)
| POST | `/v1/fof/withDrawConfig` | 最大容忍度列表接口
| POST | `/v1/fof/queryTransferRatio` | FOF大类基准资产占比查询(10档)
| POST | `/v1/diagnosis/accountPerformanceLineChart` | 账户表现折线图接口
| POST | `/v1/asset/parseAssetData` | 解析资产数据
| POST | `/v1/basic/whitelistCheck` | 白名单校验接口
| POST | `/v1/user/editSubAccount` | 修改子账户接口
| POST | `/v1/product/fuzzyMatchingFundList` | 模糊匹配基金列表
| POST | `/v1/user/deleteSubAccount` | 删除子账户接口
| POST | `/v1/asset/syncZoPosition` | 同步中欧资产接口
| POST | `/v1/asset/syncPosition` | 同步账户资产
| POST | `/v1/gimli/importUserAsset` | 导入用户资产接口
| POST | `/v1/gimli/supportedChannels` | 查询资产诊断支持的渠道列表
| POST | `/v1/fof/openSuggestFofService` | 开通/关闭资产诊断服务-->开勇关闭建议型投顾服务
| POST | `/v1/gimli/listAnalysisReport` | 查询资产诊断书列表接口
| POST | `/v1/gimli/holdFundDiagnosis` | 持基诊断接口
| POST | `/v1/user/createSubAccount` | 新增子账户接口
| POST | `/v1/gimli/queryUserAsset` | 查询用户资产（含外部资产）
| POST | `/v1/user/querySubAccountList` | 查询子账户列表
| POST | `/v1/user/querySubAccountDetail` | 查询子账户详情
| POST | `/v1/gimli/queryHasZoAllAsset` | 查询是否有中欧全资产持仓
| POST | `/v1/gimli/queryHasZoFundAsset` | 查询是否有中欧财富资产接口
| POST | `/v1/gimli/isHighNetWorth` | 查询是否高净值
| POST | `/v1/gimli/queryPositionProducts` | 查询用户持仓产品列表
| POST | `/v1/fof/queryAdAcct` | 查询用户服务账户签约状态(直接用查询投顾主账号接口了 修改入参出参)
| POST | `/v1/assetDiagnosis/abTest` | 资产诊断abtest接口
| POST | `/v1/assetDiagnosis/overviewOptimizeAdvise` | 优化建议总览
| POST | `/v1/assetDiagnosis/marketInterpretation` | 市场解读
| POST | `/v1/gimli/configAdvise` | 持仓优化建议页-配置建议   （持仓诊断那里的大类也用这个）
| POST | `/v1/gimli/industryAdvise` | 行业建议
| POST | `/v1/product/listAssetRecommendProduct` | 专属优化建议-新增配置-推荐产品
| POST | `/v1/gimli/listExcellentPosition` | 专属优化建议-优秀持仓
| POST | `/v1/gimli/listSpecialChange` | 专属优化建议-关注异动
| POST | `/v1/product/listFofSpecialProduct` | 全部(投顾)精选池

### 股债性价比 (2 个接口)
| POST | `/v1/stockBondRatio/content` | 内容接口
| POST | `/v1/stockBondRatio/historicalTrend` | 股债性价比 查询历史趋势

### 其他 (10 个接口)
| POST | `/v1/common/genChildEnumByClass` | 子类枚举查询接口
| POST | `/v1/common/calDateDays` | 日期-天数计算
| POST | `/v1/common/genEnumByClass` | 枚举转换接口
| POST | `/v1/product/toolBoxSet` | 查询工具箱
| POST | `/v1/product/querySamePromotionLabelList` | 查询相同推品标签关联产品信息
| POST | `/v1/osdc/checkAssetsExist` | 校验用户是否符合要求的中欧资产
| POST | `/v1/sms/send` | 短信验证码发送
| POST | `/v1/userCheck/queryUserStatusByCertNo` | 通过证件号查询用户状态接口
| POST | `/v1/userCheck/queryUserStatusByCertNo_1691569721223` | 通过证件号查询用户状态接口_copy
| POST | `/v1/osdc/listHoldingByCertNo` | 通过身份证查询中欧基金持仓

### 基金打标和基金诊断 (26 个接口)
| POST | `/v1/fundDiagnosis/earningAndRiskTip` | 收益能力和抗风险性 的小助手内容
| POST | `/v2/fundDiagnosis/earningAndRiskTip` | 	 查询收益能力、风险控制、性价比、规模及费率等tab指标数据
| POST | `/v1/product/listManagerAward` | 基金经理奖项信息
| POST | `/v1/fundDiagnosis/listFundHoldTopTen` | 基金诊断 前10大持仓
| POST | `/v1/fundDiagnosis/search` | 基金诊断 模糊查询
| POST | `/v1/fundDiagnosis/industryPreference` | 基金诊断 行业偏好
| POST | `/v2/fundDiagnosis/industryPreference` | 基金诊断 行业偏好V2
| POST | `/v1/fundDiagnosis/detail` | 基金诊断详情接口
| POST | `/v2/fundDiagnosis/detail` | 基金诊断详情接口_v2版本
| POST | `/v1/fundDiagnosis/listSharpeRatioInfo` | 夏普比率信息
| POST | `/v1/fundDiagnosis/listInvestmentResearchViewpoint` | 市场机会-投研观点
| POST | `/v1/fundDiagnosis/positionAnalysis` | 持仓分析 里面的 持股集中 行业偏好 风格特征标签 
| POST | `/v2/fundDiagnosis/positionAnalysis` | 持仓分析 里面的 持股集中 行业偏好 风格特征标签V2版本
| POST | `/v1/fundDiagnosis/listDrawdown` | 产品回撤数据
| POST | `/v1/fundDiagnosis/listAnnualPerformance` | 查询 收益能力里面的年度表现 年度表现
| POST | `/v1/product/queryProductClass` | 查询产品分类类别
| POST | `/v1/compare/queryRanking` | 查询基金比较热门基金信息
| POST | `/v1/fundDiagnosis/listFundAssetAllocation` | 查询基金资产分布
| POST | `/v1/fundDiagnosis/listProductAssociatedIndex` | 查询对应基金关联的指数
| POST | `/v1/fundDiagnosis/queryPositionStability` | 查询持仓稳定性、持仓分析等指标数据
| POST | `/v1/product/queryTrackIndexValuation` | 查询指数基金 跟踪指数信息
| POST | `/v2/fundDiagnosis/comprehensiveDiagnosis` | 查询新基金诊断三维图及重点指标
| POST | `/v1/fundDiagnosis/specialFocus` | 特别关注  （规模变动，机构持仓，经理异动）
| POST | `/v1/fundDiagnosis/comprehensiveDiagnosis` | 综合诊断雷达图(五维图)
| POST | `/v1/attention/attentionList` | 自选 用户关注的产品
| POST | `/v1/fundDiagnosis/listHighDrawdown` | 高端产品回撤数据

### T0货币(滚钱宝+)和货债 (9 个接口)
| POST | `/v1/merchant/listT0Yield` | 查询T0七日年化走势接口
| POST | `/v1/basic/queryTradeDate` | 查询交易日期
| POST | `/v1/merchant/everHoldProduct` | 查询历史是否持有过某产品
| POST | `/v1/trade/queryReminder` | 查询平衡信息（监控提醒日期）
| POST | `/v1/fof/fastRedeemInfo` | 查询投顾快取信息 快取额度+银行卡信息
| POST | `/v1/trade/queryGqbTradeInfo` | 查询滚钱宝/滚钱宝+交易记录
| POST | `/v1/merchant/queryGqbUpgradeStatus` | 查询用户滚钱宝升级状态
| POST | `/v1/transcore/gqbUpgrade` | 滚钱宝升级接口
| POST | `/v1/melon/queryMelonList` | 滚钱宝收益记录（分红）

### 高端专区 (2 个接口)
| POST | `/v1/financial/queryWechatCode` | 查询理财师二维码
| POST | `/v1/marketing/queryHighEndActivity` | 查询高端专区活动内容

### 市场温度计 (5 个接口)
| POST | `/v1/fof/historyTemperatureTrend` | 查询历史温度走势
| POST | `/v1/fof/simpleTemperature` | 查询基础温度信息（其他页面用的）
| POST | `/v1/marketTemperature/config` | 查询市场温度计配置
| POST | `/v1/fof/listIndexTemperature` | 查询指数模块列表
| POST | `/v1/fof/temperature` | 温度计当前温度+历史温度接口+历史温度买入效果

### 机构线上交易平台 (80 个接口)
| POST | `/org/v1/trade/batchRedeem` | 机构批量赎回下单（需要登录验证）
| POST | `/org/v1/fof/listFof` | （投顾首页）投顾列表
| POST | `/org/v1/cif/whetherRealName` | 验证机构用户是否实名
| POST | `/org/v1/aslan/cart/batchQueryCost` | 购物车明细-查询费率、费用
| POST | `/org/v1/aslan/cart/removeByProduct` | 购物车-根据产品删除购物车
| POST | `/org/v1/cif/user/queryRelOrgRole` | 用户管理-查询投管人下产品户涉及角色信息
| POST | `/org/v1/cif/user/check/list` | 用户管理-复核员列表
| POST | `/org/v1/cif/user/queryInvestorInfoRecord` | 查询投管人材料备案开关
| POST | `/v1/charge/queryProductRate` | 查询单个产品费率及折扣
| POST | `/org/v1/aslan/cart/fail` | 分页查询失败购物车列表
| GET | `/v1/basic/clearMenuAndAuthCheckCache` | 机构菜单、鉴权刷新缓存接口
| POST | `/org/v1/cif/delOrgStatus` | 删除产品户
| POST | `/org/v1/aslan/cart/redeemResult` | 机构批量赎回结果查询
| POST | `/org/v1/cif/switchUserStageTwo` | 机构切换登录用户步骤二：构建切换用户的登录态
| POST | `/org/v1/cif/switchUserStageOne` | 机构切换登录用户步骤一：查询该角色下的所有机构账户
| POST | `/org/v1/cif/user/changeInvestorInfoRecord` | 投管人材料是否备案修改
| POST | `/org/v1/trade/payInfo` | 基金收银台手续费、费率
| POST | `/org/v1/product/fuzzySearchFund` | 基金模糊搜索
| POST | `/org/v1/aslan/cart/batchAdd` | 批量添加购物车
| POST | `/org/v1/aslan/cart/uploadExcel` | 批量添加-上传excel接口
| POST | `/org/v1/trade/preCheckforBatchPurchase` | 批量下单预校验（机构）：适当性校验
| POST | `/org/v1/cif/loginInStageOne` | 登录一阶段-验密并返回机构户/产品户列表&登录人id
| POST | `/org/v1/cif/loginInStageTwo` | 登录二阶段-选择机构户/产品户，建立登陆态
| POST | `/v1/code/graphCode.htm` | 获取新的滑块图形验证码接口
| POST | `/v1/code/verifyGraphCode.htm` | 校验滑块图形验证码
| POST | `/org/v1/cif/checkMobileAndIdCard` | 校验手机号与证件号
| POST | `/org/v1/cif/resetPwd` | 重置登录交易或重置交易密码（忘记密码后）
| POST | `/org/v1/cif/logOut` | 退出账户登录
| POST | `/org/v1/trade/exportExcelForTradeRecords` | 导出交易记录Excel
| POST | `/org/v1/trade/exportTradeAcceptReceipts` | 导出批量申请交易回单（压缩包）
| POST | `/org/v1/trade/batchAudit` | 批量复核
| POST | `/org/v1/trade/setTradeBillConfig` | 对账单发送设置
| POST | `/org/v1/trade/queryTradeBillConfig` | 对账单设置查看
| POST | `/org/v1/trade/queryTradeBills` | 查询对账单(最近一年)
| POST | `/org/v1/trade/exportTradeBill` | 下载对账单文件
| POST | `/org/v1/trade/queryPageUntreatedOrders` | 分页查询待处理交易（待处理交易笔数&当日待转账金额）
| POST | `/org/v1/trade/purchase` | 基金&投顾交易购买（机构）
| POST | `/org/v1/trade/batchModifyMelonType` | 批量修改分红方式
| POST | `/org/v1/trade/batchPurchase` | 批量下单
| POST | `/org/v1/fof/fofSplitUpdate` | 拆单明细保存
| POST | `/org/v1/trade/redeem` | 基金&投顾赎回（机构）
| POST | `/org/v1/trade/convert` | 转换&超级转换（机构）
| POST | `/org/v1/trade/ceilingNotification` | 通知栏吸顶
| POST | `/org/v1/trade/cancel` | 撤单（机构）
| POST | `/v1/product/listFundCompany` | 基金筛选  查询基金公司候选信息
| POST | `/finrecon/queryLRBankTransferByPage.do` | boss查询汇款明细接口
| POST | `/finrecon/queryLRRefundOnAcct.do` | boss查询客户退款明细
| POST | `/finrecon/updateBankTransfer.do` | boss客户退款明细更新接口
| POST | `/v1/orgFof/checkOrgLogonExist` | 机构检查手机号是否注册
| POST | `/v1/basic/queryStaffMenus` | 机构线上交易平台菜单查询接口
| POST | `/v1/orgFof/finalSave` | 最终保存机构信息（同步缓存到cif提交接口）
| POST | `/v1/orgFof/saveRoleInfo` | 保存角色信息
| POST | `/org/v1/merchant/listOrgHoldFofAsset` | 资产总览-投顾持仓列表
| POST | `/org/v1/merchant/listOrgHoldFundAsset` | 资产总览-基金持仓列表
| POST | `/org/v1/merchant/orgAsset` | 资产总览-查询总资产
| POST | `/org/v1/product/listFilterFund` | 基金筛选
| POST | `/org/v1/attention/listAttentionProduct` | 机构交易 关注产品列表
| POST | `/org/v1/downloadExcel/attentionProductListReport` | Excel导出-自选导出
| POST | `/org/v1/downloadExcel/filterFundListReport` | Excel导出功能 基金筛选 
| POST | `/org/v1/downloadExcel/holdAssetReport` | Excel导出功能 客户持有资产的导出
| POST | `/org/v1/downloadExcel/fofHoldDetailReport` | Excel导出功能 组合-持仓明细（持仓的成分基金）的导出
| POST | `/org/v1/orgTrade/productDetail` | 机构交易产品详情
| POST | `/org/v1/aslan/cart/add` | 购物车-新增
| POST | `/org/v1/aslan/cart/edit` | 购物车-编辑
| POST | `/org/v1/aslan/cart/remove` | 购物车-删除
| POST | `/org/v1/aslan/cart/list` | 购物车-列表
| POST | `/org/v1/aslan/cart/exist` | 购物车-判断基金产品是否在购物车中
| POST | `/org/v1/cif/user/list` | 用户管理-列表
| POST | `/org/v1/cif/user/add` | 用户管理-新增
| POST | `/org/v1/cif/user/edit` | 用户管理-修改
| POST | `/org/v1/cif/user/cancel` | 用户管理-注销
| POST | `/org/v1/cif/user/password/reset` | 用户管理-重置登录/交易密码
| POST | `/org/v1/cif/user/password/change` | 用户管理-修改登录/交易密码
| POST | `/org/v1/cif/user/check/mobile` | 用户管理-验证手机号是否存在
| POST | `/org/v1/merchant/tradeAcct/list` | 基金账户-开户列表
| POST | `/org/v1/merchant/tradeAcct/register` | 基金账户-开户
| POST | `/org/v1/cif/change/mod` | 设置复核模式
| POST | `/org/v1/cif/trade/email/list` | 回单发送邮箱列表
| POST | `/org/v1/cif/trade/email/edit` | 回单发送邮箱设置
| POST | `/v1/orgFof/ocrBusinessLicense` | 营业执照OCR识别

### 渠道小程序 (2 个接口)
| POST | `/v1/branch/miniProgram/login` | 渠道小程序登录接口
| POST | `/v1/branch/assetDiagnosis/confirm` | 资产诊断报告确认接口

### 财富管家 (4 个接口)
| POST | `/v1/merchant/listProfitCalender` | 收益日历（日历，月历，年历）
| POST | `/v1/merchant/listProfitCalenderPage` | 收益日历（日历，月历，年历）_-新
| POST | `/v1/merchant/queryUserProfitSimple` | 查询区间收益以及收益率
| POST | `/v1/merchant/queryUserStartHoldPositionDate` | 查询持仓起始时间

### 养老相关 (16 个接口)
| POST | `/v1/fof/hasPensionInvestmentPlan` | 查询是否完成养老测评接口
| POST | `/v1/attention/customSort` | 关注列表用户自定义排序
| POST | `/v1/fof/queryPensionInvestmentPlan` | 查询养老规划投资方案
| POST | `/v1/fof/querySuperPension` | 查询养老评估报告
| POST | `/v1/fof/queryEstimatedPensionPlan` | 查询养老评估报告入参
| POST | `/v1/fof/queryIncomeSatisfyPensionSyFlag` | 查询当前用户年收入是否满足税优条件
| POST | `/v1/fof/queryRecommendPensionFund` | 查询推荐投资产品方案 --税优投资 --补充投资
| POST | `/v1/fof/queryCitySupportTaxDeferral` | 查询支持个税递延的城市/地区
| POST | `/v1/basic/listPensionServiceBox` | 养老服务窗列表
| POST | `/v1/eventcenter/listUserBehavior` | 查询用户行记录
| POST | `/v1/fof/queryTdfPensionFund` | 查询目标日期养老目标产品
| POST | `/v1/fof/queryTrfPensionFund` | 查询目标风险养老目标产品
| POST | `/v1/fof/estimatedPensionInvestmentPlan` | 生成养老规划投资方案
| POST | `/v1/fof/estimatedPersonalPensionPlan` | 生成养老评估报告
| POST | `/v1/eventcenter/recordUserBehavior` | 用户行为记录
| POST | `/v1/fof/oldCalInit` | 社保养老金计算器初始化接口

### 尊享财务规划 (24 个接口)
| POST | `/v1/fof/queryMonteCarlo` | 查询蒙特卡洛曲线
| POST | `/v1/fof/modifyFinancialPlan` | 修改财务规划方案
| POST | `/v1/fof/batchOpenReopenSubAcct` | 批量开通投顾策略账号       fof       里面包含批量重新签约
| POST | `/v1/fof/batchListFofReport` | 批量查询投顾协议列表（查询多个投顾的投顾协议）       从fof取
| POST | `/v1/product/batchCheckRiskMatch` | 批量进行风险等级的校验 （当前仅支持批量投顾）       单个校验的接口
| POST | `/v1/funds/listPayResult` | 支付结果列表
| POST | `/v1/merchant/listChildEducationFundAsset` | 查询子女教育资产       从merchant获取
| POST | `/v1/merchant/queryisCustomerNew` | 查询客户是否是新客（财务规划场景）
| POST | `/v1/basic/queryLocationByMobile` | 查询手机号归属地
| POST | `/v1/fof/queryAssetConfig` | 查询收益回撤期限映射
| POST | `/v1/financialPlanning/detailPlanResult` | 查询方案结果详情--> 用于已解锁和未解锁的方案页      
| POST | `/v1/fof/queryHasFinancialPlanningScheme` | 查询是否有财务规划方案
| POST | `/v1/financialPlanning/listRecommendFof` | 已解锁方案页 风险应急金财富增值推荐产品       从fof取数据： fof需要查product拿到规则，包装后返回给我
| POST | `/v1/fof/queryFinancialPlanStatus` | 查询财务规划服务签约与解锁状态
| POST | `/v1/financialPlanning/wealthIncrementAsset` | 查询财富增值资产       
| POST | `/v1/merchant/listRiskEmergencyFundAsset` | 查询风险应急金资产       从merchant获取
| POST | `/v1/user/financialPlan/login` | 理财师登录
| POST | `/v1/financialPlanning/batchPurSplit` | 目标配置方案的查询（批量下单那个产品查询）       
| POST | `/v1/user/financialPlan/getUserInfo` | 获取用户信息（轻量）
| POST | `/v1/fof/fofServiceLockOrUnlock` | 解锁方案       投顾服务加锁和解锁       fof
| POST | `/v1/fof/fofFinancialPlan` | 财务规划问卷查询/保存
| POST | `/v1/gimli/queryWealthIncreaseDetails` | 财富增值方案详情
| POST | `/v1/fof/queryAssetDiagnosisConfig` | 资产诊断配置结果查询
| POST | `/v1/funds/preValidPayPasswordAndStatus` | 预检查交易密码和状态校验 + 提前批量预占

### 投顾解约 (5 个接口)
| POST | `/v1/fof/fofSplitTargetFund` | 投顾指定基金拆单
| POST | `/v1/fof/queryCanDisengage` | 查询当前投顾账户是否可以解约
| POST | `/v1/fof/queryFofEngageInfo` | 查询投顾解约信息
| POST | `/v1/fof/disEngageFofAccountBatch` | 解约投顾账户
| POST | `/v1/fof/reEngageFofAccountBatch` | 重新签约

### 私募-专户接口合集 (16 个接口)
| POST | `/v1/esignature/getOrder` | 获取电子合同信息
| POST | `/v1/merchant/listHighEndAsset` | 查询高端资产列表
| POST | `/v1/esignature/queryStatus` | 查询电子合同签署状态
| POST | `/v1/esignature/getFileUrl` | 查看单个已签署文件url
| POST | `/v1/cif/saveQualifiedConfirm` | 合格投资者确认状态保存接口
| POST | `/v1/cif/saveQualifiedInvestorInfo` | 合格投资者资料上传保存接口 
| POST | `/v1/cif/queryQualifiedInvestorInfo` | 合格投资者资料查询接口
| POST | `/v1/cif/autoAuthUserQualify` | 查询用户的投资经历和资产是否合格
| POST | `/cif/level/queryQualifiedInvestorConfirmForBoss.do` | 合格投资者资料查询接口-认证材料-boss
| POST | `/cif/level/modifyPlan.do` | 投资者类型变更接口-boss
| POST | `/cif/level/queryQualifiedInvestorOpr.do` | 合格投资者资料查询接口-操作列表-boss
| POST | `/v1/eventcenter/listSignedFundContract` | 查询用户已签署的基金合同       查询用户第一次签署的基金合同
| POST | `/v1/product/highProductList` | 查询高端产品列表
| POST | `/v1/product/riskDisclosureBook` | 查询风险揭示书内容
| POST | `/v3/plate/queryPlateList` | 第三代板块接口 目前用于 基金频道 高端理财
| POST | `/basic/fileRetrieveBase64.do` | 文件base64获取-boss

### mobile-文件上传下载 (3 个接口)
| POST | `/v1/fileUpload/static` | web类文件上传-可以通过static路径直接访问
| POST | `/v1/fileUpload/inner` | 内部文件上传-无法通过static路径访问
| POST | `/v1/fileRetrieve/base64` | 文件获取-base64

### 用户行为相关 (7 个接口)
| POST | `/v1/user/saveUserTaxResidentDetails` | 保存居民税收身份详情  （我的资料、风测页面）
| POST | `/v1/data/eventTracking` | 埋点收集
| POST | `/v1/user/checkNewTransferMode` | 查询客户是否签署新大额转账模式接口
| POST | `/v1/eventcenter/queryUserChoice` | 查询用户相关选择
| POST | `/v1/user/changeUserExtInfo` | 用户修改个人信息
| POST | `/v1/data/collectByLog` | 用户行为数据上报
| POST | `/v1/user/saveNewTransferMode` | 记录客户同意使用新大额转账模式接口

### 再平衡接口合集 (4 个接口)
| POST | `/v1/fof/rebalance` | 再平衡 
| POST | `/v1/fof/rebalanceResult` | 再平衡结果 和再平衡试算结果 
| POST | `/v1/fof/cancelRebalance` | 撤销再平衡委托 
| POST | `/v1/fof/needRebalance` | 是否需要再平衡 

### 人社需求接口集合 (9 个接口)
| POST | `/v1/merchant/listAllZoTaxAsset` | 中欧全渠道税延资产列表
| POST | `/v1/trade/listZoSaleChannel` | 交易记录渠道列表
| POST | `/v1/trade/listTaxTrade` | 人社需求交易记录列表（中欧财富渠道或者非中欧财富渠道）
| POST | `/v1/channel/queryChannelUserInfo` | 查询第三方渠道客户信息（目前仅人社）
| POST | `/v1/merchant/queryESocialCardTotalYield` | 电子社保卡查询历史累计收益
| POST | `/v1/merchant/queryESocialCardDailyYield` | 电子社保卡查询日收益列表
| POST | `/v1/user/channelLogin` | 第三方渠道登录
| POST | `/v1/merchant/detailTaxUserAsset` | 非中欧财富渠道 税延资产详情
| POST | `/v1/trade/taxTradeDetail` | 非中欧财富渠道交易详情

### 条件选基 (6 个接口)
| POST | `/v1/product/selectFund/querySelectResult` | 条件选基结果接口（业绩排行、定投排行的产品列表查询）
| POST | `/v1/product/selectFund/queryFundCompanyList` | 查询基金公司列表
| POST | `/v1/product/selectFund/recentUsedConditionList` | 查询最近使用条件列表
| POST | `/v1/product/selectFund/queryConditionList` | 查询条件枚举列表
| POST | `/v1/product/selectFund/queryRankConditionList` | 查询标签列表（业绩、定投排行页上方的标签列表）
| POST | `/v1/product/selectFund/queryHotConditionList` | 查询热门条件列表

### 广告接入 (1 个接口)
| POST | `/v1/ad/appStart` | app应用首次启动

### 费率 (3 个接口)
| POST | `/v1/charge/queryChargeFee` | 查询交易费率
| POST | `/v1/product/rate` | 查询费率机构
| POST | `/v1/charge/queryHighProductRate` | 查询高端基金详情页多档费率接口

### 新财务规划 (12 个接口)
| POST | `/v2/financialPlan/queryDefaultKycResult` | 查询用户默认kyc结果
| POST | `/v2/financialPlan/saveAssetAllocationKyc` | 保存财务规划KYC结果接口
| POST | `/v2/financialPlan/queryAssetDetail` | 查询大类资产明细接口
| POST | `/v2/financialPlan/queryMeasureEffect` | 查询方案测算效果接口
| POST | `/v2/financialPlan/queryHasKycResult` | 查询是否做过财务规划KYC接口（新）
| POST | `/v2/financialPlan/queryHasFinancialAsset` | 查询是否包含财务规划资产（含在途）
| POST | `/v2/financialPlan/modifyRiskPlan` | 修改风险应急金方案
| POST | `/v2/financialPlan/queryAssetAllocationKyc` | 查询财务规划KYC结果接口
| POST | `/v2/financialPlan/queryEffectCurve` | 查询资产配置建议方案效果图
| POST | `/v2/financialPlan/queryRiskPlan` | 查询风险应急金方案
| POST | `/v2/financialPlan/querySuggestValueByCond` | 根据目标收益率映射默认资产类型
| POST | `/v2/financialPlan/queryPlanResult` | 财务规划方案详情接口

### 投顾频道页-app (3 个接口)
| POST | `/v1/investment/queryProductListByStrategyType` | 查询投顾货架信息
| POST | `/v1/investment/queryDiagnosis` | 查询资产诊断信息
| POST | `/v1/investment/queryHeadlinesNewsInfo` | 查询顶部资讯数据

