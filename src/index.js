import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  useHistory,
} from 'react-router-dom'
import './index.scss'
import App from './components/app'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Components
import Dashboard from './components/dashboard'

// Products physical
import Category from './components/products/physical/category'
import Sub_category from './components/products/physical/sub-category'
import Product_list from './components/products/physical/product-list'
import Add_product from './components/products/physical/add-product'
import Product_detail from './components/products/physical/product-detail'

//Product Digital
import Digital_category from './components/products/digital/digital-category'
import Digital_sub_category from './components/products/digital/digital-sub-category'
import Digital_pro_list from './components/products/digital/digital-pro-list'
import Digital_add_pro from './components/products/digital/digital-add-pro'

//Sales
import Orders from './components/sales/orders'
import Transactions_sales from './components/sales/transactions-sales'
//Coupons
import ListCoupons from './components/coupons/list-coupons'
import Create_coupons from './components/coupons/create-coupons'

//Pages
import ListPages from './components/pages/list-page'
import Create_page from './components/pages/create-page'
import Manage_page from './components/pages/manage-page'
import Logout from './components/pages/logout'
import Create_excel from './components/pages/create-excel'
import Create_exceldetail from './components/pages/create-exceldetail'
import Media from './components/media/media'
import List_menu from './components/menus/list-menu'
import Create_menu from './components/menus/create-menu'
import List_user from './components/users/list-user'
import Create_user from './components/users/create-user'
import List_vendors from './components/vendors/list-vendors'
import Create_vendors from './components/vendors/create.vendors'
import Translations from './components/localization/translations'
import Rates from './components/localization/rates'
import Taxes from './components/localization/taxes'
import Profile from './components/settings/profile'
import Reports from './components/reports/report'
import Invoice from './components/auth/invoice'
import Datatable from './components/common/datatable'
import Login from './components/auth/login'

//내차타이어
import Userlist from './components/userlist'
import Userlisttotal from './components/userlisttotal'
import Memberlist from './components/memberlist'
import Memberdetail from './components/memberdetail'
import Orderlist from './components/orderlist'
import Orderlisttotal from './components/orderlistotal'
import Orderdetail from './components/orderdetail'
import Creategroup from './components/creategroup'
import Paidorderlist from './components/paidorderlist'
import Paidorderlistdetail from './components/paidorderlistdetail'

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// const httpLink = new HttpLink({ uri: 'http://localhost:4001' })

const httpLink = new HttpLink({
  uri: 'http://ec2-3-38-180-220.ap-northeast-2.compute.amazonaws.com:4001/',
})

const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const link = authLink.concat(httpLink)
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
})

const Root = () => {
  const history = useHistory()

  return (
    <BrowserRouter basename={'/'}>
      <PerfectScrollbar>
        <Switch>
          <Route exact path={`${process.env.PUBLIC_URL}/`} component={Login} />
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/auth/login`}
            component={Login}
          />

          <App>
            <Route
              path={`${process.env.PUBLIC_URL}/dashboard`}
              component={Dashboard}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/userlist`}
              component={Userlist}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/userlisttotal`}
              component={Userlisttotal}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/memberlist`}
              component={Memberlist}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/memberdetail/:id`}
              component={Memberdetail}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/paidorderlist`}
              component={Paidorderlist}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/paidorderlistdetail/:id`}
              component={Paidorderlistdetail}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/orderlist`}
              component={Orderlist}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/orderlisttotal`}
              component={Orderlisttotal}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/orderdetail/:id`}
              component={Orderdetail}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/creategroup`}
              component={Creategroup}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/products/physical/category`}
              component={Category}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/products/physical/sub-category`}
              component={Sub_category}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/products/physical/product-list`}
              component={Product_list}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/products/physical/product-detail`}
              component={Product_detail}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/products/physical/add-product`}
              component={Add_product}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/products/digital/digital-category`}
              component={Digital_category}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/products/digital/digital-sub-category`}
              component={Digital_sub_category}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/products/digital/digital-product-list`}
              component={Digital_pro_list}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/products/digital/digital-add-product`}
              component={Digital_add_pro}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/sales/orders/:id`}
              component={Orders}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/sales/transactions/:id`}
              component={Transactions_sales}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/coupons/list-coupons`}
              component={ListCoupons}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/coupons/create-coupons`}
              component={Create_coupons}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/pages/list-page`}
              component={ListPages}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/pages/create-page`}
              component={Create_page}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/pages/manage-page`}
              component={Manage_page}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/pages/logout`}
              component={Logout}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/pages/create-excel`}
              component={Create_excel}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/pages/create-exceldetail/:id`}
              component={Create_exceldetail}
            />
            <Route path={`${process.env.PUBLIC_URL}/media`} component={Media} />

            <Route
              path={`${process.env.PUBLIC_URL}/menus/list-menu`}
              component={List_menu}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/menus/create-menu`}
              component={Create_menu}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/users/list-user`}
              component={List_user}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/users/create-user`}
              component={Create_user}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/vendors/list_vendors`}
              component={List_vendors}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/vendors/create-vendors`}
              component={Create_vendors}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/localization/transactions`}
              component={Translations}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/localization/currency-rates`}
              component={Rates}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/localization/taxes`}
              component={Taxes}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/reports/report`}
              component={Reports}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/settings/profile`}
              component={Profile}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/invoice`}
              component={Invoice}
            />

            <Route
              path={`${process.env.PUBLIC_URL}/data-table`}
              component={Datatable}
            />
          </App>
        </Switch>
      </PerfectScrollbar>
    </BrowserRouter>
  )
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById('root'),
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
