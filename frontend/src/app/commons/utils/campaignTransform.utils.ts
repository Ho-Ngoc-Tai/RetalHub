/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TopN {
  rank: number;
  amount: number;
}
export interface BackendCampaign {
  id: string;
  title: string;
  description: string;
  status: number;
  startAt: string;
  endAt: string;
  visibility: string;
  reward: {
    topN: TopN[];
    referral: {
      amount: number;
    };
  };
  lock: {
    isLocked: boolean;
    lockReason: string;
    lockedAt: string;
    lockedBy: string;

    unlockReason: string;
    unlockedAt: string;
    unlockedBy: string;
  };
  createdAt: string;
  isLocked: boolean;
}

export interface FrontendCampaign {
  id: string;
  title: string;
  description: string;
  status: number;
  startAt: string;
  endAt: string;
  visibility: string;

  reward: {
    topN: TopN[];
    referral: {
      amount: number;
    };
  };
  lock?: {
    isLocked: boolean;
    lockReason?: string;
    lockedAt?: string;
    lockedBy?: string;
    unlockReason?: string;
    unlockedAt?: string;
    unlockedBy?: string;
  };
  createdAt: string;
  isLocked: boolean;
}

export const transformCampaignData = (backendUser: BackendCampaign): FrontendCampaign => {
  return {
    id: backendUser.id,
    title: backendUser.title,
    description: backendUser.description,
    visibility: backendUser.visibility,
    status: backendUser.status,
    startAt: backendUser.startAt,
    endAt: backendUser.endAt,
    reward: backendUser.reward,
    createdAt: backendUser.createdAt,
    lock: backendUser.lock,
    isLocked: backendUser.isLocked,
  };
};

interface BackendCampaignListResponse {
  data: BackendCampaign[]; // Data is now a direct array
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const transformCampaignListData = (backendResponse: BackendCampaignListResponse) => {
  const { data, meta } = backendResponse;

  return {
    items: Array.isArray(data) ? data.map(transformCampaignData) : [],
    total: meta?.total || 0,
    page: meta?.page || 1,
    limit: meta?.limit || 20,
    totalPages: Math.ceil((meta?.total || 0) / (meta?.limit || 20)),
  };
};

//Detail
export type InfoCampaign = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: number;
  assets: {
    bannerUrl: string;
    thumbnailUrl: string;
  };
  type?: string | undefined;
  visibility?: string | undefined;
  labels: {
    name: string;
    imageUrl: string;
  }[];
  timeframe: {
    startAt: Date | null;
    endAt: Date | null;
  };
  socialTags: (string | undefined)[];
};

export type ConfigCampaign = {
  voting: {
    limits: {
      maxVotesPerUser?: number | undefined;
    };
    voteCost: {
      amount?: number | undefined;
    };
  };
  invite: {
    link?:
      | {
          expiresAt?: Date | undefined;
        }
      | undefined;
    utmDefaults?:
      | {
          utm_source?: string | undefined;
          utm_medium?: string | undefined;
          utm_campaign?: string | undefined;
          utm_term?: string | undefined;
          utm_content?: string | undefined;
        }
      | undefined;
  };
  rewards: {
    topN: {
      amount: number;
      rank: number;
    }[];
    referral: {
      amount: number;
    };
  };
  progress: {
    goals: {
      code: string;
      label: string;
      target: number;
      current: number;
    }[];
  };
};
export type TokensCampaign = {
  items: {
    tokenId: string;
    order: number;
    isActive: true;
    symbol: string;
    name: string;
    logoUrl: string;
  }[];
};

export type CampaignFormData = {
  campaign: InfoCampaign;
  config: ConfigCampaign;
  tokens: TokensCampaign;
  lock?: {
    isLocked: boolean;
    lockReason?: string;
    lockedAt?: string;
    lockedBy?: string;
    unlockReason?: string;
    unlockedAt?: string;
    unlockedBy?: string;
  };
  createBy?: string;
  createAt?: Date;
  updateAt?: Date;
};

export const formatCampaignResponse = (res: any): CampaignFormData => {
  return {
    campaign: {
      id: res?.campaign?.id || "",
      code: res?.campaign?.code || "",
      title: res?.campaign?.title || "",
      description: res?.description || "",
      status: res?.campaign?.status ?? 0,
      assets: {
        bannerUrl: res?.campaign?.assets?.bannerUrl || "",
        thumbnailUrl: res?.campaign?.assets?.thumbnailUrl || "",
      },
      type: res?.campaign?.type,
      visibility: res?.campaign?.visibility,
      labels: (res?.campaign?.labels || []).map((label: any) => ({
        name: label?.name || "",
        imageUrl: label?.imageUrl || "",
      })),
      timeframe: {
        startAt: res?.campaign?.timeframe?.startAt ? new Date(res.campaign.timeframe.startAt) : null,
        endAt: res?.campaign?.timeframe?.endAt ? new Date(res.campaign.timeframe.endAt) : null,
      },
      socialTags: res?.socialTags || [],
    },

    config: {
      voting: {
        limits: {
          maxVotesPerUser: res?.config?.voting?.limits?.maxVotesPerUser,
        },
        voteCost: {
          amount: res?.config?.voting?.voteCost?.amount,
        },
      },
      invite: {
        link: res?.config?.invite?.link
          ? {
              expiresAt: res?.config?.invite?.link?.expiresAt ? new Date(res.config.invite.link.expiresAt) : undefined,
            }
          : undefined,
        utmDefaults: res?.config?.invite?.utmDefaults
          ? {
              utm_source: res.config.invite.utmDefaults.utm_source,
              utm_medium: res.config.invite.utmDefaults.utm_medium,
              utm_campaign: res.config.invite.utmDefaults.utm_campaign,
              utm_term: res.config.invite.utmDefaults.utm_term,
              utm_content: res.config.invite.utmDefaults.utm_content,
            }
          : undefined,
      },
      rewards: {
        topN: (res?.config?.rewards?.topN || []).map((r: any) => ({
          rank: r?.rank ?? 0,
          amount: r?.amount ?? 0,
        })),
        referral: {
          amount: res?.config?.rewards?.referral?.amount ?? 0,
        },
      },
      progress: {
        goals: (res?.config?.progress?.goals || []).map((g: any) => ({
          code: g?.code || "",
          label: g?.label || "",
          target: g?.target ?? 0,
          current: g?.current ?? 0,
        })),
      },
    },

    tokens: {
      items: (res?.tokens?.items || []).map((t: any) => ({
        tokenId: t?.tokenId || "",
        name: t?.name || "",
        symbol: t?.symbol || "",
        order: t?.order || 0,
        isActive: t?.isActive || false,
        logoUrl: t?.logoUrl || t?.img || "",
      })),
    },
    lock: res.lock,
    createBy: res?.createdBy,
    createAt: res?.createdAt,
    updateAt: res?.updatedAt,
  };
};

export const transformCampaignForList = (res: any, id: string): FrontendCampaign => {
  return {
    id: id,
    title: res.campaign.title,
    description: res.campaign.description,
    status: res.campaign.status,
    startAt: res.campaign.timeframe.startAt,
    endAt: res.campaign.timeframe.endAt,
    visibility: res.campaign.visibility,
    reward: {
      topN: res.config.rewards.topN.map((r: any) => ({
        rank: r.rank,
        amount: r.amount,
      })),
      referral: {
        amount: res.config.rewards.referral.amount,
      },
    },
    lock: {
      isLocked: res.lock?.isLocked || false,
      lockReason: res.lock?.lockReason,
      lockedAt: res.lock?.lockedAt,
      lockedBy: res.lock?.lockedBy,
      unlockReason: res.lock?.unlockReason,
      unlockedAt: res.lock?.unlockedAt,
      unlockedBy: res.lock?.unlockedBy,
    },
    createdAt: res.createAt,
    isLocked: res.isLocked,
  };
};
