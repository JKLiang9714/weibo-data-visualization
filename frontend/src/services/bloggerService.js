import api from '../utils/request';

export const getBloggers = () => {
    return api.get('/bloggers');
};
export const getBlogger = (params) => {
    return api.get(`/bloggers/${params.name}`);
}