import { service } from '@/utils/axios'

// IMAGE
// upload image
export function uploadImage(data: any) { return service({ url: '/upload/uploadImage', method: 'post', data }) }

// USER
// user login api
export function loginApi(data: API.LoginParams): Promise<API.LoginResult> {
  return service({ url: '/staff/account/login', method: 'post', data })
}
// user list
export function getUserList(params: API.UserListParams): Promise<API.UserListResult> {
  return service({ url: '/staff/user/search', method: 'get', params })
}
// update user is active
export function postUserIsActive(data: API.UserIsActiveParams): Promise<API.APIResult<null>> {
  return service({ url: '/staff/user/update_is_active', method: 'post', data })
}

// INFORMATION
// Information list
export function getInformationList(data: API.InformationListParams): Promise<API.InformationListResult> {
  return service({ url: '/staff/article/list', method: 'post', data })
}
// Information add
export function postAddInformation(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/create', method: 'post', data })
}
// Information delete
export function postDeleteInformation(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/delete', method: 'post', data })
}
// Information change status
export function postChangeInformationStatus(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/change/isactive', method: 'post', data })
}
// Information detail by id
export function postInformationDetailById(data: { id: number }): Promise<API.InformationDetailResult> {
  return service({ url: '/staff/article/detail', method: 'post', data })
}
// Information update
export function postInformationUpdate(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/update', method: 'post', data })
}


// INFORMATION LABEL  
// Information label list
export function getInformationLabelList(params: API.PageState): Promise<API.InformationLabelListResult> {
  return service({ url: '/staff/article/tag/all', method: 'get', params })
}
// Information label add
export function postAddInformationLabel(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/tag/add', method: 'post', data })
}
// Information label update
export function postUpdateInformationLabel(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/tag/update', method: 'post', data })
}
// Information label search
export function getSearchInformationLabel(params: any): Promise<API.InformationLabelListResult> {
  return service({ url: '/staff/article/tag/search', method: 'get', params })
}

// INFORMATION SPECIAL TOPIC
// Information special topic list
export function getInformationSpecialTopicList(params: any): Promise<API.InformationSpecialTopicListResult> {
  return service({ url: '/staff/article/collection/all', method: 'get', params })
}
// Information special topic add
export function postAddInformationSpecialTopic(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/collection/add', method: 'post', data })
}
// Information special topic update
export function postUpdateInformationSpecialTopic(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/collection/update', method: 'post', data })
}
// Information special topic disable
export function postDisableInformationSpecialTopic(data: any): Promise<API.APIResult<null>> {
  return service({ url: '/staff/article/collection/disable', method: 'post', data })
}
// Information special topic search
export function getSearchInformationSpecialTopic(params: any): Promise<API.InformationSpecialTopicListResult> {
  return service({ url: '/staff/article/collection/search', method: 'get', params })
}

// NEWS FLASH
// News Flash list
export function getNewsFlashList(params: any): Promise<API.NewsFlashListResult> {
  return service({ url: '/newsFlash/getNewsFlashList', method: 'get', params })
}
// News Flash source list
export function getNewsFlashSourceList(params: any): Promise<API.NewsFlashSourceListResult> {
  return service({ url: '/newsFlash/getNewsFlashSourceList', method: 'get', params })
}

// HOME
// home page data
export function getHomeAllList(params: any): Promise<API.HomeAllListResult> {
  return service({ url: '/home/getAllList', method: 'get', params })
}
