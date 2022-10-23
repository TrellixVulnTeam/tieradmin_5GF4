import React, { Fragment, useState, useEffect, useRef } from 'react'
import Breadcrumb from './common/breadcrumb'
import { useQuery, useMutation } from '@apollo/client'
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
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
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
      item_price
      wholeamount
      name
      paidstatus
      shipping_amount
      product_main_image
      keepingamount
      productid

      User {
        name
        id
      }
    }
  }
`

const Query_Reservadmin = gql`
  query reservationbyadmin($adminId: Int) {
    reservationbyadmin(adminId: $adminId) {
      userId
      date
      time
      id
      tireinfo
      tiretotal
      serviceinfo
      servicetotal
      total
      adminId
      clientId
    }
  }
`

const ME_QUERY = gql`
  query me {
    me {
      id
      name
      email
    }
  }
`

const Orderlistto = () => {
  var node = useRef()
  const [open, setOpen] = useState(false)
  const [resultdata, sestresultdata] = useState([])
  const [orderdata, setorderdata] = useState()
  const [orderdatadetail, setorderdatadetail] = useState()
  const [demendata, setdemendata] = useState()
  const [formState, setFormState] = useState({
    orderdata: '',
    users: '',
    id: '',
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

  const { error, data: datame } = useQuery(ME_QUERY, {
    onCompleted: (datame) => {
      console.log('data!3', datame.me.id)
      setFormState({
        ...formState,
        id: datame.me.id,
      })
    },
    onError: (error) => {
      console.log('error!3', error)
    },
  })
  const { error: error212, data: data2121 } = useQuery(Query_Reservadmin, {
    variables: {
      adminId: Number(formState.id),
    },
    onCompleted: (data2121) => {
      console.log('query com', data2121.reservationbyadmin)
      sestresultdata(data2121.reservationbyadmin)
    },
    onError: (error212) => {
      console.log('error212!3', error212)
    },
  })

  const contactListColumns = [
    {
      text: 'id',
      dataField: 'id',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '예약 날짜 / 시간',
      dataField: '코드',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, item) => (
        <div className="d-flex gap-3">
          {item.date} / {item.time}
        </div>
      ),
    },
    {
      text: '총 예약금액',
      dataField: '이름',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, item) => (
        <div className="d-flex gap-3">
          {Number(item.total)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          원
        </div>
      ),
    },
    {
      text: '주문내역',
      dataField: '가격',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, item) => (
        <div className="d-flex gap-3">
          <Link to={`/orderdetail/${item.id}`}>상세보기</Link>
        </div>
      ),
    },
  ]

  const { SearchBar } = Search
  return (
    <Fragment>
      {formState && (
        <>
          <Breadcrumb title="예약현황" parent="Dashboard" />
          <Container fluid={true}>
            <Row>
              <Col xl="12 xl-100">
                <Card>
                  <CardHeader>
                    <h5>예약 목록</h5>
                  </CardHeader>
                  <CardBody>
                    <Col md="12">
                      <Label for="review">
                        총 예약 내역 - {resultdata?.length}개
                      </Label>

                      <div className="table-responsive">
                        <Table
                          className="table mb-0"
                          style={{ fontSize: '15px' }}
                        >
                          {resultdata?.length > 0 && (
                            <PaginationProvider
                              pagination={paginationFactory({
                                sizePerPage: 500,
                                totalSize: resultdata.length, // replace later with size(users),
                                custom: true,
                              })}
                              keyField={'id'}
                              columns={contactListColumns}
                              data={resultdata}
                            >
                              {({ paginationProps, paginationTableProps }) => {
                                return (
                                  <ToolkitProvider
                                    keyField={'id'}
                                    data={resultdata}
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
                        </Table>
                      </div>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </Fragment>
  )
}

// javascript:void(0)

export default Orderlistto
