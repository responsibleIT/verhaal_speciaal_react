export const isProd =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === "production-environment";
export const isAcceptance =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === "acceptance-environment";
export const isLocal = process.env.NEXT_PUBLIC_ENV === "local";

export const siteName = "Fonk Boilerplate";
export const FEUrl = isProd
  ? "https://production-url-here"
  : "https://staging-url-here";
export const robots = "nofollow, noindex";
export const BEUrl = isProd
  ? "https://prd.cms.url"
  : "http://stg.cms.url";
export const endpointUrl = `${BEUrl}/api`;
export const authToken =
  "Authorization: Bearer token-here";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const GTM_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID ?? "";
