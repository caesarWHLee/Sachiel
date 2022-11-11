const envList: string[] = ['dev', 'prod']
const env: string = envList.includes(String(process.env.ENV))
  ? String(process.env.Env)
  : 'dev'

// environment independent
const siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ?? ''
const cmsApiUrl: string = process.env.NEXT_PUBLIC_CMS_API_URL ?? ''
let feedbackFormConfig: Partial<Record<'formId' | 'fieldId', string>> = {}
try {
  feedbackFormConfig = JSON.parse(process.env.FEEDBACK_FORM_CONFIG ?? '')
} catch (e) {
  feedbackFormConfig = {
    formId: '',
    fieldId: '',
  }
}

// environemnt dependent
let gaTrackingId: string
let urlOfJsonForlandingPage: string
switch (env) {
  case 'dev':
    gaTrackingId = process.env.GOOGLE_ANALYTICS_TRACKING_ID ?? 'UA-83609754-1'
    urlOfJsonForlandingPage = process.env.URL_OF_JSON_FOR_LANDING_PAGE ?? ''
    break
  case 'prod': {
    gaTrackingId = process.env.GOOGLE_ANALYTICS_TRACKING_ID ?? 'UA-83609754-1'
    urlOfJsonForlandingPage = process.env.URL_OF_JSON_FOR_LANDING_PAGE ?? ''
    break
  }
}

export {
  env,
  siteUrl,
  cmsApiUrl,
  gaTrackingId,
  urlOfJsonForlandingPage,
  feedbackFormConfig,
}
