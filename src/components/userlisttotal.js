import React, { Fragment, useState, useRef } from 'react'
import Breadcrumb from './common/breadcrumb'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import {
  Navigation,
  Box,
  MessageSquare,
  Users,
  Briefcase,
  CreditCard,
  ShoppingCart,
  Calendar,
} from 'react-feather'
import CountUp from 'react-countup'
import { Chart } from 'react-google-charts'
import moment from 'moment'
import { Bar, Line } from 'react-chartjs-2'
import {
  lineOptions,
  buyOption,
  employeeData,
  employeeOptions,
} from '../constants/chartData'
// image impoer
import user2 from '../assets/images/dashboard/user2.jpg'
import user1 from '../assets/images/dashboard/user1.jpg'
import man from '../assets/images/dashboard/man.png'
import user from '../assets/images/dashboard/user.png'
import designer from '../assets/images/dashboard/designer.jpg'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Media,
  Row,
  Table,
} from 'reactstrap'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'

const GET_ORDER = gql`
  query orders {
    orders {
      createdAt
      multiorder
      id
      paidstatus
      User {
        name
      }
    }
  }
`
const GET_USERS = gql`
  query commonusers {
    commonusers {
      id
      createdAt
      name
      email
      adminid
    }
  }
`

const Userlisttotal = () => {
  var node = useRef()
  const [formState, setFormState] = useState({
    orderdata: '',
    users: '',
  })

  var { loading, data } = useQuery(GET_ORDER, {
    onCompleted: (data) => {
      console.log('data.', data.orders)
      setFormState({
        ...formState,
        orderdata: data.orders,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })
  var { data: data1 } = useQuery(GET_USERS, {
    onCompleted: (data1) => {
      console.log("ddd",data1)
      setFormState({
        ...formState,
        users: data1.commonusers,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })

  const contactListColumns = [
    {
      text: '가입 날짜',
      dataField: 'date',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, item) => (
        <div className="d-flex gap-3">
          {moment(new Date(item.createdAt)).format('YYYY-MM-DD-A hh:mm')}
        </div>
      ),
    },
    {
      text: '회원 ID',
      dataField: 'id',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '성함',
      dataField: 'name',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '이메일',
      dataField: 'email',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },{
      text: '속한 사업자 ID',
      dataField: 'adminId',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      }, formatter: (cellContent, item) => (
        <div className="d-flex gap-3">
          {item.adminid}
        </div>
      ),
    },


    


  ]

  const { SearchBar } = Search
  return (
    <>
      <Fragment>
        {formState && (
          <>
            <Breadcrumb title="전체 유저리스트" parent="Dashboard" />
            <Container fluid={true}>
              <Row>
                <Col xl="12 xl-100">
                  <Card>
                    <CardHeader>
                      <h5> 회원 리스트 - 총 {formState.users.length}명</h5>
                    </CardHeader>
                    <CardBody>
                      <div >
                       
                          {formState.users?.length > 0 && (
                            <PaginationProvider
                              pagination={paginationFactory({
                                sizePerPage: 500,
                                totalSize: formState.users.length, // replace later with size(users),
                                custom: true,
                              })}
                              keyField={'id'}
                              columns={contactListColumns}
                              data={formState.users}
                            >
                              {({ paginationProps, paginationTableProps }) => {
                                return (
                                  <ToolkitProvider
                                    keyField={'id'}
                                    data={formState.users}
                                    columns={contactListColumns}
                                    bootstrap4
                                    search
                                  >
                                    {(toolkitProps) => (
                                      <React.Fragment>
                                        <Row className="mb-2">
                                          <Col sm="4">
                                            <div className="search-box ms-2 mb-2 d-inline-block">
                                              <div className="position-relative">
                                                <SearchBar
                                                  {...toolkitProps.searchProps}
                                                />

                                                <i className="bx bx-search-alt search-icon" />
                                              </div>
                                            </div>
                                          </Col>
                                          <Col sm="8"></Col>
                                        </Row>

                                        <Row>
                                          <Col xl="12">
                                            <div className="table-responsive">
                                              <BootstrapTable
                                                keyField={'id'}
                                                {...toolkitProps.baseProps}
                                                {...paginationTableProps}
                                                defaultSorted={[
                                                  {
                                                    dataField: 'id', // if dataField is not match to any column you defined, it will be ignored.
                                                    order: 'desc', // desc or asc
                                                  },
                                                ]}
                                                classes={
                                                  'table align-middle table-bordered table-hover text-centered'
                                                }
                                                bordered={false}
                                                striped={false}
                                                responsive
                                                ref={node}
                                              />
                                            </div>
                                          </Col>
                                        </Row>
                                        <Row className="align-items-md-center mt-30">
                                          <Col className="pagination pagination-rounded justify-content-end mb-2">
                                            <PaginationListStandalone
                                              {...paginationProps}
                                            />
                                          </Col>
                                        </Row>
                                      </React.Fragment>
                                    )}
                                  </ToolkitProvider>
                                )
                              }}
                            </PaginationProvider>
                          )}
                     
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </Fragment>{' '}
    </>
  )
}



export default Userlisttotal
