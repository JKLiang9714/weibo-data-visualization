import api from '../utils/request';

export const getBloggers = () => {
    return api.get('/bloggers');
};
export const getBlogger = (params) => {
    return api.get(`/bloggers/${params.name}`);
}
export const getBloggerFriends = (params) => {
    return api.get(`/bloggers/${params.name}/friends`);
}
export const getBloggerWeiboContent = (params) => {
    return api.get(`/bloggers/${params.name}/weiboContent`);
}
export const getBloggerWordCount = (params) => {
    return api.get(`/bloggers/${params.name}/wordCount`);
}
export const getSexDistribution = (params) => {
    return api.get(`/statistic/sexDistribution`);
}
export const getLocationDistribution = (params) => {
    return api.get(`/statistic/locationDistribution`);
}