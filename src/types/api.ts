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
        descriptionEn: string
        descriptionZh: string
        contentEn: string
        contentZh: string
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
        descriptionEn: string
        descriptionZh: string
        backgroundImageUrl: string
        isActive: boolean
        createdAt: string
        updatedAt: string
    }

    interface NewsFlashInfoType {
        id: number
        newsFlashTitleZh: string
        newsFlashContentZh: string
        newsFlashTitleEn: string
        newsFlashContentEn: string
        newsFlashStatus: boolean
        createdAt: string
        author: string
        updatedAt: string
        newsFlashSourceUrl: string
        newsFlashSourceSite: NewsFlashSourceType
    }

    interface NewsFlashSourceType {
        id: number
        sourceSiteUrl: string
        lastCollectTime: string
        collectTotalNum: number
        sourceStatus: boolean
        createdAt: string
        updatedAt: string
        author: string
    }

    interface HomeAllDataType {
        id: number
        createdAt: string
        userNumber: number
        informationNumber: number
        newsFlashNumber: number
        aiNumber: number
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
        total: number
    }>

    type HomeAllListResult = APIResult<{
        total: number
        data: HomeAllDataType[]
    }>
}
