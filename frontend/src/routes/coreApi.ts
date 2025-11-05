//CORE ENDPOINT API
export const CORE_LOGIN_ENDPOINT = "admin/auth/signin";
export const CORE_CHECK_REFRESH_TOKEN_ENDPOINT = "admin/refreshToken";
export const CORE_LOGOUT_ENDPOINT = "auth/logout";
export const CORE_MEMBER_LIST_ENDPOINT = "admin/member/list";
export const CORE_MEMBER_ENDPOINT = "admin/member/register";
export const CORE_MEMBER_PROFILE_ENDPOINT = "admin/profile";
export const CORE_API_ROLE_ENDPOINT = "admin/roles";
export const CORE_MEMBER_UPDATE_ENDPOINT = (mid: string) => `admin/member/${mid}/update`;
export const CORE_MEMBER_LOCK_ENDPOINT = (mid: string) => `admin/member/${mid}/lock`;
export const CORE_MEMBER_DELETE_ENDPOINT = (mid: string) => `admin/member/${mid}/delete`;
