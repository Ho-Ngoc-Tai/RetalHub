//Endpoint Common API
export const NEXT_API_SIGNIN_ENDPOINT = "/auth/login";
export const NEXT_LOGOUT_ENDPOINT = "/auth/logout";
export const NEXT_REFRESH_TOKEN_ENDPOINT = "/auth/checkRefreshToken";
export const NEXT_API_ADMIN_PROFILE_ENDPOINT = "/member/profile";
export const NEXT_API_USERS_ENDPOINT = "/user";
export const NEXT_API_MEMBER_ENDPOINT = "/member";
export const NEXT_API_MEMBER_LOCK_ENDPOINT = (mid: string) => `/member/${mid}/lock`;
export const NEXT_API_MEMBER_DELETE_ENDPOINT = (mid: string) => `/member/${mid}/delete`;
