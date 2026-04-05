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
    transformedPayload: Transformation[]
}
