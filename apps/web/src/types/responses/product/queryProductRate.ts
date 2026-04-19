export interface QueryProductRateResponse {
  data: {
    productRate: {
      manageRatio: string
      trusteeRatio: string
      saleServiceRate: string
    }
    purchaseRateList: Array<{
      from: number
      to: number
      fee: string
      feeType: string
    }>
    subscribeRateList: Array<{
      from: number
      to: number
      fee: string
      feeType: string
    }>
    redeemRateList: Array<{
      from: number
      to: number
      fee: string
      feeType: string
    }>
    trusteeRatio: string
    manageRatio: string
    saleServiceRate: string
  }
}
