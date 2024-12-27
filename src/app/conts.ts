export const menuItems =
  [
    {icon: 'pi pi-home' , label: 'DASHBOARD' , route: '/dashboard'},
    { icon: 'pi pi-users', label: 'CLIENTS', route: '/clients' },
    {icon: 'pi pi-truck' , label: 'ORDERS' , route: '/orders'},
    {icon: 'pi pi-car' , label: 'SPECIAL ORDERS' , route: '/special-order'},
    { icon: 'pi pi-users', label: 'Technicals', route: '/technicals' },
    { icon: 'pi pi-server', label: 'Services', route: '/services' },
    { icon: 'pi pi-clock', label: 'WORKING HOURS', route: '/working_hours' },
    { icon: 'pi pi-globe', label: 'COUNTRIES', route: '/country' },
    { icon: 'pi pi-building', label: 'CITIES', route: '/city' },
    { icon: 'pi pi-times', label: 'CANCEL REASON', route: '/cancel-reason' },
    { icon: 'pi pi-book', label: 'COMPLAINT', route: '/complaint' },
    { icon: 'pi pi-folder', label: 'CONTRACT TYPE', route: '/contract-type' },
    { icon: 'pi pi-qrcode', label: 'COPONE', route: '/copone' },
    { icon: 'pi pi-credit-card', label: 'PAYMENT WAY', route: '/paymentWay' },
    { icon: 'pi pi-shopping-bag', label: 'PACKAGE', route: '/package' },
    { icon: 'pi pi-trophy', label: 'TECHNICAL SPECIALIST', route: '/technical-specialist' },
    { icon: 'pi pi-phone', label: 'CONTACT US', route: '/contact-us' },
    { icon: 'pi pi-database', label: 'ABOUT US', route: '/about-us' },




  ]

export const sliderViewType  =[
  {
    name:'AdminTool',
    code:1
  },
  {
    name:'FrontEnd',
    code:2
  },
  {
    name:'Both',
    code:3
  }
]

export const userType = [
  {
    name: 'SuperAdmin',
    code: 1
  },
  {
    name: 'Admin',
    code: 2
  },
  {
    name: 'Technical',
    code: 3
  },
  {
    name: 'Assistant',
    code: 4
  },
  {
    name: 'Client',
    code: 5
  }
]

export const coponeOfferTypeList = [
  {
    name: 'Gift',
    code: 1
  },
  {
    name: 'Offer',
    code: 2
  }
]

export const coponeTypeList = [
  {
    name: 'Gift',
    code: 1
  },
  {
    name: 'Offer',
    code: 2
  }
]

export const PackageTypeList = [
  {
    name: 'Daily',
    code: 1
  },
  {
    name: 'Weekly',
    code: 2
  },
  {
    name: 'Monthly',
    code: 3
  },
  {
    name: 'Qurater',
    code: 4
  },
  {
    name: 'Biannual',
    code: 5
  },
  {
    name: 'Yearly',
    code: 6
  }
]

export const packageHourVistList=[
  {
    name:'4',
    code:4
  },
  {
    name:'8',
    code:8
  }
]

export const gender =[
  {
    name:'Male',
    code:1
  },
  {
    name:'Female',
    code:2
  }
]

export const order_status =[
  { name: 'Pending', id: 0,code: 0,color: '#c1cd6a' },
  { name: 'Paid', id: 1,code: 1, color: '#c1cd6a' },
  { name: 'AssignedToProvider', id: 2,code: 2, color: '#b16acd' },
  { name: 'InTheWay', id: 3,code: 3, color: '#ccc053' },
  { name: 'TryingSolveProblem', id: 4,code: 4, color: '#9b9d9c' },
  { name: 'Solved', id: 5,code: 5, color: '#49e97c' },
  { name: 'ClientConfirmation', id: 6, code: 6, color: '#49e97c' },
  { name: 'Completed', id: 7, code: 7, color: '#49e97c' },
  { name: 'Canceled', id: 8,code: 8, color: '#e94949' }
]
export const special_order_status =[
  { name: 'Pending', id: 1, code: 1, color: '#c1cd6a' },
  { name: 'Completed', id: 2, code: 2,color: '#3fac4e' },
  { name: 'Canceled', id: 3,code: 3, color: '#c32722' }
]

export const special_order_enum =[
  {
    name:'Emergency',
    code:1
  },
  {
    name:'Special',
    code:2
  }
]


