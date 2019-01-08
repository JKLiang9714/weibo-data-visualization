import api from '../utils/request';


export const getBloggersCount = (params) => {
    if (params.name) {
        return api.get(`/bloggers/count?name=${params.name}`);
    } else {
        return api.get(`/bloggers/count`);
    }
}
export const getBloggers = (params) => {
    if (params.name) {
        return api.get(`/bloggers?page=${params.page}&limit=${params.pageSize}&name=${params.name}`);
    } else {
        return api.get(`/bloggers?page=${params.page}&limit=${params.pageSize}`);
    }
}
export const getBlogger = (params) => {
    return api.get(`/bloggers/${params.id}`);
}
export const getBloggerFriends = (params) => {
    return api.get(`/bloggers/${params.id}/friends`);
}
export const getBloggerWeiboContent = (params) => {
    return api.get(`/bloggers/${params.id}/weiboContent`);
}
export const getSexDistribution = (params) => {
    return api.get(`/statistic/sex`);
}
export const getLocationDistribution = (params) => {
    return api.get(`/statistic/location`);
}