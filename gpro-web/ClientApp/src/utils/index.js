export const url = 'http://localhost:60932';
export const isMobile = window.innerWidth < 768;
export const date_format = 'HH:mm DD/MM/YYYY';
export const getHeader = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return {
    headers: { 
      Authorization: 'Bearer ' + currentUser.token 
    }
  };
};