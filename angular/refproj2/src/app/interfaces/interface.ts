/*export interface ApplicationState {
    untransformedPayload: any[];
}*/

export interface Transformation {
    user: any,
    accounts: any[],
    portfolioSummary: any,
    alerts: any[]
}

export interface ApplicationState {
    untransformedPayload: any[],
    userSummary: any[],                         // main grid - 1 transformation per component display?
    transformedPayload: Transformation[],
    selectedUser: any
}


/*
export interface ApplicationState {
    untransformedPayload: any[],
    desktopMainSummary: see above
    desktopDetail: see above
    mobile: see above
}
*/
