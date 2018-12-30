import api from '../utils/request';

export const getBloggers = () => {
    return api.get('/bloggers');
};
export const getBlogger = (name) => {
    return api.get(`/bloggers/${name}`);
}