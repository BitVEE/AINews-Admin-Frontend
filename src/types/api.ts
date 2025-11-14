declare namespace API {
    interface APIResult<T> {
        code: number
        data: T
        msg: string
    }

    interface PageState {
        page: number
        size: number
        total?: number
    }

    interface UserType {
        id: number
        username: string
        uuid: string
        email: string
        password: string
        secondPassword: string
        vsysAddress: string
        solanaAddress: string
        tonAddress: string
        phantomAddress: string
        isActive: boolean
        actionDays: number
        actionToday: boolean
        createdAt: string
        updatedAt: string
    }

    interface InformationInfoType {
        id: number
        titleEn: string
        titleZh: string
        titleZhHans: string
        titleKr: string
        titleEs: string
        descriptionEn: string
        descriptionZh: string
        descriptionZhHans: string
        descriptionKr: string
        descriptionEs: string
        contentEn: string
        contentZh: string
        contentZhHans: string
        contentKr: string
        contentEs: string
        isStar: boolean
        author: string
        createdAt: string
        updatedAt: string
        collectionIds: number[]
        tagIds: number[]
        isActive: boolean
        coverImageUrl: string
    }

    interface InformationLabelType {
        id: number
        name: string
        isActive: boolean
        createdAt: string
        updatedAt: string
    }

    interface InformationSpecialTopicType {
        id: number
        nameEn: string
        nameZh: string
        nameZhHans: string
        nameKr: string
        nameEs: string
        descriptionEn: string
        descriptionZh: string
        descriptionZhHans: string
        descriptionKr: string
        descriptionEs: string
        backgroundImageUrl: string
        isActive: boolean
        createdAt: string
        updatedAt: string
    }

    interface NewsFlashInfoType {
        id: number
        titleZh: string
        titleZhHans: string
        titleKr: string
        titleEs: string
        titleEn: string
        contentZh: string
        contentZhHans: string
        contentKr: string
        contentEs: string
        contentEn: string
        isActive: boolean
        createdAt: string
        author: string
        updatedAt: string
        link: string
        source: string
        score: number
    }

    interface NewsFlashSourceType {
        id: number
        createdAt: string
        endTime: string
        itemsCount: number
        status: string
        taskId: string
        totalCount: number
    }

    interface HomeAllDataType {
        id: number
        createdAt: string
        userNumber: number
        informationNumber: number
        newsFlashNumber: number
        aiNumber: number
    }

    interface AdType {
        id: number
        createdAt: string
        updatedAt: string
        title: string
        imageUrl: string
        language: "en" | "zh" | "kr" | "es" | "zh_hans"
        url: string
        isActive: boolean
    }

    interface LoginParams {
        name: string
        password: string
    }

    type LoginResult = APIResult<{
        jwtToken: string
        name: string
    }>

    interface UserListParams {
        page: number
        size: number
        nickname?: string
    }

    type UserListResult = APIResult<{
        data: UserType[]
        total: number
    }>

    interface UserIsActiveParams {
        ids: number[]
        isActive: boolean
    }

    interface InformationListParams {
        pagination: PageState
        startDate?: string
        endDate?: string
        title?: string
    }

    type InformationListResult = APIResult<{
        articles: InformationInfoType[]
        pagination: PageState
    }>

    type InformationDetailResult = APIResult<{
        article: InformationInfoType
        tags: InformationLabelType[]
        collections: InformationSpecialTopicType[]
    }>

    type InformationLabelListResult = APIResult<{
        data: InformationLabelType[]
        total: number
    }>

    type InformationSpecialTopicListResult = APIResult<{
        data: InformationSpecialTopicType[]
        total: number
    }>

    type NewsFlashListResult = APIResult<{
        data: NewsFlashInfoType[]
        total: number
    }>

    type NewsFlashSourceListResult = APIResult<{
        data: NewsFlashSourceType[]
        pagination: PageState
    }>

    type HomeAllListResult = APIResult<{
        total: number
        data: HomeAllDataType[]
    }>

    type AdListResult = APIResult<{
        Advertises: AdType[]
        total: number
    }>

    type ProjectListResult = APIResult<{
        tokens: ProjectType[]
        total: number
    }>

    interface ProjectType {
        name: string;
        symbol: string;
        address: string;
        logoUri: string;
        createdAt: string;
        updatedAt: string;
        marketCap: number;
        holder: number;
        price: number;
        priceChangePercent30m: number;
        trade30m: number;
        buy30m: number;
        sell30m: number;
        volume30m: number;
        volumeBuy30m: number;
        volumeSell30m: number;
        priceChangePercent1h: number;
        trade1h: number;
        buy1h: number;
        sell1h: number;
        volume1h: number;
        volumeBuy1h: number;
        volumeSell1h: number;
        priceChangePercent2h: number;
        trade2h: number;
        buy2h: number;
        sell2h: number;
        volume2h: number;
        volumeBuy2h: number;
        volumeSell2h: number;
        priceChangePercent4h: number;
        trade4h: number;
        buy4h: number;
        sell4h: number;
        volume4h: number;
        volumeBuy4h: number;
        volumeSell4h: number;
        priceChangePercent8h: number;
        trade8h: number;
        buy8h: number;
        sell8h: number;
        volume8h: number;
        volumeBuy8h: number;
        volumeSell8h: number;
        priceChangePercent24h: number;
        trade24h: number;
        buy24h: number;
        sell24h: number;
        volume24h: number;
        volumeBuy24h: number;
        volumeSell24h: number;
        websiteUrl: string;
        xUrl: string;
        descriptionEn: string;
        DescriptionZhHans: string;
        descriptionZh: string;
        descriptionKr: string;
        descriptionEs: string;
        status: 0 | 1 | 2 | 3;
        isInPumpWebsite: boolean;
    }

    type ProjectWatchListResult = APIResult<{
        tokens: ProjectWatchType[];
    }>

    interface ProjectWatchType {
        address: string;
        startPrice: number; // 买入价格
        lastPrice: number; // 最新价格
        topPrice: number; // 峰值价格
        priceChange: number; // 当前价格相对于峰值价格的变化比例，百分数
        createdAt: string;
        updatedAt: string;
    }

    // offerWall common stats
    interface OfferWallCommonStatsResult {
        msg: string;
        data: {
            totalUserCount: number, // 总用户数
            totalOfferCount: number, // 总Offer数
            todayUserCount: number, // 今日注册用户数
            todayOfferCount: number, // 今日新增Offer数
            totalOfferRewardPoint: number, // 总完成Offer奖励积分数
            todayOfferRewardPoint: number, // 今日完成Offer奖励积分数
            totalWithdrawDonePoint: number, // 总已提现积分数
            totalWithdrawDoingPoint: number, // 总提现审核中积分数
            totalOfferDoneCount: number, // 总Offer完成数
            todayOfferDoneCount: number, // 今日Offer完成数
            totalOfferDonePercent: number, // 总Offer完成率（百分数）
        };
    }
    // offerWall stats chart
    interface OfferWallStatsChartResult {
        msg: string;
        data: {
            timeLine: string[],
            data: number[]
        };
    }

    interface OfferWallUserListResult {
        code: number;
        msg: string;
        data: {
            users: OfferWallUserType[];
            total: number;
        };
    }
    interface OfferWallUserType {
        id: number;
        email: string;
        info: string
        point: number; // 剩余积分
        infoState: 0 | 1; // 是否已填写用户信息
        dailyState: 0 | 1; // 今日是否完成签到,
        tgGroupState: 0 | 1; // 是否已加TG群
        inviteCode: string; // 自己的邀请码，初始为空
        parentInviteCode: string; // 绑定上级的邀请码，初始为空
        createdAt: string; // 注册时间
        updatedAt: string; // 最近登录时间
        lastDaily: string; // 最近一次签到时间
        inviteCount: number; // 已邀请的用户数
        invitePoint: number; // 已邀请用户奖励积分数
        offerDoneCount: number; // 已完成任务数
        withdrawPoint: number; // 已提现总积分
        state: 0 | 1 | 2; // 状态
        ipCountry: string;
        userCountry: string;
        channel: string; // 渠道
        inviteUserList: OfferWallInvitationType[];
        applyList: OfferWallType[];
        OfferRecordList: OfferWallOfferRecordType[];
        dailyList: OfferWallUserActionLogType[];
        joinTgGroupList: OfferWallUserActionLogType[];
    }
    interface OfferWallUserDetailResult {
        code: number;
        msg: string;
        data: {
            user: OfferWallUserType;
        };
    }
    interface OfferWallInvitationListResult {
        code: number;
        msg: string;
        data: {
            data: OfferWallInvitationType[];
            total: number;
        };
    }
    interface OfferWallInvitationType {
        parentUserId: number;
        parentUserEmail: string;
        childUserId: number;
        childUserEmail: string;
        deviceId: string;
        state: 0 | 1;
        returnPoint: number;
        createdAt: string;
        childUserCreatedAt: string;
        childUserUpdatedAt: string;
    }

    // offerWall user action log
    interface OfferWallUserActionLogListResult {
        code: number;
        msg: string;
        data: {
            data: OfferWallUserActionLogType[];
            total: number;
        };
    }
    interface OfferWallUserActionLogType {
        userId: number;
        deviceId: string;
        action: number;
        point: number;
        createdAt: string;
        ipCountry: string;
        userCountry: string;
        extra: any;
    }
    interface OfferWallOfferRecordListResult {
        code: number;
        msg: string;
        data: {
            data: OfferWallOfferRecordType[];
            total: number;
        };
    }
    interface OfferWallOfferRecordType {
        id: number;
        userId: number;
        deviceId: string;
        offerId: number;
        source: number;
        sourceOfferId: string;
        name: string;
        action: number;
        point: number;
        progress: number;
        createdAt: string;
        updatedAt: string;
    }

    interface OfferWallListResult {
        data: OfferWallType[];
        total: number;
    }
    interface OfferWallType {
        id: number;
        userId: number;
        walletType: string;
        walletAddress: string;
        email: string;
        point: number;
        status: 0 | 1 | 2;
        createdAt: string;
        updatedAt: string;
        failReason?: string;
        transactionHash?: string;
    }

    interface OfferWallOfferDataType {
        app_desc: string;
        app_name: string;
        click_url: string;
        countries: string;
        daily_cap: string;
        offer_id: string;
        offer_name: string;
        package_name: string;
        payout: string;
        payout_type: string;
        platform: string;
        preview_link: string;
    }

    interface OfferWallOfferType {
        id: number;
        sourceOfferId: string;
        state: number;
        source: number;
        platform: string;
        description: string;
        url: string;
        percent: number; // 分成比例，1-100
        data: OfferWallOfferDataType;
        displayName: string;
        blockSimulator: number;
        blockVpn: number;
        currentCap: number;
    }

    interface OfferWallOfferListResult {
        data: OfferWallOfferType[];
        total: number;
    }


    interface OfferWallOfferDetailResult {
        offer: OfferWallOfferType;
    }

    // GARP
    interface GARPListResult {
        data: GARPType[];
        total: number;
    }
    interface GARPType {
        id: number;
        source: string;
        email: string;
        note: string;
        extra: any; // 额外信息，json格式
        created_at: string;
    }

}
