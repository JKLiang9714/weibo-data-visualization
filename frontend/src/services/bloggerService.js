import api from '../utils/request';

export const getBloggers = () => {
    return api.get('/bloggers');
};
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