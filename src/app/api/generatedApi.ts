import { baseApi as api } from "./baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    listRfqsRfqGet: build.query<
      ListRfqsRfqGetApiResponse,
      ListRfqsRfqGetApiArg
    >({
      query: () => ({ url: `/rfq` }),
    }),
    createRfqRfqPost: build.mutation<
      CreateRfqRfqPostApiResponse,
      CreateRfqRfqPostApiArg
    >({
      query: (queryArg) => ({
        url: `/rfq`,
        method: "POST",
        body: queryArg.createSwapRfqRequest,
      }),
    }),
    stpRfqPricingRfqRfqIdStopPricingPost: build.mutation<
      StpRfqPricingRfqRfqIdStopPricingPostApiResponse,
      StpRfqPricingRfqRfqIdStopPricingPostApiArg
    >({
      query: (queryArg) => ({
        url: `/rfq/${queryArg.rfqId}:stop-pricing`,
        method: "POST",
      }),
    }),
    changeRfqRfqRfqIdPatch: build.mutation<
      ChangeRfqRfqRfqIdPatchApiResponse,
      ChangeRfqRfqRfqIdPatchApiArg
    >({
      query: (queryArg) => ({
        url: `/rfq/${queryArg.rfqId}`,
        method: "PATCH",
        body: queryArg.changeSwapRfqRequest,
      }),
    }),
    getRfqRfqRfqIdGet: build.query<
      GetRfqRfqRfqIdGetApiResponse,
      GetRfqRfqRfqIdGetApiArg
    >({
      query: (queryArg) => ({ url: `/rfq/${queryArg.rfqId}` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedApi };
export type ListRfqsRfqGetApiResponse =
  /** status 200 Successful Response */ ListRfqsResponse;
export type ListRfqsRfqGetApiArg = void;
export type CreateRfqRfqPostApiResponse =
  /** status 201 Successful Response */ CreateRfqResponse;
export type CreateRfqRfqPostApiArg = {
  createSwapRfqRequest: CreateSwapRfqRequest;
};
export type StpRfqPricingRfqRfqIdStopPricingPostApiResponse = unknown;
export type StpRfqPricingRfqRfqIdStopPricingPostApiArg = {
  rfqId: string;
};
export type ChangeRfqRfqRfqIdPatchApiResponse =
  /** status 200 Successful Response */ ChangeRfqResponse;
export type ChangeRfqRfqRfqIdPatchApiArg = {
  rfqId: string;
  changeSwapRfqRequest: ChangeSwapRfqRequest;
};
export type GetRfqRfqRfqIdGetApiResponse =
  /** status 200 Successful Response */ RfqDto;
export type GetRfqRfqRfqIdGetApiArg = {
  rfqId: string;
};
export type PayReceive = "pay" | "receive";
export type Currency = "JPY";
export type RfqDto = {
  rfq_id: string;
  notional: string;
  effective_date: string;
  maturity_date: string;
  fixed_leg: PayReceive;
  currency: Currency;
};
export type ListRfqsResponse = {
  rfqs: RfqDto[];
};
export type CreateRfqResponse = {
  rfq_id: string;
  revision: number;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: any;
  ctx?: object;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type CreateSwapRfqRequest = {
  notional: number | string;
  effective_date: string;
  maturity_date: string;
  fixed_leg: PayReceive;
  currency: Currency;
  assigned_trader: string;
  registered_by: string;
};
export type ChangeRfqResponse = {
  rfq_id: string;
  revision: number;
};
export type ChangeSwapRfqRequest = {
  notional?: number | string | null;
  effective_date?: string | null;
  maturity_date?: string | null;
  fixed_leg?: PayReceive | null;
  currency?: Currency | null;
};
export const {
  useListRfqsRfqGetQuery,
  useCreateRfqRfqPostMutation,
  useStpRfqPricingRfqRfqIdStopPricingPostMutation,
  useChangeRfqRfqRfqIdPatchMutation,
  useGetRfqRfqRfqIdGetQuery,
} = injectedRtkApi;
