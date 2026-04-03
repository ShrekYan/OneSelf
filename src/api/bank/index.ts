/**
 * 银行卡模块 API
 */
import api from '@/api/core/axios-instance';

// ==================== 类型定义 ====================

/**
 * 银行卡信息
 */
export interface BankCardItem {
  cardId: string;
  cardTypeCode: string;
  cardTypeDesc: string;
  instId: string;
  instName: string;
  cardHolderName: string | null;
  cardHolderMobile: string;
  signId: string;
  fpStatusCode: string;
  fpStatusDesc: string;
  singleLimit: string;
  dayLimit: string;
  monthLimit: string;
  singleLimitByWan: string;
  dayLimitByWan: string;
  monthLimitByWan: string;
  decisionId: string;
  payPrdType: string;
  baseFeeRate: string;
  baseFeeRateType: string;
  realFeeRate: string | null;
  realFeeRateType: string | null;
  feeDiscount: string | null;
  feeCharge: string;
  gmtCreate: number;
  channelClose: boolean;
  closeMessage: string | null;
  forbidLocalTerm: boolean;
  needActivate: boolean;
  upgrade: boolean;
  extContent: unknown;
  termNeedSmsCode: boolean;
  beyondLimitNeedSmsCode: boolean;
  smsAmountLimit: string;
  unbindBootPageUrl: string | null;
  raiseLimitFlag: boolean;
  raiseLimitUrl: string | null;
  raiseLimitDesc: string | null;
  bankLimitDesc: string;
  bankLoaclAfterTerm?: boolean;
  repeatSignFront?: boolean;
  f2PAgreeList: string[];
  cardMark?: string;
  supportQueryBalance?: boolean;
  mobileSign?: string;
  taxBankExtInfo?: {
    taxQuataNeedCheck: boolean;
    taxTransferType: string;
    taxTransferSignType: string;
    taxQuataAccType: string;
    balanceQueryType: string;
  };
}

/**
 * 查询用户银行卡列表 - 请求参数
 */
export interface GetUserBankListParams {
  userId: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  phoneModel?: string;
  fraudTokenId?: string;
  idxTypeCode?: string;
}

/**
 * 查询用户银行卡列表 - 响应数据
 */
export interface GetUserBankListResponse {
  code: string;
  msg: string;
  realMsg: null;
  data: {
    extFields: Record<string, unknown>;
    code: {
      name: string;
      desc: string;
      code: string;
      service: {
        name: string;
        desc: string;
        code: string;
      };
    };
    message: null;
    rootCode: {
      name: string;
      desc: string;
      code: string;
      service: {
        name: string;
        desc: string;
        code: string;
      };
    };
    rootMessage: null;
    bankList: BankCardItem[];
    upgradeNum: number;
    popFlag: string;
    popTime: string;
    delayTime: string;
    content: string;
    systemError: boolean;
    success: boolean;
  };
  busAddData: null;
}

/**
 * 一键查询帐户行资金账号 - 请求参数
 */
export interface QueryTaxCardNoParams {
  userId: number;
  sessionId: string;
  userLevel: string;
  imei: string;
  source: string;
  version: string;
  guid: string;
  ext?: string;
  phoneModel?: string;
  fraudDeviceId?: string;
  fraudTokenId?: string;
  bizScenarioCode?: string;
  pageMappingCode?: string;
  appSource?: string;
  appVersion?: string;
  smsCode: string;
  signTransNo: string;
}

/**
 * 一键查询帐户行资金账号 - 响应数据
 */
export interface QueryTaxCardNoResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    cardNo: string;
  };
  busAddData: string;
}

/**
 * 税延缴费 - 请求参数
 */
export interface TaxTransferParams {
  userId: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  cardId: string;
  tranAmount: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 税延缴费 - 响应数据
 */
export interface TaxTransferResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    resultCode: string;
    resultMsg: string;
    ackCd: string;
    hostJrnNo: string;
    serialNo: string;
    bankTranDate: string;
  };
  busAddData: string;
}

/**
 * 开户验证页面跳转第三方银行签约页面 - 请求参数
 */
export interface GetBankTaxSignUrlParams {
  userId: string;
  decisionId: string;
}

/**
 * 开户验证页面跳转第三方银行签约页面 - 响应数据
 */
export interface GetBankTaxSignUrlResponse {
  code: string;
  data: {
    signUrl: string;
  };
}

/**
 * 解绑银行卡 - 请求参数
 */
export interface DeleteBankCardParams {
  userId: string;
  cardId: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  smsCode?: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 解绑银行卡 - 响应数据
 */
export interface DeleteBankCardResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    success: boolean;
    needSms: boolean;
    isBankLocalTerm: boolean;
  };
  busAddData: null;
}

/**
 * 发送解绑短信验证码 - 请求参数
 */
export interface SendUnbindSmsCodeParams {
  userId: string;
  cardId: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 发送解绑短信验证码 - 响应数据
 */
export interface SendUnbindSmsCodeResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    result: boolean;
    transNo: string;
    errorCode: string;
    errorMsg: string;
  };
  busAddData: null;
}

/**
 * 增加银行卡 - 请求参数
 */
export interface AddBankCardParams {
  userId: string;
  sessionId: string;
  userLevel: string;
  imei: string;
  source: string;
  version: string;
  guid: string;
  ext?: string;
  phoneModel?: string;
  fraudDeviceId?: string;
  fraudTokenId?: string;
  bizScenarioCode?: string;
  pageMappingCode?: string;
  appSource?: string;
  appVersion?: string;
  idCardNo?: string;
  realName?: string;
  mobile?: string;
  cardNo?: string;
  phoneCode: string;
  smsCode: string;
  signTransNo: string;
}

/**
 * 增加银行卡 - 响应数据
 */
export interface AddBankCardResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    cardId: string;
  };
  busAddData: string;
}

/**
 * 获取银行列表 - 请求参数
 */
export interface GetBankListParams {
  cardType: string;
}

/**
 * 银行信息
 */
export interface BankInfo {
  bankCode: string;
  bankName: string;
  bankLogo: string;
  canUnbind?: boolean;
  supportTax: boolean;
  singleLimit: string;
}

/**
 * 获取银行列表 - 响应数据
 */
export interface GetBankListResponse {
  code: string;
  data: BankInfo[];
  enableAdd: boolean;
  maxCardNum: number;
  msg: string;
}

/**
 * 查询银行预留手机号 - 请求参数
 */
export interface GetBankReserveMobileParams {
  cardId: string;
}

/**
 * 查询银行预留手机号 - 响应数据
 */
export interface GetBankReserveMobileResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    mobile: string;
  };
  busAddData: string;
}

/**
 * 修改银行预留手机号发送短信 - 请求参数
 */
export interface ChangeReserveMobileSendSmsParams {
  userId: string;
  cardId: string;
  newMobile: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 修改银行预留手机号发送短信 - 响应数据
 */
export interface ChangeReserveMobileSendSmsResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    transNo: string;
  };
  busAddData: string;
}

/**
 * 修改银行预留手机号确认 - 请求参数
 */
export interface ChangeReserveMobileConfirmParams {
  userId: string;
  cardId: string;
  newMobile: string;
  smsCode: string;
  transNo: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 修改银行预留手机号确认 - 响应数据
 */
export interface ChangeReserveMobileConfirmResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    success: boolean;
  };
  busAddData: string;
}

/**
 * 协议号查询 - 请求参数
 */
export interface QueryProtocolNoParams {
  userId: string;
  cardId: string;
}

/**
 * 协议号查询 - 响应数据
 */
export interface QueryProtocolNoResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    thirdAgreementNo: string;
  };
  busAddData: unknown;
}

/**
 * 查询银行卡是否可以解绑 - 请求参数
 */
export interface CheckBankCardCanUnbindParams {
  cardId: string;
  userId: string;
}

/**
 * 查询银行卡是否可以解绑 - 响应数据
 */
export interface CheckBankCardCanUnbindResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    canUntied: boolean;
    msg: string;
  };
  busAddData: unknown;
}

/**
 * 银行缴费授权页面获取重定向URL - 请求参数
 */
export interface GetBankAuthRedirectUrlParams {
  userId: string;
  cardId: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 银行缴费授权页面获取重定向URL - 响应数据
 */
export interface GetBankAuthRedirectUrlResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    redirectUrl: string;
    transNo: string;
  };
  busAddData: unknown;
}

/**
 * 预约换卡发送验证码 - 请求参数
 */
export interface ReplaceBankCardSendSmsParams {
  userId: string;
  oldCardId: string;
  newCardNo: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 预约换卡发送验证码 - 响应数据
 */
export interface ReplaceBankCardSendSmsResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    transNo: string;
  };
  busAddData: unknown;
}

/**
 * 预约换卡确认 - 请求参数
 */
export interface ReplaceBankCardConfirmParams {
  userId: string;
  oldCardId: string;
  newCardNo: string;
  smsCode: string;
  transNo: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 预约换卡确认 - 响应数据
 */
export interface ReplaceBankCardConfirmResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    applySuccess: boolean;
  };
  busAddData: unknown;
}

/**
 * 余额查询 - 请求参数
 */
export interface QueryBankCardBalanceParams {
  userId: string;
  sessionId: string;
  source: string;
  version: string;
  guid: string;
  cardId: string;
  phoneModel?: string;
  fraudTokenId?: string;
}

/**
 * 余额查询 - 响应数据
 */
export interface QueryBankCardBalanceResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    availableBalance: string;
  };
  busAddData: unknown;
}

/**
 * 养老账户查询 - 请求参数
 */
export interface QueryTaxBalanceParams {
  userId: string;
  sessionId: string;
  bankCardId: string;
}

/**
 * 养老账户查询 - 响应数据
 */
export interface QueryTaxBalanceResponse {
  code: string;
  msg: string;
  realMsg: string;
  data: {
    enableAmount: string;
  };
  busAddData: string;
}

// ==================== API 方法 ====================

export const bankApi = {
  /**
   * 查询用户银行卡列表
   */
  getUserBankList: async (
    params: GetUserBankListParams,
  ): Promise<GetUserBankListResponse> => {
    return await api.post('/v1/bank/mybanks', params);
  },

  /**
   * 一键查询帐户行资金账号
   */
  queryTaxCardNo: async (
    params: QueryTaxCardNoParams,
  ): Promise<QueryTaxCardNoResponse> => {
    return await api.post('/v1/bank/queryTaxCardNo', params);
  },

  /**
   * 税延缴费
   */
  taxTransfer: async (
    params: TaxTransferParams,
  ): Promise<TaxTransferResponse> => {
    return await api.post('/v1/bank/taxTransfer', params);
  },

  /**
   * 查询银行养老账户开户签约链接接口
   */
  getBankTaxSignUrl: async (
    params: GetBankTaxSignUrlParams,
  ): Promise<GetBankTaxSignUrlResponse> => {
    return await api.post('/v1/bank/queryTaxSignAddress', params);
  },

  /**
   * 解绑银行卡
   */
  deleteBankCard: async (
    params: DeleteBankCardParams,
  ): Promise<DeleteBankCardResponse> => {
    return await api.post('/v1/bank/unbund', params);
  },

  /**
   * 发送解绑短信验证码
   */
  sendUnbindSmsCode: async (
    params: SendUnbindSmsCodeParams,
  ): Promise<SendUnbindSmsCodeResponse> => {
    return await api.post('/v1/bank/sendUnbundSms', params);
  },

  /**
   * 增加银行卡
   */
  addBankCard: async (
    params: AddBankCardParams,
  ): Promise<AddBankCardResponse> => {
    return await api.post('/v1/bank/addbank', params);
  },

  /**
   * 获取银行列表
   */
  getBankList: async (
    params: GetBankListParams,
  ): Promise<GetBankListResponse> => {
    return await api.post('/v1/bank/bankList', params);
  },

  /**
   * 查询银行预留手机号
   */
  getBankReserveMobile: async (
    params: GetBankReserveMobileParams,
  ): Promise<GetBankReserveMobileResponse> => {
    return await api.post('/v1/bank/queryBankReservePhone', params);
  },

  /**
   * 修改银行预留手机号发送短信
   */
  changeReserveMobileSendSms: async (
    params: ChangeReserveMobileSendSmsParams,
  ): Promise<ChangeReserveMobileSendSmsResponse> => {
    return await api.post('/v1/bank/sendChangeMobileCode', params);
  },

  /**
   * 修改银行预留手机号确认
   */
  changeReserveMobileConfirm: async (
    params: ChangeReserveMobileConfirmParams,
  ): Promise<ChangeReserveMobileConfirmResponse> => {
    return await api.post('/v1/bank/confirmChangeMobile', params);
  },

  /**
   * 协议号查询
   */
  queryProtocolNo: async (
    params: QueryProtocolNoParams,
  ): Promise<QueryProtocolNoResponse> => {
    return await api.post('/v1/bank/queryThirdProtocolNo', params);
  },

  /**
   * 查询银行卡是否可以解绑
   */
  checkBankCardCanUnbind: async (
    params: CheckBankCardCanUnbindParams,
  ): Promise<CheckBankCardCanUnbindResponse> => {
    return await api.post('/v1/bank/checkCardCanUntied', params);
  },

  /**
   * 银行缴费授权页面获取重定向URL
   */
  getBankAuthRedirectUrl: async (
    params: GetBankAuthRedirectUrlParams,
  ): Promise<GetBankAuthRedirectUrlResponse> => {
    return await api.post('/v1/bank/getJumpUrl', params);
  },

  /**
   * 预约换卡发送验证码
   */
  replaceBankCardSendSms: async (
    params: ReplaceBankCardSendSmsParams,
  ): Promise<ReplaceBankCardSendSmsResponse> => {
    return await api.post('/v1/bank/appointmentChangeBankCardSendCode', params);
  },

  /**
   * 预约换卡确认
   */
  replaceBankCardConfirm: async (
    params: ReplaceBankCardConfirmParams,
  ): Promise<ReplaceBankCardConfirmResponse> => {
    return await api.post('/v1/bank/confirmAppointmentChangeBankCard', params);
  },

  /**
   * 余额查询
   */
  queryBankCardBalance: async (
    params: QueryBankCardBalanceParams,
  ): Promise<QueryBankCardBalanceResponse> => {
    return await api.post('/v1/bank/queryAccountMoney', params);
  },

  /**
   * 养老账户查询
   */
  queryTaxBalance: async (
    params: QueryTaxBalanceParams,
  ): Promise<QueryTaxBalanceResponse> => {
    return await api.post('/v1/bank/queryEaBalance', params);
  },
};
