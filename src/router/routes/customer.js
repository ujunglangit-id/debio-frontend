import globalFunctions from "@/lib/functions";

const customerRoutes = [{
  path: '/customer',
  component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer'),
  beforeEnter: globalFunctions.checkIsLoggedIn,
  children: [
    {
      path: '/',
      name: 'customer-home',
      meta: {
        pageHeader: 'Home',
        drawerButtons: [
          { text: "Dashboard", disabled: false, active: true, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Result", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/Home')
    },
    {
      path: '/customer/order-history',
      name: 'order-history',
      meta: {
        pageHeader: 'Order history',
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Result", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", active: true, disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/OrderHistory.vue')
    },
    {
      path: '/customer/order-history-detail/:number',
      name: 'order-history-detail',
      meta: {
        pageHeader: 'Order Detail',
        breadcrumbs: [
          { text: 'Order History', href: '/customer/order-history' },
          { text: 'Order Detail', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Result", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", active: true, disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/OrderHistoryDetail')
    },
    {
      path: '/customer/order-history-detail/:number/dna-collection-instructions',
      name: 'dna-collection-instructions',
      meta: {
        pageHeader: 'DNA Collection Instructions',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Order History', href: '/customer/order-history' },
          { text: 'Order Detail', href: '/customer/order-history-detail/:number' },
          { text: 'DNA Collection Instructions', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Result", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", active: true, disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/DnaCollectionInstructions.vue')
    },
    {
      path: '/customer/result-test/:number',
      name: 'result-test',
      meta: {
        pageHeader: 'Test Result',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Order History', href: '/customer/order-history' },
          { text: 'Test Result', disabled: true }
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Result", active: true, disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/TestResult/result.vue')
    },
    {
      path: '/customer/request-test',
      name: 'request-test',
      meta: {
        pageHeader: 'Request a Test',
        // breadcrumbs: [
        //   { text: 'Home', href: '/customer' },
        //   { text: 'Request a Test', disabled: true },
        // ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Result", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTest')
    },
    {
      path: '/customer/request-test/checkout',
      name: 'request-test-checkout',
      meta: {
        pageHeader: 'Checkout',
        breadcrumbs: [
          { text: 'Request a Test', href: '/customer/request-test' },
          { text: 'Checkout', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Result", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTestCheckout')
    },
    {
      path: '/customer/request-test/receipt',
      name: 'request-test-receipt',
      meta: {
        pageHeader: 'Your Order Receipt',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Request a Test', href: '/customer/request-test' },
          { text: 'Checkout', href: '/customer/request-test/checkout' },
          { text: 'Receipt', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Result", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTestReceipt.vue')
    },
    {
      path: '/customer/result-test-all',
      name: 'all-test-result',
      meta: {
        pageHeader: 'Test Results',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Test Results', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Result", active: true, disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/TestResult')
    },
    {
      path: '/customer/genome-files',
      name: 'genome-files',
      meta: {
        pageHeader: 'Genome Files',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Genome Files', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false },
          { text: "Request Test", disabled: true },
          { text: "Test Result", disabled: true },
          { text: "Order History", disabled: true },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/GenomeFiles.vue')
    },
  ]
},
]

export default customerRoutes