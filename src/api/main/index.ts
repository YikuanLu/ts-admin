import { AxiosPromise } from 'axios'
import { ListRes } from '@/components/common/table/types'
import {
  DataProps,
  httpGet,
  httpPut,
  httpPost,
  httpDelete
} from '@/utils/axios'

// 素材管理-素材列表
export function getMaterialList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/reptile/admin/sourceMaterial', data)
}

// 素材管理-素材详情
export function getMaterialItem<T = {}>(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet<T>(`/reptile/admin/sourceMaterial/${data.id}`)
}

// 素材管理-素材编辑
export function editMaterialItem<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpPut<T>('/reptile/admin/sourceMaterial', data)
}

// 素材管理-审核通过
export function auditMaterialItem<T = {}>(data: { id: string }): AxiosPromise<DataProps> {
  return httpPut<T>(`/reptile/admin/sourceMaterial/${data.id}/audit`)
}

// 素材管理-审核失败
export function auditFailMaterialItem<T = {}>(data: { id: string }): AxiosPromise<DataProps> {
  return httpPut<T>(`/reptile/admin/sourceMaterial/${data.id}/auditFail`)
}

// 素材管理-引用素材
export function quoteMaterial<P>(data: P): AxiosPromise<DataProps> {
  return httpPost<P>('/information/admin/articles/other/quote', data)
}

// 素材管理-批量删除素材
export function removeMaterials<P>(data: P): AxiosPromise<DataProps> {
  return httpDelete<P>('/reptile/admin/sourceMaterial/batchDelete', data, true)
}

// 素材管理-批量审核通过
export function batchAuditMaterials<P>(data: P): AxiosPromise<DataProps> {
  return httpPut<P>('/reptile/admin/sourceMaterial/batchAudit', data, true)
}
// export function batchAuditMaterials<P>(data: P): AxiosPromise<DataProps> {
//   return httpPut<P>('/reptile/admin/sourceMaterial/batchAudit', data, true)
// }

// 素材管理-批量审核不通过
export function batchAuditFailMaterials<P>(data: P): AxiosPromise<DataProps> {
  return httpPut<P>('/reptile/admin/sourceMaterial/batchAuditFail', data, true)
}

// 文章管理-文章列表
export function getArticlesList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/articles/searchArticlesInfoList', data)
}

// 文章管理-新建文章
export function createArticle<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/information/admin/articles/createArticlesInfo', data)
}

// 文章管理-获取文章详情
export function getArticleDetail<T = {}>(data:T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/articles/getArticlesInfoDto', data)
}

// 文章管理-修改文章状态
export function updateAarticlesStatus<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/articles/updateArticlesInfoStatus', data)
}

// 文章管理-删除文章
export function removeAarticlesStatus<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/articles/deleteArticlesInfoById', data)
}

// 文章管理-撤回文章
export function revokedAarticles<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/articles/revokedArticles', data)
}

// 评论管理-评论列表
export function getCommentlList(data: ListRes): AxiosPromise<DataProps> {
  return httpGet<ListRes>('/behavior/admin/comment', data)
}

// 评论管理-评论排序
export function commentOrder<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpPut<T>('/behavior/admin/comment/order', data)
}

// 评论管理-屏蔽评论
export function commentClose<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpPut<T>('/behavior/admin/comment/close', data)
}

// 评论管理-添加评论
export function addCommentItem<P>(data: P): AxiosPromise<DataProps> {
  return httpPost<P>('/behavior/admin/comment', data)
}
