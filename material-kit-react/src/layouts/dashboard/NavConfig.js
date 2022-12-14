// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Son əməliyyatlar',
    path: '/dashboard/app',
    icon: getIcon('eva:checkmark-circle-2-fill'),
  },
  {
    title: 'İstifadəçi məlumatları',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Məhsul',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Telefon nömrəsi',
    path: '/dashboard/phoneNumber',
    icon: getIcon('eva:phone-fill'),
  },
  { 
    title: 'Ödənişlər',
    path: '/dashboard/payment',
    icon: getIcon('entypo:credit')
  },
  {
    title: 'Ünvan',
    path: '/address',
    icon: getIcon('eva:pin-fill'),
  },
  {
    title: 'Qeydiyyat',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },

 

];

export default navConfig;
