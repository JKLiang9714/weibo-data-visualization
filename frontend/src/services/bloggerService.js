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