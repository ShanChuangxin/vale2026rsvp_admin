import request from '@/utils/request'

// 获取用户列表
export function getUserList(params: any) {
  console.log("请求用户数据");
  return request({
    url: '/api/vale2026rsvp/get_user_list',
    method: 'post',
    params
  })
}
// 获取用户详情
export function getUserDetail(data: any) {
  console.log("请求用户数据");
  return request({
    url: '/api/vale2026rsvp/get_user_detail',
    method: 'post',
    data: data,
  })
}

// 更新用户信息
export function updateUser(data: any) {
  console.log("更新用户数据");
  return request({
    url: '/api/vale2026rsvp/update_user',
    method: 'post',
    data: data,
  })
}

// 导出 Excel
export function exportUser() {
  return request({
    url: '/api/users/export/',
    method: 'get',
    responseType: 'blob'
  })
}