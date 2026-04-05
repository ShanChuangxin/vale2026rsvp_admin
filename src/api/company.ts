import request from '@/utils/request'

// 获取用户列表
export function getCompanyList(params: any) {
  console.log("请求用户数据");
  return request({
    url: '/api/vale2026rsvp/get_company_list',
    method: 'post',
    params
  })
}
