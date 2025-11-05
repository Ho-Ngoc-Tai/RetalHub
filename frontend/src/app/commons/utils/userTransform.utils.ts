export interface BackendUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  role: string[];
  is_verify: boolean;
  is_active?: number; // Optional vì một số user có thể không có field này
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  ref_code?: string;
  invited_by?: string;
  password?: string;
  __v?: number;
}

export interface FrontendUser {
  id: string;
  avatar?: string;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  createdDate: string;
  status: "active" | "locked" | "pending";
  lastLogin?: string;
  roles: string[];
  invitedBy?: string; // ID của người mời (cho referral system)
}

export const transformUserData = (backendUser: BackendUser): FrontendUser => {
  const getStatus = (user: BackendUser): "active" | "locked" | "pending" => {
    // Logic kết hợp is_active (block status) và is_verify (OTP status)

    // Nếu user bị block (is_active = 3), luôn hiển thị "Khóa" bất kể OTP status
    if (user.is_active === 3) return "locked";

    // Nếu user bị soft delete, hiển thị "Khóa"
    if (user.deletedAt) return "locked";

    // Nếu user chưa xác thực OTP và không bị block, hiển thị "Chưa xác thực OTP"
    if (!user.is_verify) return "pending";

    // Nếu user đã xác thực OTP và is_active = 1, hiển thị "Hoạt động"
    // Nếu không có is_active field hoặc is_active khác 1 và 3, mặc định là active nếu đã verify
    return "active";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    id: backendUser._id,
    avatar: undefined, // Có thể thêm logic để generate avatar URL
    fullname: backendUser.fullname,
    username: backendUser.username,
    email: backendUser.email,
    phone: undefined, // Backend chưa có field này
    createdDate: formatDate(backendUser.createdAt),
    status: getStatus(backendUser),
    lastLogin: undefined, // Backend chưa có field này
    roles: backendUser.role,
    invitedBy: backendUser.invited_by, // ID người mời
  };
};

interface BackendUserListResponse {
  data: BackendUser[]; // Data is now a direct array
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const transformUserListData = (backendResponse: BackendUserListResponse) => {
  const { data, meta } = backendResponse;

  return {
    items: Array.isArray(data) ? data.map(transformUserData) : [],
    total: meta?.total || 0,
    page: meta?.page || 1,
    limit: meta?.limit || 20,
    totalPages: Math.ceil((meta?.total || 0) / (meta?.limit || 20)),
  };
};
