export interface BackendReferralUser {
  id: string;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  referral_code: string;
  total_invited: number;
  total_rewards_earned: number;
  status: "active" | "banned";
  created_at: string;
}

export interface FrontendReferralUser {
  id: string;
  avatar?: string;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  referralCode: string;
  totalReferrals: number;
  commissionEarned: number;
  status: "active" | "banned";
  createdDate: string;
}

export const transformReferralUserData = (backendUser: BackendReferralUser): FrontendReferralUser => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    id: backendUser.id,
    avatar: undefined, // Backend chưa có avatar
    fullname: backendUser.fullname,
    username: backendUser.username,
    email: backendUser.email,
    phone: backendUser.phone, // Now available in backend
    referralCode: backendUser.referral_code,
    totalReferrals: backendUser.total_invited,
    commissionEarned: backendUser.total_rewards_earned,
    status: backendUser.status,
    createdDate: formatDate(backendUser.created_at),
  };
};

export interface BackendReferralUserForList {
  id: string;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  referral_code: string;
  total_invited: number;
  total_rewards_earned: number;
  status: "active" | "banned";
  created_at: string;
}

interface BackendReferralUsersListResponse {
  data: {
    users_info: BackendReferralUserForList[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

const transformReferralUserDataFromList = (backendUser: BackendReferralUserForList): FrontendReferralUser => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    id: backendUser.id,
    avatar: undefined,
    fullname: backendUser.fullname,
    username: backendUser.username,
    email: backendUser.email,
    phone: backendUser.phone,
    referralCode: backendUser.referral_code,
    totalReferrals: backendUser.total_invited,
    commissionEarned: backendUser.total_rewards_earned,
    status: backendUser.status,
    createdDate: formatDate(backendUser.created_at),
  };
};

export const transformReferralUsersListData = (backendResponse: BackendReferralUsersListResponse) => {
  const { data } = backendResponse;
  const { users_info, meta } = data;

  return {
    items: Array.isArray(users_info) ? users_info.map(transformReferralUserDataFromList) : [],
    total: meta?.total || 0,
    page: meta?.page || 1,
    limit: meta?.limit || 20,
    totalPages: Math.ceil((meta?.total || 0) / (meta?.limit || 20)),
  };
};

// Referral Detail interfaces
export interface BackendInvitee {
  id: string;
  invitee_reward: number;
  createdAt: string;
  user_info: {
    id: string;
    username: string;
    fullname: string;
    email: string;
    status: "active" | "banned";
  };
}

export interface FrontendInvitee {
  id: string;
  inviteeReward: number;
  joinDate: string;
  formattedJoinDate: string;
  status: "active" | "banned";
  userInfo: {
    id: string;
    username: string;
    fullname: string;
    email: string;
    status: "active" | "banned";
  };
}

export interface BackendReferralUserDetail extends BackendReferralUser {
  invitees: {
    data: BackendInvitee[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface FrontendReferralUserDetail extends FrontendReferralUser {
  invitees: {
    data: FrontendInvitee[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const transformInviteeData = (backendInvitee: BackendInvitee): FrontendInvitee => {
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    id: backendInvitee.id,
    inviteeReward: backendInvitee.invitee_reward || 0,
    joinDate: backendInvitee.createdAt,
    formattedJoinDate: formatDateTime(backendInvitee.createdAt),
    status: backendInvitee.user_info.status,
    userInfo: {
      id: backendInvitee.user_info.id,
      username: backendInvitee.user_info.username,
      fullname: backendInvitee.user_info.fullname,
      email: backendInvitee.user_info.email,
      status: backendInvitee.user_info.status,
    },
  };
};

export const transformReferralUserDetailData = (
  backendDetail: BackendReferralUserDetail
): FrontendReferralUserDetail => {
  const userDetail = transformReferralUserData(backendDetail);

  return {
    ...userDetail,
    invitees: {
      data: Array.isArray(backendDetail.invitees.data) ? backendDetail.invitees.data.map(transformInviteeData) : [],
      meta: {
        page: backendDetail.invitees.meta.page,
        limit: backendDetail.invitees.meta.limit,
        total: backendDetail.invitees.meta.total,
        totalPages: Math.ceil(backendDetail.invitees.meta.total / backendDetail.invitees.meta.limit),
      },
    },
  };
};
