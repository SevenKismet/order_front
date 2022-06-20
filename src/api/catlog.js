import request from '@/utils/request'

// 查询一级品类列表
export function getFirstCatlog(data) {
  return request({
    url: '/getFirstCatlog',
    method: 'get',
    params: data
  })
}

// 添加一级品类
export function addFirstCatlog(data) {
  return request({
    url: '/addFirstCatlog',
    method: 'post',
    data
  })
}

